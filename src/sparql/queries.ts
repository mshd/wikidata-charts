import { quantityProps } from "./properties/quantity";
import { superQueries } from "./superQueries";

type PROP_TYPE = {
  [key: string]: string;
};

// type PROP_TYPE: PROP_TYPE_TYPE = {
//   s?: string;
//   // p?: string;
//   i?: string;
//   d?: string;
// };
export const INDICATOR_GROUPS = [
  "politics",
  "podcast",
  "media",
  "economy",
  "statistics",
];
export type IndicatorInfo = {
  group: string;
  code?: string;
  name: string;
  query: string;
  props: PROP_TYPE;
  time?: string;
  description?: string;
  fullQuery?: string;
  // indicator_name: string;
  // short_definition: string | null;
  // long_definition: string;
  // statistical_concept_and_methodology: string;
  // development_relevance: string;
  // snippet: string;
  // error?: true;
};
type SparqlValue = {
  value: string;
  label: string;
};
export type SparqlResult = {
  search?: SparqlValue;
  [key: string]: any;
};
const PUBLISHED_DATE = "P577";
const POINT_IN_TIME = "P585";
const PART_OF_SERIES = "P179";
let queries: IndicatorInfo[] = [
  // {
  //   code: "EMPLOYEE",
  //   name: "employees over time",
  //   props: {
  //     d: POINT_IN_TIME,
  //     p: "P1128",
  //   },
  //   time: "time",
  //   query: superQueries.valueByItem,
  // },
  // {
  //   code: "LIFE_EXPECTANCY",
  //   name: "life expectancy over time",
  //   props: {
  //     d: POINT_IN_TIME,
  //     p: "P2250",
  //   },
  //   time: "time",
  //   query: superQueries.valueByItem,
  // },
  {
    code: "AGE_BY_ELECTION",
    name: "Candidate Age by election",
    props: {
      s: "P3602",
    },
    time: "age",
    query: superQueries.ageByEvent,
    group: "politics",
  },
  {
    code: "TV_EPISODES_YEARLY",
    name: "TV episodes published by year",
    props: {
      s: PART_OF_SERIES,
      d: PUBLISHED_DATE,
      i: "Q2431196", //TV episode Q21191270
    },
    time: "year",
    query: superQueries.byYear,
    group: "media",
  },
  {
    code: "PODCAST_YEARLY",
    name: "podcasts episodes published by year",
    props: {
      s: PART_OF_SERIES,
      d: PUBLISHED_DATE,
      i: "Q61855877", //podcast episode
    },
    time: "year",
    query: superQueries.byYear,
    group: "podcast",
  },
  {
    code: "EPISODES_FEMALE_GUEST_PROP",
    name: "podcast episodes female guest proportion",
    props: {
      s: PART_OF_SERIES,
      i: "Q61855877", //podcast episode
      d: PUBLISHED_DATE,
    },
    time: "female",
    query: superQueries.byGender,
    group: "podcast",
  },
  {
    code: "BOOKS_YEARLY",
    name: "books published by year by author",
    props: {
      s: "P50",
      d: PUBLISHED_DATE,
      i: "Q7725634", //literary work
    },
    time: "year",
    query: superQueries.byYear,
    group: "media",
  },
  {
    code: "MOVIES_YEARLY",
    name: "movies played in by year by actor",
    props: {
      s: "P161",
      d: PUBLISHED_DATE,
      i: "Q11424", //film/movie
    },
    query: superQueries.byYear,
    group: "media",
  },
  {
    code: "EARTHQUAKE_YEARLY",
    name: "earthquakes by country",
    props: {
      s: "P17", //country
      i: "Q7944", //earthquake
      d: POINT_IN_TIME,
    },
    time: "year",
    group: "science",
    query: superQueries.byYear,
  },
  {
    code: "MOVIES_YEARLY_COUNTRY",
    name: "movies published by origin country",
    props: {
      s: "P495", //country of origin
      i: "Q11424", //film
      d: PUBLISHED_DATE,
    },
    time: "year",
    query: superQueries.byYear,
    group: "media",
  },
  {
    name: "podcasts episodes published by month",
    props: {
      s: PART_OF_SERIES,
      d: PUBLISHED_DATE,
      i: "Q61855877", //podcast episode
    },
    time: "month",
    query: superQueries.byMonth,
    group: "media",
  },
];

const QUANTITY_PROPS = quantityProps;
for (let i = 0; i < QUANTITY_PROPS.length; i++) {
  const prop = QUANTITY_PROPS[i];
  const propId = prop.item.split("entity/")[1];
  queries.push({
    code: prop.itemLabel,
    name: prop.itemLabel,
    description: prop.itemDescription,
    props: {
      d: POINT_IN_TIME,
      p: propId,
    },
    time: "time",
    group: "statistics",
    query: superQueries.valueByItem,
  });
}

export { queries };
