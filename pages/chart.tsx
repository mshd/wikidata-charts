import { Box, Heading } from "@chakra-ui/react";

import Head from "next/head";
import MainChart from "../components/MainChart";
import type { NextPage } from "next";

const Chart: NextPage = () => {
  return (
    <Box height="100vh">
    {/* <Head>
      <title>Wikidata Charts</title>
    </Head> */}
    <div>
       <Heading as="h2" marginLeft={"1em"} marginTop={"0.5em"}>
         Wikidata Charts
        </Heading>
      <MainChart />
    </div>
    </Box>
  );
};
export default Chart;
