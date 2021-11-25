import {
  Bar,
  BarChart,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  COLOR_QUERY,
  IndicatorInfo,
  SparqlResult,
  queries,
} from "../src/sparql/queries";
import React, { memo, useEffect, useState } from "react";
import {
  getAllC,
  stackAge,
  stackBarProportion,
  stackFemaleProportion,
  stackMonth,
  stackPartnerAge,
  stackTime,
  stackYear,
} from "../src/sparql/stack";
import {
  getIndicatorByKey,
  indicatorSearch,
} from "../src/service/propertySearch";
import runSparql, {
  WikidataSearchResult,
  searchTerm,
} from "../src/service/wikidataSearch";

import AsyncSelect from "react-select/async";
import { abbreviateNumber } from "../src/helper/number";
import debounce from "debounce-promise";
import { itemSearch } from "../src/service/itemSearch";
import moment from "moment";
import useIndicatorBookmark from "../hooks/useIndicatorBookmark";
import useSearchBookmark from "../hooks/useSearchBookmark";

React.useLayoutEffect = React.useEffect;

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
  const [querySource, setQuerySource] = useState("");
  const [items, setItems] = useState<WikidataSearchResult[]>([]);
  const [indicator, setIndicator] = useState<IndicatorInfo>();
  const [data, setData] = useState(
    null as null | { series: any[]; data: any[]; props: any[]; colors: any[] }
  );

  useIndicatorBookmark(indicator, setIndicator);
  useSearchBookmark(items, setItems);

  const itemSearchDebounce = debounce(itemSearch, 250);

  async function plot() {
    if (items.length === 0 || !indicator) {
      setData(null);
      return;
    }
    console.log("plot", items, indicator);
    const requestedIds = items.map((c) => c.id);
    let query = indicator.query;
    for (let prop_id in indicator.props) {
      console.log("prop_id", prop_id);
      query = query.replaceAll("$" + prop_id, indicator.props?.[prop_id]);
    }
    setQuerySource(
      "https://query.wikidata.org/#" +
        encodeURI(query.replace("$1", requestedIds.join(" wd:")))
    );
    console.log("query", query);
    let res: SparqlResult[] = [];
    let color: any = {};
    for (let i = 0; i < requestedIds.length; i++) {
      let id = requestedIds[i];
      let individualRequest = await runSparql(query.replace("$1", id));
      let colorRequest = await runSparql(COLOR_QUERY.replace("$1", id));
      console.log(colorRequest);
      color[id] = colorRequest?.[0]?.hex
        ? "#" + colorRequest[0].hex
        : COLORS[i % COLORS.length];
      console.log(color, individualRequest);
      res = res.concat(individualRequest);
    }
    console.log("res", res);
    if (res.length === 0) {
      setData(null);
      return;
    }
    let data: any[] = [];
    let props = [];
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
    } else if (indicator.time == "bar") {
      data = stackBarProportion(res);
      props = getAllC(res);
    } else if (indicator.time == "bar") {
      data = stackBarProportion(res);
    } else if (indicator.time == "partner_age") {
      console.log(res);
      data = stackPartnerAge(res);
      console.log(data);
      // return;
    }

    console.log(data);
    setData({
      series: items,
      data: data,
      props: props,
      colors: color,
    });
  }

  useEffect(() => {
    plot();
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
        instanceId="indicator"
        value={indicator}
        cacheOptions
        defaultOptions
        loadOptions={(e: string) => {
          return indicatorSearchDebounce(e);
        }}
        getOptionLabel={(indicator) => indicator.name}
        // formatOptionLabel={IndicatorOption}
        getOptionValue={(indicator) => indicator.code}
        onChange={(indicator) => setIndicator(indicator!)}
        isOptionDisabled={(e) => !!e.error}
      />
      Search:{" "}
      <AsyncSelect<WikidataSearchResult, true>
        key={indicator?.code}
        instanceId="searchItem"
        value={items}
        // cacheOptions
        defaultOptions
        isMulti
        loadOptions={(e: any) => {
          return itemSearchDebounce(e, indicator);
        }}
        getOptionLabel={(e) => e.label + " (" + e.description + ")"}
        // formatOptionLabel={IndicatorOption}
        getOptionValue={(e) => e.id}
        onChange={(e: any) => setItems(e)}
        // isOptionDisabled={(e) => !!e.error}
      />
      {data && (
        <ResponsiveContainer
          width="100%"
          height={350}
          // initialWidth={600}
          // initialHeight={300}
        >
          {indicator && indicator.time == "bar" ? (
            <BarChart data={data.data}>
              <XAxis dataKey="year" />
              <Tooltip />
              <YAxis
                tickFormatter={(d) => `${abbreviateNumber(d)}`}
                domain={["dataMin", "auto"]}
              />
              {data.props.map((c, i) => (
                <Bar
                  key={i}
                  dataKey={c}
                  stackId="a"
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
              <Legend />
            </BarChart>
          ) : (
            <LineChart data={data.data}>
              {indicator?.time == "time" ? (
                <>
                  <XAxis
                    type="number"
                    dataKey="year"
                    scale="time"
                    domain={["dataMin", "auto"]}
                    tickFormatter={(d) => `${moment.unix(d).format("YYYY-MM")}`}
                  />
                  <Tooltip
                    labelFormatter={(t) =>
                      `${moment.unix(t).format("YYYY-MM-DD")}`
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
                  stroke={data.colors[s.id]}
                  connectNulls
                  strokeWidth={3}
                >
                  <Label>Test</Label>
                </Line>
              ))}
            </LineChart>
          )}
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