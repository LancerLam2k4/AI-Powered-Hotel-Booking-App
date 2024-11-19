from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertForQuestionAnswering
import torch
import json
import random
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Load model and tokenizer
model = BertForQuestionAnswering.from_pretrained('trained_model')  # Replace with the path to your model
tokenizer = BertTokenizer.from_pretrained('vinai/phobert-base')  # Tokenizer for PhoBERT

device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
model.to(device)

# Load train data
def load_json_file(file_path):
    """
    Load JSON data from a file.
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

train_data = load_json_file("data/train_data.json")
users_data = load_json_file("data/users.json")  # File chứa thông tin người dùng
rooms_data = load_json_file("data/rooms.json")  # File chứa thông tin phòng

def get_current_user_id(file_path):
    """
    Lấy user_id từ file currentID.json.
    """
    try:
        current_data = load_json_file(file_path)
        return current_data.get('user_id')
    except Exception as e:
        print(f"Error reading currentID.json: {e}")
        return None

@app.route('/ask', methods=['POST'])
@app.route('/ask', methods=['POST'])
def ask_question():
    # Lấy dữ liệu từ yêu cầu POST
    data = request.get_json()
    question = data.get('question')

    # Tự động lấy user_id từ file currentID.json nếu không được gửi
    user_id = data.get('user_id') or get_current_user_id('../currentID.json')

    if not question or not user_id:
        return jsonify({"error": "Cần cung cấp câu hỏi và user_id hợp lệ."}), 400

    # Tìm user trong users_data
    user_info = next((user for user in users_data if user['user_id'] == user_id), None)
    if not user_info:
        return jsonify({"error": f"Không tìm thấy user_id {user_id}"}), 404

    # Xử lý câu hỏi yêu cầu truy vấn
    if "phòng" in question.lower() or "tìm phòng" in question.lower():
        response = query_room_info(user_info, question)
        return jsonify(response)  # Trả về JSON chứa thông tin phòng

    # Tìm câu hỏi trong dữ liệu huấn luyện
    for item in train_data:
        # Kiểm tra nếu câu hỏi có trong danh sách các câu hỏi (danh sách 'question')
        if question.lower() in [q.lower() for q in item['question']]:
            # Chọn ngẫu nhiên một câu trả lời từ danh sách 'answer'
            answer = random.choice(item['answer'])
            return jsonify({'answer': answer})

    if not answer:
        return jsonify({"error": "Câu hỏi không có trong dữ liệu huấn luyện"}), 404

    return jsonify({'answer': answer})


def query_room_info(user_info, question):
    """
    Xử lý truy vấn liên quan đến phòng dựa trên thông tin người dùng và câu hỏi.
    """
    preferences = user_info.get('preferences', '')
    access = user_info.get('access', [])
    booking = user_info.get('booking', [])

    # Lọc danh sách phòng mà người dùng có thể truy cập
    available_rooms = [
        room for room in rooms_data
        if room.get('roomId') in access or room.get('status') == "Sẵn sàng"
    ]

    # Tìm thông tin giá trong câu hỏi
    import re

    # Rẻ nhất
    if "rẻ nhất" in question.lower():
        cheapest_room = min(available_rooms, key=lambda r: r.get('price', float('inf')), default=None)
        if cheapest_room:
            return {
                "answer": f"Phòng có giá rẻ nhất là phòng số {cheapest_room['roomId']} với giá {cheapest_room['price']} VND.",
                "rooms": [cheapest_room]
            }
        return {"answer": "Không tìm thấy phòng nào."}

    # Đắt nhất
    if "đắt nhất" in question.lower():
        most_expensive_room = max(available_rooms, key=lambda r: r.get('price', float('-inf')), default=None)
        if most_expensive_room:
            return {
                "answer": f"Phòng có giá đắt nhất là phòng số {most_expensive_room['roomId']} với giá {most_expensive_room['price']} VND.",
                "rooms": [most_expensive_room]
            }
        return {"answer": "Không tìm thấy phòng nào."}

    # Giá khoảng A và B
    price_range_match = re.search(r'giá khoảng (\d+)[^\d]+(\d+)', question.lower())
    if price_range_match:
        min_price = int(price_range_match.group(1))
        max_price = int(price_range_match.group(2))
        rooms_in_range = [
            room for room in available_rooms
            if min_price <= room.get('price', 0) <= max_price
        ]
        if rooms_in_range:
            return {
                "answer": f"Các phòng có giá trong khoảng {min_price} đến {max_price} VND:",
                "rooms": rooms_in_range
            }
        return {"answer": f"Không có phòng nào trong khoảng giá từ {min_price} đến {max_price} VND."}

    # Giá chính xác
    exact_price_match = re.search(r'giá khoảng (\d+)', question.lower())
    if exact_price_match:
        exact_price = int(exact_price_match.group(1))
        # Tính toán giá chênh lệch 10%
        tolerance = exact_price * 0.1  # 10% of exact_price
        min_price = exact_price - tolerance
        max_price = exact_price + tolerance
        rooms_in_range = [
            room for room in available_rooms
            if min_price <= room.get('price', 0) <= max_price
        ]
        if rooms_in_range:
            return {
                "answer": f"Các phòng có giá khoảng {exact_price} VND (+- 10%):",
                "rooms": rooms_in_range
            }
        return {"answer": f"Không có phòng nào trong khoảng giá {exact_price} VND."}

    # Nếu không khớp bất kỳ trường hợp nào
    return {"error": "Câu hỏi không có trong dữ liệu huấn luyện hoặc không có thông tin liên quan."}

if __name__ == '__main__':
    app.run(debug=True)
