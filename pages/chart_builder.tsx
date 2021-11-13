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
import { stackAge, stackMonth, stackYear } from "../src/sparql/stack";

import AsyncSelect from "react-select/async";
// import ResponsiveContainer from "../components/ResponsiveContainer";
// import { Store } from "./SqliteHttpvfsDemo";
// import VisibilitySensor from "react-visibility-sensor";
import debounce from "debounce-promise";

export async function indicatorSearch(
  searchTerm: string
): Promise<IndicatorInfo[] | undefined> {
  if (searchTerm.length < 3) {
    return [{ error: "Type more..." } as unknown as IndicatorInfo];
  }
  try {
    const ret = queries.filter((element) => element.name.includes(searchTerm));
    return ret;
  } catch (e) {
    console.error("authorsSearch", e);
    throw e;
  }
}
const indicatorSearchDebounce = debounce(indicatorSearch, 250);

export async function countrySearch(
  name: string
): Promise<WikidataSearchResult[]> {
  try {
    if (name.length < 3) {
      return [];
    }
    const items = await searchTerm(name, "en");
    // const ret = items as SearchResult[];
    return items;
  } catch (e) {
    console.error("authorsSearch", e);
    throw e;
  }
}
const countrySearchDebounce = debounce(countrySearch, 250);
// function IndicatorOption(indicator: IndicatorInfo) {
//   // if (indicator.error) return indicator.error;
//   const snippetReact = [];
//   for (const [i, part] of indicator.snippet.split("§").entries()) {
//     snippetReact.push(
//       i % 2 == 0 ? <span key={i}>{part}</span> : <b key={i}>{part}</b>
//     );
//   }
//   return (
//     <>
//       {indicator.indicator_name}
//       <br />
//       <small>{indicator.topic}</small>
//       <br />
//       <span style={{ color: "gray" }}>{snippetReact}</span>
//     </>
//   );
// }
// const defaultIndicator = {
//   indicator_code: "IT.NET.USER.ZS",
//   topic: "Infrastructure: Communications",
//   indicator_name: "Individuals using the Internet (% of population)",
//   short_definition: null,
//   long_definition:
//     "Internet users are individuals who have used the Internet (from any location) in the last 3 months. The Internet can be used via a computer, mobile phone, personal digital assistant, games machine, digital TV etc.",
//   statistical_concept_and_methodology:
//     "The Internet is a world-wide public computer network. It provides access to a number of communication services including the World Wide Web and carries email, news, entertainment and data files, irrespective of the device used (not assumed to be only via a computer - it may also be by mobile phone, PDA, games machine, digital TV etc.). Access can be via a fixed or mobile network. For additional/latest information on sources and country notes, please also refer to: https://www.itu.int/en/ITU-D/Statistics/Pages/stat/default.aspx",
//   development_relevance:
//     "The digital and information revolution has changed the way the world learns, communicates, does business, and treats illnesses. New information and communications technologies (ICT) offer vast opportunities for progress in all walks of life in all items - opportunities for economic growth, improved health, better service delivery, learning through distance education, and social and cultural advances.\n\nToday's smartphones and tablets have computer power equivalent to that of yesterday's computers and provide a similar range of functions. Device convergence is thus rendering the conventional definition obsolete.\n\nComparable statistics on access, use, quality, and affordability of ICT are needed to formulate growth-enabling policies for the sector and to monitor and evaluate the sector's impact on development. Although basic access data are available for many items, in most developing items little is known about who uses ICT; what they are used for (school, work, business, research, government); and how they affect people and businesses. The global Partnership on Measuring ICT for Development is helping to set standards, harmonize information and communications technology statistics, and build statistical capacity in developing items. However, despite significant improvements in the developing world, the gap between the ICT haves and have-nots remains.",
//   snippet: "",
// };

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
      Search:{" "}
      <AsyncSelect<WikidataSearchResult, true>
        value={items}
        cacheOptions
        defaultOptions
        isMulti
        loadOptions={(e) => {
          return countrySearchDebounce(e);
        }}
        getOptionLabel={(e) => e.label + " (" + e.description + ")"}
        // formatOptionLabel={IndicatorOption}
        getOptionValue={(e) => e.id}
        onChange={(e) => setItems(e)}
        // isOptionDisabled={(e) => !!e.error}
      />
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
      {data && (
        <ResponsiveContainer
          width="100%"
          height={300}
          initialWidth={600}
          initialHeight={300}
        >
          <LineChart data={data.data}>
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
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
          <dt>Long definition</dt>
          <dd>{indicator?.name}</dd>
          {/* <dt>Statistical concept and methodology</dt>
          <dd>{indicator?.statistical_concept_and_methodology}</dd>
          <dt>Development relevance</dt>
          <dd>{indicator?.development_relevance}</dd> */}
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
