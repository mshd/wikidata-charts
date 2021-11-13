type PROP_TYPE = {
  s?: string;
  // p?: string;
  i?: string;
  d?: string;
};
export type IndicatorInfo = {
  code?: string;
  name: string;
  query: string;
  props: PROP_TYPE;
  time?: string;
  // indicator_name: string;
  // short_definition: string | null;
  // long_definition: string;
  // statistical_concept_and_methodology: string;
  // development_relevance: string;
  // snippet: string;
  // error?: true;
};
const PUBLISHED_DATE = "P577";
const POINT_IN_TIME = "P585";
const PART_OF_SERIES = "P179";

const superQueries = {
  // OPTIONAL { ?search wdt:P585 ?electionDate. }
  // OPTIONAL { ?search wdt:P361 ?parentElection. ?parentElection wdt:P585 ?electionDate. }
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
  ?item wdt:P31 wd:$i.
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
};
export const queries: IndicatorInfo[] = [
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
    code: "PODCAST_YEARLY",
    name: "TV episodes published by year",
    props: {
      s: PART_OF_SERIES,
      d: PUBLISHED_DATE,
      i: "Q21191270", //TV episode
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
