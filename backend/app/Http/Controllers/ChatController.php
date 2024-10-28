<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Google\Cloud\Dialogflow\V2\SessionsClient;
use Google\Cloud\Dialogflow\V2\QueryInput;
use Google\Cloud\Dialogflow\V2\TextInput;
class ChatController extends Controller
{
    public function getChatResponse(Request $request)
    {
        // ID dự án lấy từ .env
        $projectId = env('DIALOGFLOW_PROJECT_ID');
        $message = $request->input('message');
        $sessionId = session()->getId(); // Tạo session ID cho mỗi người dùng

        try {
            // Khởi tạo Dialogflow SessionsClient
            $sessionsClient = new SessionsClient();
            $session = $sessionsClient->sessionName($projectId, $sessionId);

            // Tạo đối tượng TextInput cho tin nhắn của người dùng
            $textInput = new TextInput();
            $textInput->setText($message);
            $textInput->setLanguageCode('en'); // Thay đổi ngôn ngữ nếu cần

            $queryInput = new QueryInput();
            $queryInput->setText($textInput);

            // Gửi yêu cầu đến Dialogflow
            $response = $sessionsClient->detectIntent($session, $queryInput);
            $fulfillmentText = $response->getQueryResult()->getFulfillmentText();

            $sessionsClient->close();

            return response()->json(['message' => $fulfillmentText]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to communicate with Dialogflow: ' . $e->getMessage()], 500);
        }
    }

}
