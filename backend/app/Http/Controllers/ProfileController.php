<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Traveler;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    // Retrieve the authenticated user's profile
    public function getProfileById($userId)
    {
        try {
            // Log the incoming user ID for debugging
            \Log::info('Fetching profile for user ID: ' . $userId);
            
            $user = User::with('traveler')->find($userId);
            
            if (!$user) {
                \Log::warning('User not found for ID: ' . $userId);
                return response()->json(['message' => 'User not found'], 404);
            }
            
            $jsonContent = file_get_contents(base_path('currentID.json'));
            $jsonData = json_decode($jsonContent, true);
            
            $hobby = $jsonData['hobby'] ?? ($user->traveler ? $user->traveler->preferences : 'Not set');
            
            $profile = [
                'name' => $jsonData['name'] ?? $user->username,  
                'id' => $user->user_id,
                'email' => $user->email,
                'person_id' => $user->person_id,
                'avatar' => $user->avatar ?? 'profile_icon.png',
                'role' => $user->role,
                'preferences' => $hobby,
                'search_history' => $user->traveler ? $user->traveler->search_history : null,
                'password' => str_repeat('*', 8),
                'phone_number' => $jsonData['phone_number'] ?? 'Not set',
                'address' => $jsonData['address'] ?? 'Not set',
                'hobby' => $hobby
            ];
        
            return response()->json($profile, 200);
        } catch (\Exception $e) {
            \Log::error('Profile fetch error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error fetching profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // Update the user's email, person ID, or password
    public function updateProfile(Request $request)
    {
        try {
            // Get current user ID from currentID.json
            $jsonContent = file_get_contents(base_path('currentID.json'));
            $data = json_decode($jsonContent, true);
            $userId = $data['user_id'];

            $user = User::find($userId);
            if (!$user) {
                return response()->json(['message' => 'User not found'], 404);
            }

            // Validate the password
            if ($request->has('password')) {
                $request->validate([
                    'password' => 'required|string|min:8'
                ]);
                
                // Update the password with hashing
                $user->password = Hash::make($request->password);
            }

            $user->save();

            return response()->json([
                'message' => 'Password updated successfully',
                'password' => str_repeat('*', 8)
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Password update error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Retrieve the user's history (preferences and search history)
    public function getHistory()
    {
        $user = Auth::user();
        if (!$user || !$user->traveler) {
            return response()->json(['message' => 'History not available'], 404);
        }

        $history = [
            'preferences' => $user->traveler->preferences,
            'search_history' => $user->traveler->search_history,
        ];

        return response()->json($history, 200);
    }
    
    public function updateBasicInfo(Request $request)
    {
        try {
            // Read current currentID.json
            $jsonPath = base_path('currentID.json');
            $jsonContent = file_get_contents($jsonPath);
            $data = json_decode($jsonContent, true);

            // Add the new fields to the existing data
            $data['phone_number'] = $request->phone_number;
            $data['address'] = $request->address;
            $data['hobby'] = $request->hobby;
            $data['name'] = $request->name;
            
            // Save back to currentID.json
            file_put_contents($jsonPath, json_encode($data, JSON_PRETTY_PRINT));

            // Update email in database
            if ($request->email) {
                $user = User::find($data['user_id']);
                if ($user) {
                    $user->email = $request->email;
                    $user->save();
                }
            }

            // Update preferences in travelers table
            $traveler = Traveler::where('user_id', $data['user_id'])->first();
            if ($traveler) {
                $traveler->preferences = $request->hobby;
                $traveler->save();
            }

            return response()->json([
                'message' => 'Profile updated successfully',
                'data' => $data
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Profile update error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
