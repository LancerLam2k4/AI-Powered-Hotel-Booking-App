import json
import pandas as pd
from transformers import BertTokenizer, BertForQuestionAnswering, Trainer, TrainingArguments
from torch.utils.data import Dataset, DataLoader
import torch

def process_train_room_data():
    with open("data/rooms.json", "r", encoding="utf-8") as f:
        rooms = json.load(f)

    room_context_map = {room["roomId"]: room for room in rooms if "roomId" in room}
    train_room_data = pd.read_csv("data/train_room_data.csv")

    def add_context(row):
        question = row["question"]
        context = ""
        for room_id, room_info in room_context_map.items():
            if str(room_id) in question or room_info["name"] in question:
                context = f"Room: {room_info['name']}, Type: {room_info['type']}, Price: {room_info['price']}, Description: {room_info['description']}, Location: {room_info['district']}, {room_info['province']}."
                break
        return context

    train_room_data["context"] = train_room_data.apply(add_context, axis=1)
    output_file = "data/train_room_data_with_context.csv"
    train_room_data.to_csv(output_file, index=False, encoding="utf-8")
    return train_room_data

def load_and_fix_csv(file_path):
    data = pd.read_csv(file_path, delimiter=',', quotechar='"', skipinitialspace=True)
    data = data.dropna(how='all')
    data['question'] = data['question'].str.strip()
    data['context'] = data['context'].str.strip()
    data['answer'] = data['answer'].fillna("No answer")
    return data

def merge_data():
    train_data = load_and_fix_csv("data/train_data.csv")
    train_room_data = load_and_fix_csv("data/train_room_data_with_context.csv")
    combined_data = pd.concat([train_data, train_room_data], ignore_index=True)
    combined_data.to_csv("data/final_train_data.csv", index=False, encoding="utf-8")
    return combined_data

def train_bert():
    class QADataset(Dataset):
        def __init__(self, data, tokenizer):
            self.data = data
            self.tokenizer = tokenizer

        def __len__(self):
            return len(self.data)

        def __getitem__(self, idx):
            item = self.data.iloc[idx]
            question = item["question"]
            context = item["context"]
            answer = item["answer"]
            encoding = self.tokenizer(
                question, context, max_length=512, truncation=True, padding="max_length", return_tensors="pt"
            )
            answer_start = context.find(answer)
            answer_end = answer_start + len(answer)
            if answer_start == -1 or answer_end == -1:
                answer_start = 0
                answer_end = 0

            return {
                "input_ids": encoding["input_ids"].squeeze(),
                "attention_mask": encoding["attention_mask"].squeeze(),
                "start_positions": torch.tensor(answer_start, dtype=torch.long),
                "end_positions": torch.tensor(answer_end, dtype=torch.long)
            }

    tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")
    model = BertForQuestionAnswering.from_pretrained("bert-base-uncased")

    data = pd.read_csv("data/final_train_data.csv")
    dataset = QADataset(data, tokenizer)

    train_size = int(0.8 * len(dataset))
    eval_size = len(dataset) - train_size
    train_dataset, eval_dataset = torch.utils.data.random_split(dataset, [train_size, eval_size])

    training_args = TrainingArguments(
        output_dir="./results", num_train_epochs=3, per_device_train_batch_size=8, save_steps=10_000, save_total_limit=2, logging_dir="./logs", logging_steps=500, evaluation_strategy="epoch", save_strategy="epoch", load_best_model_at_end=True
    )

    trainer = Trainer(
        model=model, args=training_args, train_dataset=train_dataset, eval_dataset=eval_dataset
    )

    trainer.train()

    model.save_pretrained("qa_model")
    tokenizer.save_pretrained("qa_model")

if __name__ == "__main__":
    train_bert()
