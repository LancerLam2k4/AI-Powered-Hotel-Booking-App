<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BankController;

Route::post('register', [AuthController::class, 'registerTraveler']);
Route::post('login', [AuthController::class, 'login']);
Route::post('/check-email', [AuthController::class, 'checkEmailAndSendCode']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/chat', [ChatController::class, 'getChatResponse']);

//Booking Traveler
Route::get('/bookings', [BookingController::class, 'listRooms']);
Route::post('/room_Details', [BookingController::class, 'room_Details']);
Route::get('/showDetail', [BookingController::class, 'showDetail']);
Route::post('/reserve-room', [BookingController::class, 'reserveRoom']);
Route::get('/booking-Room/{roomId}', [BookingController::class, 'bookingRoom']);
Route::post('/bookRoom', [BookingController::class, 'bookRoom']);
Route::post('/bookingDetails', [BookingController::class, 'bookingDetails']);
Route::post('/payment', [BankController::class, 'createPayment']);
Route::get('/payment-cancel', [BankController::class, 'paymentCancel'])->name('api.payment.cancel');
Route::get('/payment-success', [BankController::class, 'paymentSuccess'])->name('api.payment.success');
//Admin function
Route::post('/add-room',[RoomController::class,'store']);

//Edit Delete Room
Route::delete('/rooms/{roomId}', [RoomController::class, 'destroy']);
Route::put('/rooms/{roomId}', [RoomController::class, 'update']);
Route::post('/rooms/{roomId}/remove-image', [RoomController::class, 'removeImage']);
Route::post('/rooms/{roomId}/update-images', [RoomController::class, 'updateImages']);

// Profile
Route::get('/profile/{userId}', [ProfileController::class, 'getProfileById']);
Route::put('/profile', [ProfileController::class, 'updateProfile']);
Route::get('/profile/history', [ProfileController::class, 'getHistory']);
Route::post('/profile/basic-info', [ProfileController::class, 'updateBasicInfo']);

Route::get('/getCurrentUserId', function() {
    try {
        $jsonPath = base_path('currentID.json');
        
        // If file doesn't exist or is empty, create it with default values
        if (!file_exists($jsonPath) || empty(file_get_contents($jsonPath))) {
            $defaultData = [
                'user_id' => null,
                'phone_number' => 'Not set',
                'address' => 'Not set',
                'name' => '',
                'hobby' => 'Not set'
            ];
            file_put_contents($jsonPath, json_encode($defaultData, JSON_PRETTY_PRINT));
        }
        
        $jsonContent = file_get_contents($jsonPath);
        $data = json_decode($jsonContent, true);
        
        if (!$data || !isset($data['user_id'])) {
            return response()->json(['error' => 'No user ID found'], 404);
        }
        
        // Ensure all required fields exist
        $data = array_merge([
            'phone_number' => 'Not set',
            'address' => 'Not set',
            'name' => '',
            'hobby' => 'Not set'
        ], $data);
        
        // Save the complete data back to file
        file_put_contents($jsonPath, json_encode($data, JSON_PRETTY_PRINT));
        
        return response()->json($data);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error reading user ID: ' . $e->getMessage()], 500);
    }
});




