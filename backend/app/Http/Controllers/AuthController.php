<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Mail;
use App\Models\EmailVerification;
use App\Mail\VerificationCodeMail;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Traveler;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;;


class AuthController extends Controller
{
public function checkEmailAndSendCode(Request $request)
{
    $request->validate(['email' => 'required|email']);

    $email = $request->email;

    // Kiểm tra xem email đã tồn tại chưa
    $userExists = User::where('email', $email)->exists();

    if ($userExists) {
        return response()->json(['message' => 'Email đã được sử dụng'], 422);
    }

    // Tạo mã xác thực ngẫu nhiên
    $verificationCode = rand(100000, 999999);

    // Lưu mã xác thực vào bảng email_verifications
    EmailVerification::updateOrCreate(
        ['email' => $email],
        ['code' => $verificationCode]
    );

    // Gửi email chứa mã xác thực
    Mail::to($email)->send(new VerificationCodeMail($verificationCode));

    return response()->json(['message' => 'Mã xác thực đã được gửi tới email của bạn']);
}
public function checkEmail(Request $request)
{
    $request->validate([
        'email' => 'required|email|unique:users,email',
    ]);

    $verificationCode = rand(100000, 999999);

    // Lưu mã xác minh vào bảng `email_verifications`
    EmailVerification::updateOrCreate(
        ['email' => $request->email],
        ['code' => $verificationCode]
    );

    // Gửi email xác minh
    Mail::to($request->email)->send(new VerificationCodeMail($verificationCode));

    return response()->json(['message' => 'Verification code sent!', 'user_id' => $request->user_id]);
}
public function verifyCode(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'code' => 'required|numeric',
    ]);

    $verification = EmailVerification::where('email', $request->email)
                                     ->where('code', $request->code)
                                     ->first();

    if (!$verification) {
        return response()->json(['message' => 'Invalid verification code'], 422);
    }

    // Nếu mã xác minh đúng, tạo người dùng
    $user = User::create([
        'person_id' => $request->person_id,
        'username' => $request->username,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'traveler',
        'avatar' => null,
    ]);
    Traveler::create([
        'user_id' => $user->id,
        'preferences' => null, // Ban đầu chưa có thông tin sở thích
        'search_history' => null, // Ban đầu chưa có lịch sử tìm kiếm
    ]);

    // Xóa mã xác minh sau khi đăng ký thành công
    $verification->delete();

    return response()->json(['message' => 'User registered successfully!', 'user' => $user], 201);
}




    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            $user = Auth::user();
            return response()->json(['message' => 'Login successful', 'user' => $user], 200);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function forgotPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
    ]);

    $token = Str::random(60);

    // Lưu token vào bảng `password_resets`
    DB::table('password_resets')->updateOrInsert(
        ['email' => $request->email],
        ['token' => $token, 'created_at' => now()]
    );

    // Gửi email với nút xác nhận
    Mail::to($request->email)->send(new ResetPasswordMail($token));

    return response()->json(['message' => 'Password reset email sent.']);
}

public function showResetForm($token)
{
    return view('auth.reset-password', ['token' => $token]);
}

public function resetPassword(Request $request)
{
    $request->validate([
        'token' => 'required',
        'password' => 'required|min:8|confirmed',
    ]);

    $reset = DB::table('password_resets')->where('token', $request->token)->first();

    if (!$reset) {
        return response()->json(['message' => 'Invalid or expired token.'], 400);
    }

    $user = User::where('email', $reset->email)->first();
    $user->password = Hash::make($request->password);
    $user->save();

    DB::table('password_resets')->where('email', $reset->email)->delete();

    return response()->json(['message' => 'Password reset successful!']);
}
}
