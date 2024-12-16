/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { FC, useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Input,
} from "@chakra-ui/react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Message from "../message";
import { ColorModeButton, useColorMode } from "../ui/color-mode";
import { FaArrowUp } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { RiResetLeftFill } from "react-icons/ri";

export interface Message {
  sender: "user" | "model";
  text: string;
}

interface ChatBoxProps {}

const ChatBox: FC<ChatBoxProps> = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { colorMode } = useColorMode();
  const inputRef = useRef<HTMLInputElement>(null);

  const emptyMessage = messages.length === 0;

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_BASE_URL!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const sendMessage = async (userInput: string) => {
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
    setIsLoading(true);

    try {
      const chat = model.startChat({
        history: messages.map((msg) => ({
          role: msg.sender,
          parts: [{ text: msg.text }],
        })),
      });

      let modelResponse = "";
      const result = await chat.sendMessageStream(userInput);

      for await (const chunk of result.stream) {
        modelResponse += chunk.text();
      }

      setMessages((prev) => [
        ...prev,
        { sender: "model", text: modelResponse },
      ]);
    } catch (error) {
      console.error("Error while sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "model",
          text: "Error: Unable to respond. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (inputRef.current?.value.trim()) {
      sendMessage(inputRef.current.value.trim());
      inputRef.current.value = "";
    }
  };

  const handleResetMessage = () => {
    setMessages([]);
  };

  return (
    <>
      <Box display="flex" justifyContent="right" pb="2rem">
        <ColorModeButton size="xl" position={"fixed"} zIndex={"max"} />
      </Box>

      <Container>
        <Box padding="10px" overflowY="auto">
          {emptyMessage ? (
            <Box textAlign={"center"}>
              <Heading size={"4xl"} fontWeight={"bold"} my={"5rem"}>
                Apa yang saya bisa bantu?
              </Heading>
            </Box>
          ) : (
            messages.map((message, index) => (
              <Message message={message} key={index} />
            ))
          )}

          {isLoading && (
            <Icon
              color={colorMode === "dark" ? "white" : "black"}
              fontSize={"2xl"}
            >
              <GoDotFill />
            </Icon>
          )}
        </Box>
        <Flex position={"relative"} alignItems={"center"} gapX={4}>
          <Button
            position={"absolute"}
            right={emptyMessage ? "6" : "16"}
            top={"6"}
            color={colorMode === "dark" ? "black" : "white"}
            backgroundColor={colorMode === "dark" ? "white" : "black"}
            rounded={"full"}
            fontSize={"3xl"}
            p={"5px"}
            size={"sm"}
            zIndex={"max"}
            onClick={handleSubmit}
          >
            {isLoading ? <GoDotFill /> : <FaArrowUp />}
          </Button>
          <Input
            ref={inputRef}
            overscrollY={"revert"}
            type="text"
            placeholder="Ketik pesan anda"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                sendMessage(e.currentTarget.value.trim());
                e.currentTarget.value = "";
              }
            }}
            width="100%"
            padding="10px"
            py={"2rem"}
            margin="10px 0"
            rounded={"3xl"}
            shadow={"sm"}
          />
          {!emptyMessage && (
            <Button
              color={colorMode === "dark" ? "black" : "white"}
              backgroundColor={colorMode === "dark" ? "white" : "black"}
              rounded={"full"}
              fontSize={"3xl"}
              p={"5px"}
              size={"sm"}
              zIndex={"max"}
              onClick={handleResetMessage}
            >
              <RiResetLeftFill />
            </Button>
          )}
        </Flex>
      </Container>
    </>
  );
};

export default ChatBox;
