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
        $roomId = session('room_id'); // Lấy id từ session
    // dd($roomId);
        if ($roomId) {
            return redirect("http://localhost:3000/bookingRoom/{$roomId}")
                ->with('error', 'You have canceled the transaction.');
        }
    
        // Nếu không có id, quay lại trang mặc định
        return redirect('http://localhost:3000/booking')
            ->with('error', 'You have canceled the transaction.');
    }
    public function paymentSuccess(Request $request)
    {
        $provider = new PayPalClient();
        $provider->setApiCredentials(config('paypal'));
        $provider->getAccessToken();
    
        $response = $provider->capturePaymentOrder($request->query('token'));
    
        if (isset($response['status']) && $response['status'] == 'COMPLETED') {
            $paidAmount = $response['purchase_units'][0]['amount']['value'];
    
            return response()->json([
                'success' => true,
                'message' => 'Transaction complete.',
                'transactionId' => $response['id'], // ID giao dịch
                'amount' => $paidAmount, // Tổng số tiền thanh toán
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => $response['message'] ?? 'Something went wrong.',
            ], 400);
        }
    }
    

}