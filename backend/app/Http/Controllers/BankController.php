<?php

namespace App\Http\Controllers;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Illuminate\Http\Request;

class BankController extends Controller
{
    public function createPayment(Request $request){
    // dd(123);
    $roomId = $request->input('roomId'); // Lấy roomId từ request
    $totalPrice = $request->input('totalPrice');

    // Validate price
    if (!$totalPrice || $totalPrice <= 0) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid price amount',
        ], 400);
    }

    // Lưu roomId vào session
    session(['room_id' => $roomId]);
    // Xử lý tạo thanh toán (tương tự bạn đã làm)
    $provider = new PayPalClient();
    $provider->setApiCredentials(config('paypal'));
    $provider->getAccessToken();

    $response = $provider->createOrder([
        "intent" => "CAPTURE",
        "purchase_units" => [
            [
                "amount" => [
                    "currency_code" => "USD",
                    "value" => $totalPrice,
                ],
            ],
        ],
        "application_context" => [
            "return_url" => route('api.payment.success'),
            "cancel_url" => route('api.payment.cancel'),
        ],
    ]);

    if (isset($response['id'])) {
        foreach ($response['links'] as $links) {
            if ($links['rel'] == 'approve') {
                return response()->json([
                    'success' => true,
                    'paymentUrl' => $links['href'],
                ]);
            }
        }
    }

    return response()->json([
        'success' => false,
        'message' => 'Unable to create payment.',
    ]);
    }
    public function paymentCancel(Request $request)
    {
        // Get roomId from session
        $roomId = session('room_id');
        
        // Clear the session
        session()->forget('room_id');
        
        // Make sure we have a roomId before redirecting
        if ($roomId) {
            return redirect("http://localhost:3000/bookingRoom/" . $roomId);
        }
        
        // Fallback if somehow roomId is not in session
        return redirect("http://localhost:3000/booking");
    }
    public function paymentSuccess(Request $request)
    {
        $provider = new PayPalClient();
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
        
        $response = $provider->capturePaymentOrder($request->query('token'));

        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            session()->forget('room_id'); // Clear the session after successful payment
            
            // Redirect to the main booking page after successful payment
            return redirect("http://localhost:3000/booking")
                ->with('success', 'Payment successful! Your booking has been confirmed.');
        } else {
            return redirect("http://localhost:3000/booking")
                ->with('error', $response['message'] ?? 'Something went wrong with the payment.');
        }
    }
    

}
