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
use Illuminate\Support\Facades\DB;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;


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

        return response()->json(['message' => 'Verification code sent!']);
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
            'avatar' => null, // Avatar mặc định
        ]);

        // Tạo traveler liên kết với user
        Traveler::create([
            'user_id' => $user->user_id, // Dùng user_id từ model User
            'preferences' => null,
            'search_history' => null,
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
    
            // Đường dẫn tới file currentID.json
            $jsonPath =  __DIR__ . '/../../../currentID.json';
            $existingData = [];
    
            // Đọc dữ liệu hiện có từ currentID.json nếu file tồn tại
            if (file_exists($jsonPath)) {
                $existingData = json_decode(file_get_contents($jsonPath), true) ?? [];
            }
    
            // Cập nhật hoặc thêm mới trường user_id và các giá trị khác
            $data = [
                'user_id' => $user->user_id,
                'phone_number' => $existingData['phone_number'] ?? 'Not set',
                'address' => $existingData['address'] ?? 'Not set',
                'name' => $user->username,
                'hobby' => $user->traveler ? $user->traveler->preferences : ($existingData['hobby'] ?? 'Not set')
            ];
    
            // Ghi dữ liệu vào currentID.json với định dạng đẹp
            file_put_contents($jsonPath, json_encode($data, JSON_PRETTY_PRINT));
    
            return response()->json([
                'message' => 'Login successful',
                'user' => $user
            ], 200);
        }
    
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }
    

    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        $token = Str::random(64);
        $user->reset_token = $token;
        $user->token_expires_at = now()->addMinutes(60);
        $user->save();

        Mail::to($user->email)->send(new ResetPasswordMail($user, $token));

        return response()->json(['message' => 'Password reset email sent.']);
    }




    // Phương thức để hiển thị form thay đổi mật khẩu và đặt lại mật khẩu
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        // Kiểm tra token và thời hạn
        if ($user->reset_token !== $request->token || $user->token_expires_at < now()) {
            return response()->json(['message' => 'Invalid or expired token.'], 422);
        }

        // Cập nhật mật khẩu mới
        $user->password = Hash::make($request->password);
        $user->reset_token = null;
        $user->token_expires_at = null;
        $user->save();

        return response()->json(['message' => 'Password reset successful!'], 200);
    }
}
