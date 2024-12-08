<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Traveler;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    // Retrieve the authenticated user's profile
    public function getProfile()
{
    try {
        // Đường dẫn tới file currentID.json
        $currentJsonPath = __DIR__ . '/../../../currentID.json';

        // Kiểm tra file JSON
        if (!file_exists($currentJsonPath)) {
            return response()->json(['message' => 'currentID.json file not found.'], 404);
        }

        // Đọc dữ liệu từ file JSON
        $currentData = json_decode(file_get_contents($currentJsonPath), true);

        // Kiểm tra user_id
        if (!isset($currentData['user_id'])) {
            return response()->json(['message' => 'User ID is missing in currentID.json.'], 400);
        }

        $userId = $currentData['user_id'];

        // Tìm kiếm user trong bảng users
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Lấy thông tin user cơ bản
        $profile = [
            'user_id' => $user->user_id,
            'username' => $user->username,
            'email' => $user->email,
            'avatar' => $user->avatar ?? 'profile_icon.png',
            'role' => $user->role,
            'password' => $user->password,
            'person_id' => $user->person_id,
        ];

        // Xử lý thông tin theo vai trò
        if ($user->role === 'traveler') {
            $traveler = Traveler::where('user_id', $userId)->first();
            if ($traveler) {
                $profile['preferences'] = $traveler->preferences;
                $profile['search_history'] = $traveler->search_history;
            }
        } elseif ($user->role === 'admin') {
            $admin = Admin::where('user_id', $userId)->first();
            if ($admin) {
                $profile['admin_level'] = $admin->level; // Ví dụ trường bổ sung
            }
        }

        // Trả về thông tin
        return response()->json($profile, 200);

    } catch (\Exception $e) {
        \Log::error('Error fetching profile: ' . $e->getMessage());
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

            // Update only if new values are provided
            if ($request->phone_number) {
                $data['phone_number'] = $request->phone_number;
            }
            if ($request->address) {
                $data['address'] = $request->address;
            }
            if ($request->hobby) {
                $data['hobby'] = $request->hobby;
            }
            if ($request->name) {
                $data['name'] = $request->name;
            }

            // Ensure the file is writable and save with proper formatting
            if (!file_put_contents($jsonPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
                throw new \Exception('Failed to write to currentID.json');
            }

            // Update email in database if provided
            if ($request->email) {
                $user = User::find($data['user_id']);
                if ($user) {
                    $user->email = $request->email;
                    $user->save();
                }
            }

            // Update preferences in travelers table
            if ($request->hobby) {
                $traveler = Traveler::where('user_id', $data['user_id'])->first();
                if ($traveler) {
                    $traveler->preferences = $request->hobby;
                    $traveler->save();
                }
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
