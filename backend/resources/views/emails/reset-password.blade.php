<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
</head>
<body>
<p>Hello, {{ $user->username }}</p>
<p>Click the button below to reset your password:</p>
<a href="{{ $url }}" style="padding: 10px; background: #3490dc; color: white; text-decoration: none;">Reset Password</a>
</body>
</html>
