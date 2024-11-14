from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertForQuestionAnswering
import torch
import json

app = Flask(__name__)

# Tải mô hình đã huấn luyện
model = BertForQuestionAnswering.from_pretrained('trained_model')  # Đường dẫn tới mô hình đã huấn luyện
tokenizer = BertTokenizer.from_pretrained('vinai/phobert-base')  # Tokenizer sử dụng với mô hình PhoBERT

# Đảm bảo mô hình chạy trên CPU
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
model.to(device)

# Tải dữ liệu huấn luyện từ file train_data.json (chỉ có question và answer)
def load_train_data(file_path="data/train_data.json"):
    """
    Tải dữ liệu huấn luyện từ file JSON.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

train_data = load_train_data("data/train_data.json")

@app.route('/ask', methods=['POST'])
def ask_question():
    # Lấy dữ liệu từ yêu cầu POST
    data = request.get_json()
    question = data.get('question')

    # Kiểm tra câu hỏi
    if not question:
        return jsonify({"error": "Cần cung cấp câu hỏi"}), 400

    # Tìm câu hỏi trong dữ liệu huấn luyện
    answer = None
    for item in train_data:
        if item['question'].lower() == question.lower():
            answer = item['answer']
            break

    if not answer:
        return jsonify({"error": "Câu hỏi không có trong dữ liệu huấn luyện"}), 404

    return jsonify({'answer': answer})

if __name__ == '__main__':
    app.run(debug=True)
