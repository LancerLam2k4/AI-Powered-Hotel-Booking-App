from flask import Flask, request, jsonify
from transformers import PhobertTokenizer, BertForQuestionAnswering
from fuzzywuzzy import fuzz
import torch
import json
import unicodedata
import re
from flask_cors import CORS
from collections import Counter
from pyvi import ViTokenizer
from jinja2 import Template
import random


app = Flask(__name__)
CORS(app)
# Load model and tokenizer
model = BertForQuestionAnswering.from_pretrained('trained_model')
tokenizer = PhobertTokenizer.from_pretrained('vinai/phobert-base')
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')
model.to(device)




def load_responses():
    with open('data/responses.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    return data["answers"]

# Load data
def load_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

train_data = load_json_file("data/train_data.json")
users_data = load_json_file("data/users.json")
rooms_data = load_json_file("data/rooms.json")

def get_current_user_id(file_path):
    try:
        current_data = load_json_file(file_path)
        return current_data.get('user_id')
    except Exception as e:
        print(f"Error reading currentID.json: {e}")
        return None

import unicodedata
from pyvi import ViTokenizer

def normalize_text(text):
    normalized_text = ''.join(
        char for char in unicodedata.normalize('NFD', text)
        if unicodedata.category(char) != 'Mn'
    ).lower()
    text_with_accents = ViTokenizer.tokenize(normalized_text)
    return text_with_accents

# Extract available rooms for a user
def get_available_rooms(user_info, rooms_data):
    access = user_info.get('access', [])
    return [room for room in rooms_data if room.get('roomId') in access or room.get('status') == "Sẵn sàng"]

# Keywords for each category
categories = {
    "giá": ["giá", "rẻ", "đắt", "giá khoảng", "giá dưới", "giá trên"],
    "loại": ["loại", "single room", "double room", "suite", "apartment", "phòng đơn", "phòng đôi", "phòng hạng sang", "căn hộ"],
    "vị trí": ["tại", "ở", "vị trí", "địa điểm", "huyện", "tỉnh"],
    "điểm đánh giá": ["điểm", "đánh giá", "reviewscore", "cao nhất", "thấp nhất"],
    "gợi ý":["gợi ý","gợi ý phòng","đề xuất","đề xuất phòng","cần tìm phòng","kiếm phòng","xem phòng"]
}

# Match categories from question
def match_categories(question):
    normalized_question = normalize_text(question)
    matched_fields = []
    for field, keywords in categories.items():
        for keyword in keywords:
            if fuzz.token_set_ratio(normalized_question, normalize_text(keyword)) > 80:
                matched_fields.append(field)
                break
    return matched_fields

# Aggregate results and sort by relevance
def aggregate_and_sort_results(results):
    room_counts = {}
    for room_list in results:
        for room in room_list:
            room_id = room['roomId']
            room_counts[room_id] = room_counts.get(room_id, 0) + 1
    sorted_rooms = sorted(room_counts.keys(), key=lambda x: -room_counts[x])
    return [room for room in rooms_data if room['roomId'] in sorted_rooms]

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    question = data.get('question', '')
    user_id = get_current_user_id('../currentID.json') or data.get('user_id')

    if not question or not user_id:
        return jsonify({"error": "Cần cung cấp câu hỏi và user_id hợp lệ."}), 400

    user_info = next((user for user in users_data if user['user_id'] == user_id), None)
    if not user_info:
        return jsonify({"error": f"Không tìm thấy user_id {user_id}"}), 404
    normalized_question = normalize_text(question)
    
    # Kiểm tra các phòng cụ thể
    for room in rooms_data:
        room_id = str(room.get('roomId'))
        room_name = normalize_text(room.get('name', ''))

        # Kiểm tra ID phòng là số nguyên vẹn
        id_pattern = rf"\b{room_id}\b"
        if re.search(id_pattern, normalized_question):
            matched_fields = ["phòng cụ thể"]
            room_details = get_room_specific_details(question, room)
            return jsonify({"answer": room_details, "specificRoom": [room]})

        # Kiểm tra tên phòng là từ nguyên vẹn
        name_pattern = rf"\b{room_name}\b"
        if re.search(name_pattern, normalized_question):
            matched_fields = ["phòng cụ thể"]
            room_details = get_room_specific_details(question, room)
            return jsonify({"answer": room_details, "specificRoom": [room]})

    matched_fields = match_categories(question)
    if not matched_fields:
        return jsonify({"answer": "Không rõ câu hỏi thuộc lĩnh vực nào. Vui lòng thử lại."}), 404

    # Loại bỏ "gợi ý" nếu matched_fields chứa các giá trị khác
    if "gợi ý" in matched_fields:
        if len(matched_fields) > 1:
            matched_fields.remove("gợi ý")

    # Tạo danh sách chứa kết quả theo từng lĩnh vực
    all_results = []
    location_results = []  # Kết quả từ "vị trí"
    
    for field in matched_fields:
        if field == "giá":
            response = query_price_related(user_info, normalized_question)
        elif field == "loại":
            response = query_type_related(user_info, normalized_question)
        elif field == "vị trí":
            response = query_location_related(user_info, normalized_question)
            location_results.extend(response.get("rooms", []))
        elif field == "điểm đánh giá":
            response = query_review_related(user_info, normalized_question)
        elif field == "gợi ý":
            response = suggest_room_info(user_info)
        else:
            continue

        # Thêm kết quả vào danh sách
        all_results.extend(response.get("rooms", []))

    # Nếu có "vị trí" trong matched_fields, ưu tiên kết quả từ location_results
    if location_results:
        intersection = [
            room for room in all_results
            if room in location_results
        ]
        exclusive_location = [
            room for room in location_results
            if room not in all_results
        ]
        prioritized_results = exclusive_location + intersection  # Ưu tiên kết quả "vị trí" trước
    else:
        prioritized_results = all_results

    # Đếm số lần xuất hiện của từng phòng dựa trên roomId
    room_frequency = Counter(room["roomId"] for room in prioritized_results)

    # Sắp xếp các phòng theo số lần xuất hiện giảm dần
    sorted_rooms = sorted(
        prioritized_results,
        key=lambda room: room_frequency[room["roomId"]],
        reverse=True
    )

    # Loại bỏ phòng trùng lặp dựa trên roomId
    unique_results = {}
    for room in sorted_rooms:
        if room["roomId"] not in unique_results:
            unique_results[room["roomId"]] = room

    # Chuyển kết quả thành danh sách
    aggregated_rooms = list(unique_results.values())

    # Nếu có kết quả, lấy câu trả lời từ file responses.json
    if aggregated_rooms:
        answers = load_responses()
        selected_answer = random.choice(answers)
        return jsonify({
            "answer": selected_answer,
            "rooms": aggregated_rooms
        })
    
    # Trả về thông báo nếu không tìm thấy phòng
    return jsonify({"answer": "Không tìm thấy phòng nào phù hợp."}), 404


# Các hàm xử lý cho từng trường
def query_price_related(user_info, question):
        available_rooms = get_available_rooms(user_info, rooms_data)
        import re
        if "re nhat" in question.lower():
            cheapest_room = min(available_rooms, key=lambda r: r.get('price', float('inf')), default=None)
            if cheapest_room:
                return {
                    "answer": f"Phòng có giá rẻ nhất là phòng số {cheapest_room['roomId']} với giá {cheapest_room['price']} VND.",
                    "rooms": [cheapest_room]
                }
            return {"answer": "Không tìm thấy phòng nào."}

        # Đắt nhất
        if "đat nhat" in question.lower():
            most_expensive_room = max(available_rooms, key=lambda r: r.get('price', float('-inf')), default=None)
            if most_expensive_room:
                return {
                    "answer": f"Phòng có giá đắt nhất là phòng số {most_expensive_room['roomId']} với giá {most_expensive_room['price']} VND.",
                    "rooms": [most_expensive_room]
                }
            return {"answer": "Không tìm thấy phòng nào."}
        
        # Giá khoảng A và B
        price_range_match = re.search(r'gia khoang (\d+)[^\d]+(\d+)', question.lower())
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
        exact_price_match = re.search(r'gia khoang (\d+)', question.lower())
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
        below_price_match = re.search(r'gia duoi (\d+)', question.lower())
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
        above_price_match = re.search(r'gia tren (\d+)', question.lower())
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
    

def query_type_related(user_info, question):
    available_rooms = get_available_rooms(user_info, rooms_data)
    room_type_mapping = {
        "single room": ["single room", "phong đon"],
        "double room": ["double room", "phong đoi"],
        "suite": ["suite", "phong hang sang","phong vip"],
        "apartment": ["apartment", "can ho"]
    }
    if "loai" in question.lower() or any(
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

    return {"error": "Xin lỗi, tôi không rõ vấn đề bạn đang đề cập. Hãy thử lại sau!"}

def query_location_related(user_info, question):
    if any(keyword in question.lower() for keyword in ["tai", "o", "vi tri"]):
        available_rooms = get_available_rooms(user_info, rooms_data)
        location_keywords = ["tai", "o", "vi tri"]
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
    return {"answer": "Xử lý câu hỏi liên quan đến vị trí."}

def query_review_related(user_info, question):
    question = question.lower()
    if any(keyword in question for keyword in ["điểm", "đánh giá", "điểm đánh giá", "reviewscore"]):
        available_rooms = get_available_rooms(user_info, rooms_data)
        if "cao nhất" in question or "đánh giá cao nhất" in question:
            highest_review = max(
                available_rooms,
                key=lambda r: r.get('reviewsCore', float('-inf')),
                default=None
            )
            if highest_review and 'reviewsCore' in highest_review:
                return {
                    "answer": f"Phòng có điểm đánh giá cao nhất là phòng số {highest_review['roomId']} với điểm số {highest_review['reviewsCore']}.",
                    "rooms": [highest_review]
                }
            return {"answer": "Không tìm thấy phòng nào có điểm đánh giá."}

        # Điểm thấp nhất
        if "thấp nhất" in question:
            lowest_review = min(
                available_rooms,
                key=lambda r: r.get('reviewsCore', float('inf')),
                default=None
            )
            if lowest_review and 'reviewsCore' in lowest_review:
                return {
                    "answer": f"Phòng có điểm đánh giá thấp nhất là phòng số {lowest_review['roomId']} với điểm số {lowest_review['reviewsCore']}.",
                    "rooms": [lowest_review]
                }
            return {"answer": "Không tìm thấy phòng nào có điểm đánh giá."}

        # Điểm trong khoảng
        review_range_match = re.search(r'điểm khoảng (\d+)[^\d]+(\d+)', question)
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
        above_score_match = re.search(r'điểm trên (\d+(\.\d+)?)', question)
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
        below_score_match = re.search(r'điểm dưới (\d+(\.\d+)?)', question)
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
    return {"answer": "Câu hỏi không khớp với bất kỳ yêu cầu nào liên quan đến điểm đánh giá."}

def get_room_specific_details(question, room):
    """
    Trả về thông tin chi tiết của phòng dựa trên các trường cụ thể được hỏi,
    dưới dạng đoạn văn sinh động và rõ ràng.
    """
    normalized_question = normalize_text(question)
    print(normalized_question)
    # Kiểm tra các trường cụ thể trong câu hỏi
    details = []
    if any(keyword in normalized_question for keyword in ["gia", "cost", "price"]):
        details.append(f"Phòng {room.get('name')} có mức giá hấp dẫn là {room.get('price')} VNĐ, phù hợp với nhiều đối tượng khách hàng.")
    if any(keyword in normalized_question for keyword in ["loai", "type", "the loai", "phong loai"]):
        details.append(f"Đây là một phòng thuộc loại {room.get('type')}, mang lại sự tiện nghi và thoải mái.")
    if any(keyword in normalized_question for keyword in ["đia điem", "vi tri", "location"]):
        details.append(f"Phòng được đặt tại vị trí {room.get('province')},{room.get('district')}, rất thuận tiện cho việc di chuyển và tham quan.")
    if any(keyword in normalized_question for keyword in ["danh gia", "review", "diem", "sao", "diem danh gia"]):
        details.append(f"Phòng nhận được đánh giá trung bình {room.get('reviewsCore')}/5 sao từ khách hàng.")
    if any(keyword in normalized_question for keyword in ["tien ich", "facilities", "amenities"]):
        description = room.get('description', 'Không có thông tin')
        details.append(f"Các tiện ích nổi bật bao gồm: {description}.")


    # Nếu không có trường cụ thể, trả về toàn bộ thông tin phòng dưới dạng đoạn văn
    if not details:
        description = room.get('description', "Không có thông tin")
        return (
            f"Phòng {room.get('name')}  là một lựa chọn tuyệt vời. "
            f"Đây là loại phòng {room.get('type')}, có giá {room.get('price')} VNĐ, nằm tại {room.get('province')},{room.get('district')}. "
            f"Phòng này được đánh giá {room.get('reviewsCore')}/5 điểm, và đi kèm với các tiện ích như: "
            f"{room.get('description', 'Không có thông tin')}."
        )

    # Kết hợp các chi tiết thành đoạn văn
    return " ".join(details)

def suggest_room_info(user_info):
    """
    Đề xuất phòng dựa trên lịch sử truy cập, phòng đã đặt, và sở thích người dùng.
    """
    preferences = user_info.get('preferences', '').strip().lower()
    access = user_info.get('access', [])  # Danh sách roomId đã truy cập
    booking = user_info.get('booking', [])  # Danh sách roomId đã đặt

    # Lấy danh sách phòng mà user đã truy cập
    accessed_rooms = [room for room in rooms_data if room.get('roomId') in access]

    # Nếu không có lịch sử, gợi ý dựa trên sở thích hoặc phòng phổ biến
    if not accessed_rooms and not booking:
        matching_rooms = [
            room for room in rooms_data
            if preferences in room.get('description', '').strip().lower()
        ]
        if matching_rooms:
            return {
                "answer": "Dựa trên sở thích, chúng tôi gợi ý các phòng sau:",
                "rooms": matching_rooms[:5]
            }
        # Gợi ý phòng phổ biến nhất nếu không có sở thích
        popular_rooms = sorted(rooms_data, key=lambda x: x.get('popularity', 0), reverse=True)[:5]
        return {
            "answer": "Không có sở thích hoặc lịch sử. Dưới đây là các phòng phổ biến nhất:",
            "rooms": popular_rooms
        }

    # Nếu có lịch sử, tìm phòng tương tự
    similar_rooms = []
    for ref_room in accessed_rooms:
        for candidate in rooms_data:
            if candidate['roomId'] == ref_room['roomId']:
                continue  # Không cần gợi ý chính phòng đã truy cập
            similarity_score = 0

            # So sánh sở thích
            if preferences in candidate.get('description', '').lower():
                similarity_score += 2

            # So sánh giá gần với phòng đã truy cập
            if abs(candidate['price'] - ref_room['price']) <= ref_room['price'] * 0.2:
                similarity_score += 1

            # So sánh loại phòng
            if candidate['type'] == ref_room['type']:
                similarity_score += 1

            # So sánh tiện nghi
            shared_amenities = set(candidate.get('description', [])).intersection(set(ref_room.get('description', [])))
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
