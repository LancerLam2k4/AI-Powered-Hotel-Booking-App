<!DOCTYPE html>
<html>
<head>
    <title>Reset Password</title>
    <style>
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #4CAF50;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <p>Click the button below to reset your password:</p>
    <a href="{{ $resetUrl }}" class="button">Reset Password</a>
</body>
</html>
