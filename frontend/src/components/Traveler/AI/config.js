import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";

const config = {
  botName: "RoomBookingBot",
  initialMessages: [{ type: "text", content: "Xin chào! Tôi có thể giúp gì cho bạn?" }],
  actionProvider: ActionProvider,
  messageParser: MessageParser,
};

export default config;
