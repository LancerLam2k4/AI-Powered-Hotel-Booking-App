<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
class FeedbackController extends Controller
{


    public function ProcessFeedback(Request $request)
{
    try {
        // Validate the incoming feedback data
        $validatedFeedbackData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'title' => 'required|string',
            'feedback' => 'required|string',
            'reviewsCore' => 'integer|min:0|max:5',
            'roomId' => 'nullable|integer', // Optional roomId
        ]);

        // Fetch user_id from currentID.json
        $currentJsonPath =  __DIR__ . '/../../../currentID.json'; // Ensure this is the correct path
        if (!file_exists($currentJsonPath)) {
            throw new \Exception('currentID.json file not found.');
        }

        $currentData = json_decode(file_get_contents($currentJsonPath), true);
        if (!isset($currentData['user_id'])) {
            throw new \Exception('User ID is missing in currentID.json.');
        }

        $userId = $currentData['user_id']; // Get user_id from JSON file

        // Extract roomId from validated data or default to null
        $roomId = $validatedFeedbackData['roomId'] ?? null;

        // Combine user ID and roomId with feedback data
        $feedbackData = array_merge($validatedFeedbackData, ['user_id' => $userId, 'roomId' => $roomId]);

        // Save the feedback data to a JSON file
        $this->saveFeedbackToJsonFile($feedbackData);

        return response()->json(['success' => true, 'message' => 'Feedback saved successfully!'], 200);
    } catch (\Throwable $e) {
        Log::error('Error processing feedback: ' . $e->getMessage());
        return response()->json(['success' => false, 'message' => 'Internal Server Error'], 500);
    }
}

protected function saveFeedbackToJsonFile(array $feedbackData)
{
    try {
        // Path to the JSON file
        $jsonFilePath = storage_path('app/public/feedbacks.json');

        // Initialize an empty array for feedback data
        $data = [];

        // Check if the file exists and read its contents
        if (file_exists($jsonFilePath)) {
            $data = json_decode(file_get_contents($jsonFilePath), true);
        }

        // Append the new feedback to the existing data
        $data[] = $feedbackData;

        // Write the updated data back to the JSON file
        file_put_contents($jsonFilePath, json_encode($data, JSON_PRETTY_PRINT));
    } catch (\Throwable $e) {
        Log::error('Error saving feedback to JSON: ' . $e->getMessage());
        throw new \Exception('Unable to save feedback to JSON file.');
    }
}
public function getFeedbacks()
    {
        // Định vị đường dẫn tới file JSON
        $jsonFilePath = storage_path('app/public/feedbacks.json');
        
        // Kiểm tra xem file có tồn tại không
        if (file_exists($jsonFilePath)) {
            // Đọc nội dung của file JSON
            $jsonData = file_get_contents($jsonFilePath);
            
            // Giải mã dữ liệu JSON thành mảng hoặc đối tượng
            $feedbacks = json_decode($jsonData, true);
            
            // Trả về dữ liệu dưới dạng JSON
            return response()->json($feedbacks, 200);
        } else {
            // Trả về lỗi nếu file không tồn tại
            return response()->json(['error' => 'Feedback file not found'], 404);
        }
    }

}
