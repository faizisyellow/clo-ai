"use client";

import React, { useState } from "react";
import Main from "@/components/main";
import ChatBox from "@/components/chatbox";
import { Button } from "@/components/ui/button";
import { Container } from "@chakra-ui/react";

export default function Chat() {
  const [started, setStarted] = useState<boolean>(false);

  return (
    <>
      <Container>
        {started ? (
          <ChatBox />
        ) : (
          <Main
            render={() => (
              <Button
                rounded={"full"}
                textAlign={"center"}
                size={"lg"}
                onClick={() => setStarted(true)}
                borderWidth={"medium"}
                shadow={"inset"}
              >
                Mulai Sekarang
              </Button>
            )}
          />
        )}
      </Container>
    </>
  );
}
