<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;

Route::post('register', [AuthController::class, 'registerTraveler']);
Route::post('login', [AuthController::class, 'login']);
Route::post('/check-email', [AuthController::class, 'checkEmailAndSendCode']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/chatbot', [ChatController::class, 'getChatResponse']);



