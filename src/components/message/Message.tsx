import React, { FC } from "react";
import { Message as MessageType } from "../chatbox/ChatBox";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useColorMode } from "../ui/color-mode";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For GitHub-flavored markdown
import rehypeHighlight from "rehype-highlight"; // For syntax highlighting
import "highlight.js/styles/github.css"; // Highlight.js theme

interface MessageProps {
  message: MessageType;
}

const Message: FC<MessageProps> = ({ message }) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      justify={message.sender === "user" ? "flex-end" : "flex-start"}
      margin={"5px 0"}
      sm={{ overflowX: "hidden" }}
    >
      <Box
        padding={"10px 20px"}
        my={"1rem"}
        rounded={"3xl"}
        maxWidth={message.sender === "model" ? "100%" : "80%"}
        backgroundColor={
          message.sender === "user"
            ? colorMode === "light"
              ? "gray.200"
              : "gray.900"
            : ""
        }
        shadow={"sm"}
      >
        <Box lineHeight={"tall"}>
          {message.sender === "model" ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {message.text}
            </ReactMarkdown>
          ) : (
            <Text
              color={
                colorMode === "light" && message.sender === "user"
                  ? "black"
                  : ""
              }
            >
              {message.text}
            </Text>
          )}
        </Box>
      </Box>
    </Flex>
  );
};

export default Message;
