import { Container, Heading } from "@chakra-ui/react";
import Image from "next/image";
import { FC, ReactNode } from "react";

interface MainProps {
  render: () => ReactNode;
}

const Main: FC<MainProps> = ({ render }) => {
  return (
    <Container centerContent gapY={6} py={"2rem"} overflowY={"hidden"}>
      <Image
        alt="logo"
        src={"/clo-icon.png"}
        width={500}
        height={500}
        objectFit="cover"
        priority
      />
      <Heading fontWeight={"semibold"} size={"4xl"} textAlign={"center"} mb={4}>
        Clo AI: Teman Obrolan Pintar Untuk Solusi Cepat
      </Heading>
      {render()}
    </Container>
  );
};

export default Main;
