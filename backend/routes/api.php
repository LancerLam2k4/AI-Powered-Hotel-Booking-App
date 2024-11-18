<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;

Route::post('register', [AuthController::class, 'registerTraveler']);
Route::post('login', [AuthController::class, 'login']);
Route::post('/check-email', [AuthController::class, 'checkEmailAndSendCode']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/chat', [ChatController::class, 'getChatResponse']);

//Booking Traveler
Route::get('/bookings', [BookingController::class, 'listRooms']);


//Admin function
Route::post('/add-room',[RoomController::class,'store']);

// Profile
Route::get('/profile/{userId}', [ProfileController::class, 'getProfileById']);
Route::put('/profile', [ProfileController::class, 'updateProfile']);
Route::get('/profile/history', [ProfileController::class, 'getHistory']);
Route::post('/profile/basic-info', [ProfileController::class, 'updateBasicInfo']);

Route::get('/getCurrentUserId', function() {
    try {
        $jsonContent = file_get_contents(base_path('currentID.json'));
        $data = json_decode($jsonContent, true);
        
        if (!$data || !isset($data['user_id'])) {
            return response()->json(['error' => 'No user ID found'], 404);
        }
        
        return response()->json($data);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error reading user ID'], 500);
    }
});




