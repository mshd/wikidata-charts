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
  "media",
  "science",
  "television",
  "podcast",
  "economy",
  "statistics",
];
export type IndicatorInfo = {
  group: string;
  code: string;
  name: string;
  query: string;
  props: PROP_TYPE;
  time?: string;
  description?: string;
  fullQuery?: string;
  error?: string; //for debugging

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
const TALK_SHOW_GUEST = "P5030";
const PODCAST_EPISODE = "Q61855877";
const POINT_IN_TIME = "P585";
const START_TIME = "P580";

const PART_OF_SERIES = "P179";
const CAST_MEMBER = "P161";
const UNMARRIED_PARTNER = "P451";
export const COLOR_QUERY = `SELECT ?item ?itemLabel ?color ?hex WHERE {
  VALUES ?item {wd:$1}
    { ?item wdt:P465 ?hex. } 
  UNION {
    ?item wdt:P163 ?flag.
    ?flag p:P462 ?color.
    ?color pq:P465 ?hex.
    }
}`;

let newIdea = [
  {
    name: "podcast episodes",
    item: PODCAST_EPISODE,
    analysis: [
      {
        name: "episode",
        props: [PUBLISHED_DATE, TALK_SHOW_GUEST],
      },
    ],
  },
];
let queries: IndicatorInfo[] = [
  {
    code: "AGE_BY_PARLIAMENT",
    name: "Parliament age distribution by term",
    props: {
      query:
        "?item p:P39 ?position. ?position pq:P2937 ?search. #parliamentiary term",
      s: "P3602",
      eventDate: START_TIME,
    },
    time: "age",
    query: superQueries.ageByEvent,
    group: "politics",
  },
  {
    code: "AGE_BY_ELECTION",
    name: "Candidate Age by election",
    props: {
      query: "?item wdt:$s ?search.",
      s: "P3602",
      eventDate: POINT_IN_TIME,
    },
    time: "age",
    query: superQueries.ageByEvent,
    group: "politics",
  },
  {
    code: "EMPLOYEE_INMATE_RATIO",
    name: "Staff inmate ratio by prison by month",
    description:
      "The number of employees per prisoner, only datapoints for coexising data (both employee & prisoner count)",
    props: {
      // query: "?item wdt:$s ?search.",
      // s: "P3602",
      // eventDate: POINT_IN_TIME,
    },
    time: "time",
    group: "statistics",
    query: superQueries.ratio,
  },
  {
    code: "PARTNERS_AGE",
    name: "Partners age",
    props: {
      p: UNMARRIED_PARTNER,
      // query: "?item wdt:$s ?search.",
      // s: "P3602",
      // eventDate: POINT_IN_TIME,
    },
    time: "partner_age",
    query: superQueries.partnersAge,
    group: "media",
  },
  {
    code: "PARTY_BY_ELECTION_CAT",
    name: "Candidate parties by elections",
    props: {
      // query: "?item wdt:$s ?search.",
      // s: "P3602",
      // eventDate: POINT_IN_TIME,
    },
    time: "year",
    query: superQueries.partyByElection,
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
    name: "podcast episodes published by year",
    props: {
      s: PART_OF_SERIES,
      d: PUBLISHED_DATE,
      i: PODCAST_EPISODE,
    },
    time: "year",
    query: superQueries.byYear,
    group: "podcast",
  },
  {
    code: "PODCAST_MONTH",
    name: "podcast episodes published by month",
    props: {
      s: PART_OF_SERIES,
      d: PUBLISHED_DATE,
      i: PODCAST_EPISODE,
    },
    time: "month",
    query: superQueries.byMonth,
    group: "podcast",
  },
  {
    code: "EPISODES_FEMALE_GUEST_PROP",
    name: "podcast episodes female guest proportion",
    props: {
      s: PART_OF_SERIES,
      i: PODCAST_EPISODE,
      d: PUBLISHED_DATE,
      p: "P21",
    },
    time: "female",
    query: superQueries.byCharacteristic,
    group: "podcast",
  },
  {
    code: "EPISODES_OCCU_GUEST_PROP",
    name: "podcast episodes guests occupation",
    props: {
      s: PART_OF_SERIES,
      i: PODCAST_EPISODE,
      d: PUBLISHED_DATE,
      p: "P106",
    },
    time: "bar",
    query: superQueries.byCharacteristic,
    group: "podcast",
  },
  {
    code: "EPISODES_POLITICAL_GUEST_PROP",
    name: "podcast episodes guests political",
    props: {
      s: PART_OF_SERIES,
      i: PODCAST_EPISODE,
      d: PUBLISHED_DATE,
      p: "P1142",
    },
    time: "bar",
    query: superQueries.byCharacteristic,
    group: "podcast",
  },
  {
    code: "EPISODES_GENDER_GUEST_PROP",
    name: "podcast episodes guests gender",
    props: {
      s: PART_OF_SERIES,
      i: PODCAST_EPISODE,
      d: PUBLISHED_DATE,
      p: "P21",
    },
    time: "bar",
    query: superQueries.byCharacteristic,
    group: "podcast",
  },
  {
    code: "EPISODES_CITIZEN_GUEST_PROP",
    name: "podcast episodes guests citizenship",
    props: {
      s: PART_OF_SERIES,
      i: PODCAST_EPISODE,
      d: PUBLISHED_DATE,
      p: "P27",
    },
    time: "bar",
    query: superQueries.byCharacteristic,
    group: "podcast",
  },
  {
    code: "PODCAST_EPISODES_AVERAGE_AGE",
    name: "podcast episodes guests average age",
    props: {
      s: PART_OF_SERIES,
      i: PODCAST_EPISODE,
      d: PUBLISHED_DATE,
      p: TALK_SHOW_GUEST,
    },
    time: "year",
    query: superQueries.avgAge,
    group: "podcast",
  },
  {
    code: "podcast episodes average duration",
    name: "podcast episodes average duration",
    props: {
      s: PART_OF_SERIES,
      i: PODCAST_EPISODE,
      d: PUBLISHED_DATE,
    },
    time: "year",
    query: superQueries.avgDuration,
    group: "podcast",
  },
  {
    code: "TV_EPISODES_AVERAGE_AGE",
    name: "TV episodes guests average age",
    props: {
      s: PART_OF_SERIES,
      i: "Q2431196", //audiovisual work
      d: PUBLISHED_DATE,
      p: CAST_MEMBER,
    },
    time: "year",
    query: superQueries.avgAge,
    group: "television",
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
    code: "scholarly article",
    name: "scholarly article by year by author",
    props: {
      s: "P50",
      d: PUBLISHED_DATE,
      i: "Q13442814", //scholarly article
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
    code: "FLOODS_YEARLY",
    name: "floods by country",
    props: {
      s: "P17", //country
      i: "Q8068", //flood
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
];

const QUANTITY_PROPS = quantityProps;
for (let i = 0; i < QUANTITY_PROPS.length; i++) {
  const prop = QUANTITY_PROPS[i];
  const propId = prop.item.split("entity/")[1];
  queries.push({
    code: propId,
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
