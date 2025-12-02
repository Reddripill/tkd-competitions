"use client";

import {
   ChakraProvider,
   createSystem,
   defaultConfig,
   defineConfig,
} from "@chakra-ui/react";

const config = defineConfig({
   preflight: false,
});

const system = createSystem(defaultConfig, config);

function AppChakraProvider({ children }: { children: React.ReactNode }) {
   return <ChakraProvider value={system}>{children}</ChakraProvider>;
}

export default AppChakraProvider;
