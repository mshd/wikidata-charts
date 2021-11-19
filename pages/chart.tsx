import Head from "next/head";
import Image from "next/image";
import MainChart from "./chart_builder";
import type { NextPage } from "next";
import { getIndicatorByKey } from "../src/service/propertySearch";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";

const Chart: NextPage = () => {
  return (
    <div>
      <MainChart />
    </div>
  );
};
export default Chart;
