"use client"

import { Button, Text } from "@fedibtc/ui"
import Container from "./components/container"

export default function Index() {
  return (
    <Container className="p-2 items-center">
      <Text weight="bold" variant="h1">
        Fedi Mod Boilerplate
      </Text>
      <Text className="text-center">
        A lightweight and easy-to-use template for building Fedi Mods
      </Text>
      <Button
        href="https://fedibtc.github.io/fedi-docs/docs/mods/developers/intro"
        icon="IconExternalLink"
      >
        Documentation
      </Button>
      <Button
        href="https://github.com/fedibtc/ModBoilerplate"
        icon="IconExternalLink"
      >
        Github
      </Button>
    </Container>
  )
}
