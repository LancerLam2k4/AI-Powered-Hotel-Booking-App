import json
from transformers import BertForQuestionAnswering, BertTokenizer
import torch

def load_trained_model(model_path="saved_model.pth"):
    """
    Tải mô hình đã huấn luyện (fine-tuned model)
    """
    model = BertForQuestionAnswering.from_pretrained("bert-large-uncased")
    tokenizer = BertTokenizer.from_pretrained("bert-large-uncased")
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    return model, tokenizer

def answer_question(question, context, model, tokenizer):
    """
    Sử dụng mô hình BERT để trả lời câu hỏi
    """
    inputs = tokenizer.encode_plus(question, context, return_tensors='pt')
    answer_start_scores, answer_end_scores = model(**inputs)

    answer_start = torch.argmax(answer_start_scores)
    answer_end = torch.argmax(answer_end_scores) + 1
    answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(inputs['input_ids'][answer_start:answer_end]))
    return answer

def load_rooms_data(file_path='data/rooms.json'):
    """
    Đọc dữ liệu phòng từ file rooms.json
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        rooms = json.load(file)
    return rooms

def load_users_data(file_path='data/users.json'):
    """
    Đọc dữ liệu người dùng từ file users.json
    """
    with open(file_path, 'r', encoding='utf-8') as file:
        users = json.load(file)
    return users

def get_room_context(room_id, rooms):
    """
    Tạo ngữ cảnh mô tả phòng dựa trên room_id từ danh sách phòng
    """
    room = next((room for room in rooms if room['roomId'] == room_id), None)
    if room:
        context = f"Phòng {room['name']} là phòng {room['type']} với giá {room['price']} VND. Mô tả: {room['description']}."
        return context
    return "Phòng không tìm thấy."

def get_user_context(user_id, users):
    """
    Tạo ngữ cảnh mô tả người dùng dựa trên user_id từ danh sách người dùng
    """
    user = next((user for user in users if user['user_id'] == user_id), None)
    if user:
        preferences = user.get('preferences', 'Không có sở thích đặc biệt.')
        context = f"Người dùng {user_id} có sở thích: {preferences}."
        return context
    return "Người dùng không tìm thấy."

def get_recommendation(question, user_id, room_id, rooms, users, model, tokenizer):
    """
    Sử dụng mô hình AI để trả lời câu hỏi từ người dùng về phòng và người dùng
    """
    # Lấy ngữ cảnh của phòng và người dùng
    room_context = get_room_context(room_id, rooms)
    user_context = get_user_context(user_id, users)

    # Kết hợp ngữ cảnh người dùng và phòng
    context = f"{user_context} {room_context}"
    
    # Trả lời câu hỏi với ngữ cảnh từ mô hình
    answer = answer_question(question, context, model, tokenizer)
    return answer
