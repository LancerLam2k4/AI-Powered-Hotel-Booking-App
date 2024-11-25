from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertForQuestionAnswering
from fuzzywuzzy import fuzz
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
        if response.get("error") is None:  # Nếu không có lỗi trong response
            return jsonify(response)  # Trả lời và dừng
    # Xử lý các câu hỏi liên quan đến đề xuất hoặc gợi ý phòng
    if any(keyword in question.lower() for keyword in ["gợi ý phòng", "đề xuất phòng"]):
        response = suggest_room_info(user_info)
        return jsonify(response)

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
    if "giá" in question.lower() or "rẻ" in question.lower() or "đắt" in question.lower():
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
        # Giá dưới A
        below_price_match = re.search(r'giá dưới (\d+)', question.lower())
        if below_price_match:
            max_price = int(below_price_match.group(1))
            rooms_below_price = [
                room for room in available_rooms
                if room.get('price', float('inf')) <= max_price
            ]
            if rooms_below_price:
                return {
                    "answer": f"Các phòng có giá dưới {max_price} VND:",
                    "rooms": rooms_below_price
                }
            return {"answer": f"Không có phòng nào có giá dưới {max_price} VND."}

        # Giá trên A
        above_price_match = re.search(r'giá trên (\d+)', question.lower())
        if above_price_match:
            min_price = int(above_price_match.group(1))
            rooms_above_price = [
                room for room in available_rooms
                if room.get('price', 0) >= min_price
            ]
            if rooms_above_price:
                return {
                    "answer": f"Các phòng có giá trên {min_price} VND:",
                    "rooms": rooms_above_price
                }
            return {"answer": f"Không có phòng nào có giá trên {min_price} VND."}
        return {"error": "Xin lỗi tôi không rõ vấn đề bạn đang đề cập .Hãy thử lại sau!"}
    room_type_mapping = {
        "single room": ["single room", "phòng đơn"],
        "double room": ["double room", "phòng đôi"],
        "suite": ["suite", "phòng hạng sang"],
        "apartment": ["apartment", "căn hộ"]
    }
    if "loại" in question.lower() or any(
        keyword in question.lower() for keywords in room_type_mapping.values() for keyword in keywords):
        requested_types = []
        for standard_type, keywords in room_type_mapping.items():
            if any(keyword in question.lower() for keyword in keywords):
                requested_types.append(standard_type.lower())
        if requested_types:
            # Lọc các phòng phù hợp
            matching_rooms = [
                room for room in available_rooms
                if room.get('type', '').lower() in requested_types
            ]
            if matching_rooms:
                return {
                    "answer": f"Các phòng thuộc loại {', '.join(requested_types)}:",
                    "rooms": matching_rooms
                }
            return {"answer": f"Không có phòng nào thuộc loại {', '.join(requested_types)}."}
        return {"error": "Bạn muốn tìm loại phòng nào? Vui lòng cung cấp thêm thông tin."}

    if any(keyword in question.lower() for keyword in ["tại", "ở", "vị trí"]):
    # Xử lý tìm kiếm thông tin vị trí
        # Xử lý tìm kiếm thông tin vị trí
        location_keywords = ["tại", "ở", "vị trí"]
        user_location = None

        # Lấy thông tin vị trí từ câu hỏi
        for keyword in location_keywords:
            if keyword in question.lower():
                # Lấy nội dung sau từ khóa, bỏ qua chính từ khóa
                location_match = re.search(fr'{keyword}\s+(.+)', question.lower())
                if location_match:
                    user_location = location_match.group(1).strip().lower()
                    break

        if user_location:
            matching_rooms = []
            threshold = 70  # Ngưỡng độ tương đồng

            # Lọc phòng dựa trên vị trí
            for room in available_rooms:
                # So khớp với tỉnh và quận của phòng
                province_similarity = fuzz.ratio(user_location, room['province'].lower())
                district_similarity = fuzz.ratio(user_location, room['district'].lower())

                # Chỉ thêm phòng nếu độ tương đồng đạt ngưỡng
                if province_similarity >= threshold or district_similarity >= threshold:
                    matching_rooms.append(room)

            if matching_rooms:
                return {
                    "answer": f"Các phòng phù hợp với vị trí '{user_location}':",
                    "rooms": matching_rooms
                }
            else:
                return {"answer": f"Không tìm thấy phòng nào phù hợp với vị trí '{user_location}'."}
        else:
            # Không xác định được vị trí từ câu hỏi
            return {"error": "Vui lòng cung cấp thông tin cụ thể về vị trí (ví dụ: tại Hà Nội, ở Quận 1)."}

    if "điểm" in question.lower() or "đánh giá" in question.lower():
    # Điểm cao nhất
        if "cao nhất" in question.lower():
            highest_review = max(
                available_rooms,
                key=lambda r: r.get('reviewsCore', float('-inf')),
                default=None
            )
            if highest_review:
                return {
                    "answer": f"Phòng có điểm đánh giá cao nhất là phòng số {highest_review['roomId']} với điểm số {highest_review['reviewsCore']}.",
                    "rooms": [highest_review]
                }
            return {"answer": "Không tìm thấy phòng nào có điểm đánh giá."}

        # Điểm thấp nhất
        if "thấp nhất" in question.lower():
            lowest_review = min(
                available_rooms,
                key=lambda r: r.get('reviewsCore', float('inf')),
                default=None
            )
            if lowest_review:
                return {
                    "answer": f"Phòng có điểm đánh giá thấp nhất là phòng số {lowest_review['roomId']} với điểm số {lowest_review['reviewsCore']}.",
                    "rooms": [lowest_review]
                }
            return {"answer": "Không tìm thấy phòng nào có điểm đánh giá."}

        # Điểm trong khoảng
        review_range_match = re.search(r'điểm khoảng (\d+)[^\d]+(\d+)', question.lower())
        if review_range_match:
            min_score = float(review_range_match.group(1))
            max_score = float(review_range_match.group(2))
            rooms_in_range = [
                room for room in available_rooms
                if min_score <= room.get('reviewsCore', 0) <= max_score
            ]
            if rooms_in_range:
                return {
                    "answer": f"Các phòng có điểm đánh giá trong khoảng {min_score} đến {max_score}:",
                    "rooms": rooms_in_range
                }
            return {"answer": f"Không có phòng nào có điểm đánh giá trong khoảng từ {min_score} đến {max_score}."}

        # Điểm trên A
        above_score_match = re.search(r'điểm trên (\d+(\.\d+)?)', question.lower())  # Hỗ trợ cả số thập phân
        if above_score_match:
            min_score = float(above_score_match.group(1))
            rooms_above_score = [
                room for room in available_rooms
                if room.get('reviewsCore', 0) > min_score
            ]
            if rooms_above_score:
                return {
                    "answer": f"Các phòng có điểm đánh giá trên {min_score}:",
                    "rooms": rooms_above_score
                }
            return {"answer": f"Không có phòng nào có điểm đánh giá trên {min_score}."}

        # Điểm dưới A
        below_score_match = re.search(r'điểm dưới (\d+(\.\d+)?)', question.lower())
        if below_score_match:
            max_score = float(below_score_match.group(1))
            rooms_below_score = [
                room for room in available_rooms
                if room.get('reviewsCore', float('inf')) <= max_score
            ]
            if rooms_below_score:
                return {
                    "answer": f"Các phòng có điểm đánh giá dưới {max_score}:",
                    "rooms": rooms_below_score
                }
            return {"answer": f"Không có phòng nào có điểm đánh giá dưới {max_score}."}

    return {"error": "Xin lỗi, tôi không rõ vấn đề bạn đang đề cập. Hãy thử lại sau!"}

def suggest_room_info(user_info):
    """
    Đề xuất phòng dựa trên lịch sử truy cập, phòng đã đặt, và sở thích người dùng.
    """
    preferences = user_info.get('preferences', '').lower()
    access = user_info.get('access', [])  # Danh sách roomId đã truy cập
    booking = user_info.get('booking', [])  # Danh sách roomId đã đặt

    # Lấy danh sách phòng mà user đã truy cập
    accessed_rooms = [room for room in rooms_data if room.get('roomId') in access]

    # Nếu user không có lịch sử truy cập hoặc đặt phòng, chỉ gợi ý dựa trên preferences
    if not accessed_rooms and not booking:
        matching_rooms = [
            room for room in rooms_data
            if preferences in room.get('description', '').lower()  # So khớp sở thích với mô tả phòng
        ]
        if matching_rooms:
            return {
                "answer": "Dựa trên sở thích, chúng tôi gợi ý các phòng sau:",
                "rooms": matching_rooms[:5]  # Chỉ lấy 5 phòng đầu tiên
            }
        return {"answer": "Không tìm thấy phòng nào phù hợp với sở thích."}

    # Nếu có lịch sử, tìm phòng tương tự
    similar_rooms = []
    for ref_room in accessed_rooms:
        for candidate in rooms_data:
            if candidate['roomId'] == ref_room['roomId']:
                continue  # Không cần gợi ý chính phòng đã truy cập
            similarity_score = 0

            # So sánh sở thích (nếu có trong description)
            if preferences in candidate.get('description', '').lower():
                similarity_score += 2

            # So sánh giá gần với phòng đã truy cập
            if abs(candidate['price'] - ref_room['price']) <= ref_room['price'] * 0.1:
                similarity_score += 1

            # So sánh loại phòng
            if candidate['type'] == ref_room['type']:
                similarity_score += 1

            # So sánh tiện nghi
            shared_amenities = set(candidate.get('amenities', [])).intersection(set(ref_room.get('amenities', [])))
            similarity_score += len(shared_amenities)

            # Chỉ thêm nếu có điểm tương đồng
            if similarity_score > 0:
                similar_rooms.append({
                    "room": candidate,
                    "score": similarity_score
                })

    # Sắp xếp phòng theo điểm tương đồng (giảm dần)
    similar_rooms = sorted(similar_rooms, key=lambda x: x['score'], reverse=True)

    if not similar_rooms:
        return {"answer": "Không tìm thấy phòng nào tương tự để gợi ý."}

    # Trả về danh sách các phòng gợi ý (chỉ lấy top 5)
    top_suggestions = [item['room'] for item in similar_rooms[:5]]
    return {
        "answer": "Dựa trên lịch sử và sở thích, chúng tôi gợi ý các phòng sau:",
        "rooms": top_suggestions
    }


if __name__ == '__main__':
    app.run(debug=True)
