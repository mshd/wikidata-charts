import type { AppProps } from "next/app";
import ReactGA from "react-ga";
import { ChakraProvider } from "@chakra-ui/react";

ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_CODE || "placeholder", {
  testMode: !process.env.NEXT_PUBLIC_GA_TRACKING_CODE,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
