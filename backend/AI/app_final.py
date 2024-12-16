from flask import Flask, request, jsonify
from transformers import BertTokenizer, BertForQuestionAnswering
import torch
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Tải mô hình và tokenizer đã huấn luyện
model = BertForQuestionAnswering.from_pretrained("qa_model")
tokenizer = BertTokenizer.from_pretrained("qa_model")

# Đọc dữ liệu câu hỏi và ngữ cảnh từ file CSV
df = pd.read_csv('data/final_train_data.csv')

# Hàm tìm ngữ cảnh liên quan đến câu hỏi
def get_context_for_question(question):
    result = df[df['question'].str.contains(question, case=False, na=False)]
    if not result.empty:
        return result.iloc[0]['context']
    return None

def get_answer(question, context):
    # Tạo input cho mô hình từ câu hỏi và ngữ cảnh
    inputs = tokenizer(question, context, return_tensors="pt", truncation=True, padding="max_length", max_length=512)

    # Đưa mô hình vào thiết bị (GPU nếu có, nếu không sẽ dùng CPU)
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)
    inputs = {key: val.to(device) for key, val in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)

    # Tính toán vị trí bắt đầu và kết thúc của câu trả lời
    answer_start = torch.argmax(outputs.start_logits)  # Vị trí bắt đầu
    answer_end = torch.argmax(outputs.end_logits)  # Vị trí kết thúc

    # Giải mã câu trả lời
    answer = tokenizer.decode(inputs["input_ids"][0][answer_start:answer_end+1], skip_special_tokens=True)

    # Nếu không có câu trả lời, trả về thông báo "Không có câu trả lời"
    if not answer.strip():
        return "Không có câu trả lời"

    # Kiểm tra nếu câu trả lời có đủ thông tin và chi tiết
    full_answer = context  # Lấy thông tin đầy đủ từ context

    # Trả về câu trả lời chi tiết hơn từ toàn bộ context, không chỉ phần trích xuất
    return full_answer.strip() if len(full_answer.strip()) > 0 else "Không có câu trả lời"


@app.route("/ask", methods=["POST"])
def ask():
    # Nhận câu hỏi từ client
    data = request.get_json()
    question = data.get("question", "")

    # Nếu không có câu hỏi, trả về lỗi
    if not question:
        return jsonify({"error": "Câu hỏi là bắt buộc"}), 400

    # Tìm ngữ cảnh liên quan đến câu hỏi
    context = get_context_for_question(question)
    if not context:
        return jsonify({"error": "Không tìm thấy ngữ cảnh phù hợp"}), 404

    # Trả về câu trả lời dựa trên câu hỏi và ngữ cảnh
    answer = get_answer(question, context)

    return jsonify({"question": question, "answer": answer})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
