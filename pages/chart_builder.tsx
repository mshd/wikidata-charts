//@ts-nocheck
import { IndicatorInfo, SparqlResult, queries } from "../src/sparql/queries";
import {
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import React, { useEffect, useState } from "react";
import runSparql, {
  WikidataSearchResult,
  searchTerm,
} from "../src/service/wikidataSearch";
import {
  stackAge,
  stackFemaleProportion,
  stackMonth,
  stackTime,
  stackYear,
} from "../src/sparql/stack";

import AsyncSelect from "react-select/async";
import { abbreviateNumber } from "../src/helper/number";
// import ResponsiveContainer from "../components/ResponsiveContainer";
// import { Store } from "./SqliteHttpvfsDemo";
// import VisibilitySensor from "react-visibility-sensor";
import debounce from "debounce-promise";
import { indicatorSearch } from "../src/service/propertySearch";
import { itemSearch } from "../src/service/itemSearch";
import moment from "moment";

const indicatorSearchDebounce = debounce(indicatorSearch, 0);

const COLORS = [
  "#7cb5ec",
  "#434348",
  "#90ed7d",
  "#f7a35c",
  "#8085e9",
  "#f15c80",
  "#e4d354",
  "#2b908f",
  "#f45b5b",
  "#91e8e1",
];

export const MainChart: React.FC = () => {
  const [items, setItems] = useState<WikidataSearchResult[]>([]);
  const [indicator, setIndicator] = useState<IndicatorInfo>();
  const [querySource, setQuerySource] = useState("");

  const [data, setData] = useState(
    null as null | { series: any[]; data: any[] }
  );
  const itemSearchDebounce = debounce(itemSearch, 250);

  async function plot() {
    if (items.length === 0 || !indicator) {
      setData(null);
      return;
    }
    console.log("plot", items, indicator);
    const requestedIds = items.map((c) => c.id);
    let query = indicator.query.replace("$1", requestedIds.join(" wd:"));
    for (let prop_id in indicator.props) {
      console.log("prop_id", prop_id);
      query = query.replaceAll("$" + prop_id, indicator.props?.[prop_id]);
    }
    setQuerySource("https://query.wikidata.org/#" + encodeURI(query));
    console.log("query", query);
    //  queries
    //   .find((ind) => ind.code === indicator.)
    //   ?.query.replace("$1", requestedId);
    const res: SparqlResult[] = await runSparql(query);
    console.log("res", res);
    let data: any[] = [];
    if (indicator.time == "year") {
      data = stackYear(res);
    } else if (indicator.time == "month") {
      data = stackMonth(res);
    } else if (indicator.time == "age") {
      data = stackAge(res);
    } else if (indicator.time == "female") {
      data = stackFemaleProportion(requestedIds, res);
    } else if (indicator.time == "time") {
      data = stackTime(res);
    }
    console.log(data);
    setData({
      series: items,
      data: data,
    });
  }
  useEffect(() => {
    void plot();
  }, [indicator, items]);
  return (
    <div
      className="sqlite-httpvfs-demo"
      style={{
        margin: "40px",
      }}
    >
      Indicator:{" "}
      <AsyncSelect<IndicatorInfo>
        value={indicator}
        cacheOptions
        defaultOptions
        loadOptions={(e) => {
          return indicatorSearchDebounce(e);
        }}
        getOptionLabel={(e) => e.name}
        // formatOptionLabel={IndicatorOption}
        getOptionValue={(e) => e.code}
        onChange={(e) => setIndicator(e)}
        isOptionDisabled={(e) => !!e.error}
      />
      Search:{" "}
      <AsyncSelect<WikidataSearchResult, true>
        value={items}
        // cacheOptions
        defaultOptions
        isMulti
        loadOptions={(e) => {
          console.log("lioad");
          return itemSearchDebounce(e, indicator);
        }}
        getOptionLabel={(e) => e.label + " (" + e.description + ")"}
        // formatOptionLabel={IndicatorOption}
        getOptionValue={(e) => e.id}
        onChange={(e) => setItems(e)}
        // isOptionDisabled={(e) => !!e.error}
      />
      {data && (
        <ResponsiveContainer
          width="100%"
          height={300}
          initialWidth={600}
          initialHeight={300}
        >
          <LineChart data={data.data}>
            {indicator.time == "time" ? (
              <>
                <XAxis
                  type="number"
                  dataKey="year"
                  scale="time"
                  domain={["dataMin", "auto"]}
                  tickFormatter={(d) => `${moment.unix(d).format("YYYY")}`}
                />
                <Tooltip
                  tickFormatter={(d) =>
                    `${moment.unix(d).format("YYYY-MM-DD")}`
                  }
                />
              </>
            ) : (
              <>
                <XAxis dataKey="year" />
                <Tooltip />
              </>
            )}
            <YAxis
              tickFormatter={(d) => `${abbreviateNumber(d)}`}
              domain={["dataMin", "auto"]}
            />

            <Legend />
            {data.series.map((s, i) => (
              <Line
                key={s.id}
                type="monotone"
                dataKey={s.id}
                name={s.label}
                // fill={COLORS[i % COLORS.length]}
                stroke={COLORS[i % COLORS.length]}
                connectNulls
                strokeWidth={3}
              >
                <Label>Test</Label>
              </Line>
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
      <details>
        <summary>Extra information about this indicator</summary>
        <dl className="maxheight">
          <dt>Indicator Code</dt>
          <dd>{indicator?.code}</dd>
          {indicator?.description && (
            <>
              <dt>Long definition</dt>
              <dd>{indicator?.description}</dd>
            </>
          )}
          <dt>Queried items</dt>
          <dd>
            {/* <ul> */}
            {items.map((item) => (
              <span key={item.id}>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.label}
                </a>
                ;
              </span>
            ))}
            {/* </ul> */}
          </dd>
          {querySource && (
            <>
              <dt>Query Link</dt>
              <dd>
                <a href={querySource} target="_blank" rel="noreferrer">
                  Query
                </a>
              </dd>
            </>
          )}
        </dl>
      </details>
    </div>
  );
};

export default MainChart;
