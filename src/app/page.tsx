"use client";

import React, { useState } from "react";
import Main from "@/components/main";
import ChatBox from "@/components/chatbox";
import { Button } from "@/components/ui/button";
import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Container } from "@chakra-ui/react";

export default function Chat() {
  const [started, setStarted] = useState<boolean>(false);

  return (
    <>
      <Container>
        <Box display={"flex"} justifyContent={"right"} py={"1rem"}>
          <ColorModeButton />
        </Box>
        {started ? (
          <ChatBox />
        ) : (
          <Main
            render={() => (
              <Button onClick={() => setStarted(true)}>Mulai Sekarang!</Button>
            )}
          />
        )}
      </Container>
    </>
  );
}
