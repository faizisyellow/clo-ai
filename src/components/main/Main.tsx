import { Container, Heading } from "@chakra-ui/react";
import Image from "next/image";
import { FC, ReactNode } from "react";

interface MainProps {
  render: () => ReactNode;
}

const Main: FC<MainProps> = ({ render }) => {
  return (
    <Container centerContent gapY={6} overflowY={"hidden"}>
      <Image alt="logo" src={"/logo.png"} width={500} height={500} />
      <Heading fontWeight={"semibold"} size={"4xl"} textAlign={"center"} mb={4}>
        Clo AI: Teman Obrolan Pintar untuk Solusi Cepat
      </Heading>
      {render()}
    </Container>
  );
};

export default Main;
