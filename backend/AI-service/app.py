from flask import Flask, jsonify, request
import json

app = Flask(__name__)

# Đọc dữ liệu từ file JSON
def load_json(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Không tìm thấy file {file_path}")
        return []

# Đọc dữ liệu từ các file JSON
rooms_file = 'models/rooms.json'
users_file = 'models/users.json'

rooms = load_json(rooms_file)
users = load_json(users_file)

# Quy đổi mức giá từ search_history thành giá trị số
def convert_price(price_str):
    price_map = {
        'Below 1 million VND': 1000000,
        '1-3 million VND': 3000000,
        '3-5 million VND': 5000000,
        'Above 5 million VND': 5000000
    }
    return price_map.get(price_str, 0)

# Xử lý "Đầy đủ tiện nghi" để hiểu rằng nó bao gồm tất cả các tiện nghi có
def process_description(description):
    amenities_list = ['WiFi', 'Air Conditioning', 'Swimming Pool', 'Gym', 'Đầy Đủ Tiện Nghi']
    if 'Đầy Đủ Tiện Nghi' in description:
        # Nếu có "Đầy Đủ Tiện Nghi", phòng đó có tất cả tiện nghi
        return amenities_list
    return [item for item in amenities_list if item in description]

# Hàm gợi ý phòng cho người dùng dựa trên sở thích và lịch sử tìm kiếm
def recommend_rooms(user_id, rooms, users, max_recommendations=2):
    # Tìm thông tin người dùng theo user_id
    user = next((u for u in users if u['user_id'] == user_id), None)
    
    if not user:
        print(f"Không tìm thấy người dùng với ID {user_id}")
        return []

    # Nếu người dùng mới (chưa có preferences hay search_history)
    if 'preferences' not in user or 'search_history' not in user:
        print("Người dùng mới, không gợi ý phòng.")
        return []

    # Lọc các phòng có trạng thái "Sẵn Sàng"
    available_rooms = [room for room in rooms if room['status'] == 'Sẵn sàng']
    
    # Lấy sở thích và lịch sử tìm kiếm của người dùng
    preferences = user.get('preferences', [])
    search_history = user.get('search_history', [])
    access = user.get('access', [])
    booking = user.get('booking', [])

    # Danh sách các phòng được gợi ý
    recommended_rooms = []
    room_ids_added = set()  # Đảm bảo không có phòng nào bị trùng

    # 1. Ưu tiên theo các phòng đã đặt trước (booking)
    if booking:  # Kiểm tra booking nếu có
        for room in available_rooms:
            if room['roomId'] in booking and room['roomId'] not in room_ids_added:
                recommended_rooms.append(room)
                room_ids_added.add(room['roomId'])
                if len(recommended_rooms) >= max_recommendations:
                    return recommended_rooms

    # 2. Ưu tiên theo sở thích (preferences)
    if preferences and len(recommended_rooms) < max_recommendations:  # Kiểm tra preferences nếu có
        for room in available_rooms:
            room_amenities = process_description(room['description'])
            if any(pref in room_amenities for pref in preferences) and room['roomId'] not in room_ids_added:
                recommended_rooms.append(room)
                room_ids_added.add(room['roomId'])
                if len(recommended_rooms) >= max_recommendations:
                    return recommended_rooms

    # 3. Ưu tiên theo các phòng đã truy cập (access)
    if len(recommended_rooms) < max_recommendations and access:  # Kiểm tra access nếu có
        for room in available_rooms:
            if room['roomId'] in access and room['roomId'] not in room_ids_added:
                recommended_rooms.append(room)
                room_ids_added.add(room['roomId'])
                if len(recommended_rooms) >= max_recommendations:
                    return recommended_rooms

    # 4. Ưu tiên theo lịch sử tìm kiếm (search_history)
    if len(recommended_rooms) < max_recommendations and search_history:  # Kiểm tra search_history nếu có
        for room in available_rooms:
            if len(recommended_rooms) >= max_recommendations:
                break
            for filter_item in search_history:
                filter_name = filter_item['filter']
                for choice in filter_item['choices']:
                    if filter_name == 'price':
                        # Quy đổi mức giá từ search_history
                        user_price = convert_price(choice['value'])
                        if room['price'] >= user_price and room['roomId'] not in room_ids_added:
                            recommended_rooms.append(room)
                            room_ids_added.add(room['roomId'])
                            if len(recommended_rooms) >= max_recommendations:
                                break
                    elif filter_name == 'location' and choice['value'] == room.get('province'):
                        # Kiểm tra tỉnh thành trong phòng với location trong search_history
                        if room['roomId'] not in room_ids_added:
                            recommended_rooms.append(room)
                            room_ids_added.add(room['roomId'])
                            if len(recommended_rooms) >= max_recommendations:
                                break
                    elif filter_name == 'type' and choice['value'] == room.get('type'):
                        # Kiểm tra loại phòng trong search_history với loại phòng
                        if room['roomId'] not in room_ids_added:
                            recommended_rooms.append(room)
                            room_ids_added.add(room['roomId'])
                            if len(recommended_rooms) >= max_recommendations:
                                break

    print(f"Số phòng được gợi ý: {len(recommended_rooms)}")  # Debug để xem số lượng phòng gợi ý thực tế
    return recommended_rooms




# API để gợi ý phòng cho người dùng
@app.route('/api/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id', type=int)
    max_recommendations = request.args.get('max_recommendations', default=2, type=int)  # Số lượng phòng tối đa

    if user_id is None:
        return jsonify({"error": "Missing user_id parameter"}), 400
    recommended_rooms = recommend_rooms(user_id, rooms, users, max_recommendations)
    
    if not recommended_rooms:
        return jsonify({"message": "Không tìm thấy phòng phù hợp."}), 404
    
    print(f"Số phòng được trả về: {len(recommended_rooms)}")  # Debug để xem số phòng trả về
    return jsonify(recommended_rooms)


if __name__ == '__main__':
    app.run(debug=True)
