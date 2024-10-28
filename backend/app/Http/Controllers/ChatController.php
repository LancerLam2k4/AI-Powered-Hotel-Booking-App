<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI;

class ChatController extends Controller
{
    public function getChatResponse(Request $request)
    {
        $openai = OpenAI::client(env('OPENAI_API_KEY'));

        $response = $openai->completions()->create([
            'model' => 'text-davinci-003',
            'prompt' => $request->input('prompt'),
            'max_tokens' => 150,
            'temperature' => 0.7,
        ]);

        return response()->json([
            'message' => $response['choices'][0]['text'],
        ]);
    }
}
