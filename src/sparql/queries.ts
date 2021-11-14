type PROP_TYPE = {
  [key: string]: string;
};

// type PROP_TYPE: PROP_TYPE_TYPE = {
//   s?: string;
//   // p?: string;
//   i?: string;
//   d?: string;
// };
export type IndicatorInfo = {
  code?: string;
  name: string;
  query: string;
  props: PROP_TYPE;
  time?: string;
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

const superQueries = {
  // OPTIONAL { ?search wdt:P585 ?electionDate. }
  // OPTIONAL { ?search wdt:P361 ?parentElection. ?parentElection wdt:P585 ?electionDate. }
  valueByItem: `SELECT ?search ?searchLabel ?value ?time
WHERE 
{
  VALUES ?search {wd:$1}.
  ?search p:$p ?statement.
  ?statement ps:$p ?value;
             pq:$d ?time.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}`,
  ageByEvent: `SELECT ?search ?searchLabel ?age (COUNT(?item) as ?value)
WHERE
{
  VALUES ?search {wd:$1}
  ?item wdt:$s ?search;
          p:P569/psv:P569 ?birth_date_node .
  ?birth_date_node wikibase:timeValue ?birth_date .
  ?search wdt:P585 ?electionDate.

  BIND( year(?electionDate) - year(?birth_date) - if(month(?electionDate)<month(?birth_date) || (month(?electionDate)=month(?birth_date) && day(?electionDate) < day(?birth_date)),1,0) as ?age )

  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en"
  }
}
GROUP BY ?age ?search ?searchLabel
ORDER BY ?age`,
  byYear: `SELECT ?search ?searchLabel ?year (COUNT(?item) as ?value)
WHERE
{
  VALUES ?search {wd:$1}
  ?item wdt:P31/wdt:P279* wd:$i.
  ?item wdt:$s ?search;
          p:$d/psv:$d [
                wikibase:timePrecision ?precision ;
                wikibase:timeValue ?date ;
              ] .
  BIND(YEAR(?date) as ?year).
  FILTER( ?date >= "2000-01-01T00:00:00"^^xsd:dateTime )
  FILTER( ?precision >= "9"^^xsd:integer ) # precision of at least year
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en"
  }
}
GROUP BY ?year ?search ?searchLabel
ORDER BY ?year`,
  byMonth: `SELECT ?search ?searchLabel ?yearmonth (COUNT(?item) as ?value)
WHERE
{
  VALUES ?search {wd:$1}
  ?item wdt:$s ?search;
          p:$d/psv:$d [
                wikibase:timePrecision ?precision ;
                wikibase:timeValue ?date ;
              ] .
  BIND(CONCAT(STR(YEAR(?date)),"-",STR(MONTH(?date))) as ?yearmonth).
  FILTER( ?date >= "2000-01-01T00:00:00"^^xsd:dateTime )
  FILTER( ?precision >= "10"^^xsd:integer ) # precision of at least month
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en"
  }
}
GROUP BY ?yearmonth ?search ?searchLabel
ORDER BY ?yearmonth`,
  byGender: `SELECT ?search ?searchLabel ?year (COUNT(?item) as ?value) ?genderLabel
WHERE
{
  VALUES ?search {wd:$1}
  ?podcast wdt:P5030 ?item.
  ?item wdt:P21 ?gender.
  ?podcast wdt:P31/wdt:P279* wd:Q61855877.
  ?podcast wdt:P179 ?search;
          p:P577/psv:P577 [
                wikibase:timePrecision ?precision ;
                wikibase:timeValue ?date ;
              ] .
  BIND(YEAR(?date) as ?year).
  FILTER( ?date >= "2000-01-01T00:00:00"^^xsd:dateTime )
  FILTER( ?precision >= "9"^^xsd:integer ) # precision of at least year
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en"
  }
}
GROUP BY ?year ?search ?searchLabel ?genderLabel
ORDER BY ?year`,
};
export const queries: IndicatorInfo[] = [
  {
    code: "EMPLOYEE",
    name: "employees over time",
    props: {
      d: POINT_IN_TIME,
      p: "P1128",
    },
    time: "time",
    query: superQueries.valueByItem,
  },
  {
    code: "LIFE_EXPECTANCY",
    name: "life expectancy over time",
    props: {
      d: POINT_IN_TIME,
      p: "P2250",
    },
    time: "time",
    query: superQueries.valueByItem,
  },
  {
    code: "AGE_BY_ELECTION",
    name: "Candidate Age by election",
    props: {
      s: "P3602",
    },
    time: "age",
    query: superQueries.ageByEvent,
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
  },
];
