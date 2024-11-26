import torch
from transformers import BertForQuestionAnswering, BertTokenizer
import json

class TechnicalQA:
    def __init__(self):
        """
        Khởi tạo mô hình BERT cho Question Answering.
        """
        # Tải mô hình và tokenizer của BERT
        self.tokenizer = BertTokenizer.from_pretrained("bert-large-uncased")
        self.model = BertForQuestionAnswering.from_pretrained("bert-large-uncased")
        self.model.eval()  # Đặt mô hình vào chế độ đánh giá (evaluation mode)

        # Tải dữ liệu huấn luyện từ train_data.json
        self.train_data = self.load_train_data("train_data.json")

    def load_train_data(self, file_path):
        """
        Tải dữ liệu huấn luyện từ file JSON
        """
        with open(file_path, 'r') as file:
            return json.load(file)

    def answer_question(self, question, context):
        """
        Trả lời câu hỏi kỹ thuật dựa trên ngữ cảnh.
        """
        # Mã hóa câu hỏi và ngữ cảnh thành input cho mô hình BERT
        inputs = self.tokenizer.encode_plus(question, context, return_tensors='pt')
        
        # Tiến hành dự đoán (forward pass)
        start_scores, end_scores = self.model(**inputs)

        # Xác định vị trí bắt đầu và kết thúc của câu trả lời
        start_index = torch.argmax(start_scores)
        end_index = torch.argmax(end_scores) + 1

        # Tạo câu trả lời từ các token đã được xác định
        answer_tokens = inputs['input_ids'][0][start_index:end_index]
        answer = self.tokenizer.decode(answer_tokens)

        return answer.strip()

# Ví dụ sử dụng
if __name__ == "__main__":
    # Khởi tạo mô hình trả lời câu hỏi kỹ thuật
    qa_model = TechnicalQA()

    # Lấy một câu hỏi và context từ dữ liệu huấn luyện
    sample_data = qa_model.train_data[0]  # Lấy phần tử đầu tiên trong dữ liệu huấn luyện
    question = sample_data['question']
    context = sample_data['context']

    # Trả lời câu hỏi
    answer = qa_model.answer_question(question, context)
    print(f"Trả lời: {answer}")
