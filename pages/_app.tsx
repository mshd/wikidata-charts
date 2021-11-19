import "../styles/globals.css";

import type { AppProps } from "next/app";
import ReactGA from "react-ga";

ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_CODE || "placeholder", {
  testMode: !process.env.NEXT_PUBLIC_GA_TRACKING_CODE,
});

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
