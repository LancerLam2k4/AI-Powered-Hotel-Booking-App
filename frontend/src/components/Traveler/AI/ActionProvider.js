import axios from "axios";

class ActionProvider {
  constructor(createChatbotMessage, setStateFunc) {
    this.createChatbotMessage = createChatbotMessage;
    this.setState = setStateFunc;
  }

  async handleUserMessage(message) {
    const response = await axios.post("http://localhost:5000/api/chat", { input: message });
    const botMessage = this.createChatbotMessage(response.data.response);
    this.setState(prev => ({ ...prev, messages: [...prev.messages, botMessage] }));
  }
}

export default ActionProvider;
