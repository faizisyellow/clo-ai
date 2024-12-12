import { Container } from "@chakra-ui/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { FC, useEffect, useState } from "react";

type Message = {
  sender: "user" | "model";
  text: string;
};

interface ChatBoxProps {}

const ChatBox: FC<ChatBoxProps> = ({}) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "model", text: "Hello! How can I assist you today?" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingDots, setLoadingDots] = useState<string>("");

  // Effect to cycle the dots animation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setLoadingDots("");
    }
  }, [isLoading]);

  const formatHistoryForPrompt = (history: Message[]): string => {
    return history
      .map((msg) =>
        msg.sender === "user" ? `User: ${msg.text}` : `Model: ${msg.text}`
      )
      .join("\n");
  };

  const sendMessage = async (userInput: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setIsLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_BASE_URL!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Format the history
      const formattedHistory = formatHistoryForPrompt(messages);

      // Add user input to the prompt
      const prompt = `${formattedHistory}\nUser: ${userInput}\nModel:`;

      const chat = model.startChat({ history: [] });
      const result = await chat.sendMessageStream(prompt);

      let modelResponse = "";
      for await (const chunk of result.stream) {
        modelResponse += chunk.text();
      }

      setMessages((prev) => [
        ...prev,
        { sender: "model", text: modelResponse },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "model", text: "Error: Unable to respond. Try again later" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div style={{ padding: "10px", overflowY: "auto" }}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                backgroundColor:
                  message.sender === "user" ? "#DCF8C6" : "#F1F1F1",
                color: "#000",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%",
              }}
            >
              {message.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                backgroundColor: "#F1F1F1",
                color: "#000",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%",
              }}
            >
              {`Thinking${loadingDots}`}
            </div>
          </div>
        )}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type your message"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              sendMessage(e.currentTarget.value.trim());
              e.currentTarget.value = "";
            }
          }}
          style={{ width: "80%", padding: "10px", margin: "10px 0" }}
        />
      </div>
    </>
  );
};

export default ChatBox;
