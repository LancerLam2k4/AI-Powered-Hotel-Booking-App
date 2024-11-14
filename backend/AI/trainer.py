import torch
from transformers import PhobertTokenizer, BertForQuestionAnswering
from torch.utils.data import Dataset, DataLoader
import json
from tqdm import tqdm

# Set up device for training on CPU or GPU if available
device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')

class QuestionAnsweringDataset(Dataset):
    def __init__(self, data, tokenizer):
        self.data = data
        self.tokenizer = tokenizer

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        item = self.data[idx]
        question = item['question']
        answer = item['answer']

        # Ensure both the question and answer are tokenized properly and the sequence length doesn't exceed the model's max length (512 tokens)
        encoding = self.tokenizer(
            question,
            answer,
            truncation=True,  # Truncate if the text is too long
            padding='max_length',  # Pad the text to the max length (512 tokens)
            max_length=512,  # Maximum sequence length (tokens)
            return_tensors='pt',
            return_token_type_ids=True
        )

        # Get answer's start and end positions in the tokenized text
        answer_tokens = self.tokenizer.encode(answer, add_special_tokens=False)
        input_ids = encoding['input_ids'].flatten().tolist()

        try:
            start_position = input_ids.index(answer_tokens[0])
            end_position = start_position + len(answer_tokens) - 1
        except ValueError:
            start_position = 0
            end_position = 0

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'start_positions': torch.tensor(start_position),
            'end_positions': torch.tensor(end_position)
        }

def train_model():
    # Load pre-trained model and tokenizer
    tokenizer = PhobertTokenizer.from_pretrained('vinai/phobert-base')
    model = BertForQuestionAnswering.from_pretrained('vinai/phobert-base')

    # Move model to the correct device (GPU or CPU)
    model.to(device)
     
    # Load training data from JSON file
    with open('data/train_data.json', 'r', encoding='utf-8') as f:
        train_data = json.load(f)

    # Prepare dataset and dataloader
    dataset = QuestionAnsweringDataset(train_data, tokenizer)
    train_dataloader = DataLoader(dataset, batch_size=2, shuffle=True)

    # Set the model to training mode
    model.train()

    # Optimizer
    optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5)

    # Training loop
    for epoch in range(3):  # You can adjust the number of epochs
        loop = tqdm(train_dataloader, desc=f"Epoch {epoch + 1}")
        for batch in loop:
            # Move batch to the correct device (GPU or CPU)
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            start_positions = batch['start_positions'].to(device)
            end_positions = batch['end_positions'].to(device)

            # Zero gradients
            optimizer.zero_grad()

            # Forward pass
            try:
                outputs = model(
                    input_ids=input_ids,
                    attention_mask=attention_mask,
                    start_positions=start_positions,
                    end_positions=end_positions
                )
            except Exception as e:
                print(f"Error during forward pass: {e}")
                continue

            # Backward pass and optimization
            loss = outputs.loss
            loss.backward()
            optimizer.step()

            # Update progress bar with the current loss
            loop.set_postfix(loss=loss.item())

    # Save the trained model
    model.save_pretrained("trained_model")

if __name__ == "__main__":
    train_model()
