import { Stack, Title, List, Button, Image, Center, Flex } from "@mantine/core";
import { FC } from "react";
import campCoachImageUrl from "../../../assets/hero-1.png";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks";

export const LandingPage: FC = () => {
  const isNarrow = useMediaQuery(`(max-width: 880px)`) ?? false;
  return (
    <Center h="100%" w="100%">
      <Flex
        justify="center"
        align="center"
        gap="xl"
        direction={{ base: "column", sm: "row" }}
      >
        <Stack
          gap="xl"
          maw={isNarrow ? "100%" : "40%"}
          align={isNarrow ? "center" : "flex-start"}
        >
          <Title order={1} size={40}>
            Stop Dreaming, Start Camping.
          </Title>
          <List spacing="md" size="xl" maw="80%">
            <List.Item>
              <b>Planning Simplified</b> – Our built-in scheduling recommendations makes building your camping plan a breeze.
            </List.Item>
            <List.Item>
              <b>Always Get First Pick</b> – Load booking reminders and camping trips into your favorite calendar software. 
            </List.Item>
          </List>
          <Button
            component={Link}
            color="#ed8851"
            size="xl"
            px={100}
            fullWidth={isNarrow}
            to={"/app"}
          >
            Try Camp Coach!
          </Button>
        </Stack>
        <Image
          radius="md"
          src={campCoachImageUrl}
          h="400"
          w={isNarrow ? "75%" : "50%"}
          fit="contain"
        />
      </Flex>
    </Center>
  );
};
