export type IndicatorInfo = {
  code?: string;
  name: string;
  query: string;
  // indicator_name: string;
  // short_definition: string | null;
  // long_definition: string;
  // statistical_concept_and_methodology: string;
  // development_relevance: string;
  // snippet: string;
  // error?: true;
};

export const queries: IndicatorInfo[] = [
  //   {
  //     code: "PODCAST_YEARLY",
  //     name: "podcasts episodes published by year",
  //     query: `SELECT  ?year (COUNT(?item) as ?value)
  // WHERE
  // {
  //   ?item wdt:P31 wd:Q61855877.
  //   ?item wdt:P179 wd:$1;
  //           p:P577/psv:P577 [
  //                 wikibase:timePrecision ?precision ;
  //                 wikibase:timeValue ?date ;
  //               ] .
  //   BIND(YEAR(?date) as ?year).
  //   FILTER( ?date >= "2000-01-01T00:00:00"^^xsd:dateTime )
  //   FILTER( ?precision >= "9"^^xsd:integer ) # precision of at least month
  // }
  // GROUP BY ?year
  // ORDER BY ?year`,
  //   },
  {
    code: "PODCAST_YEARLY",
    name: "podcasts episodes published by year",
    query: `SELECT ?search ?searchLabel ?year (COUNT(?item) as ?value)
WHERE
{
  VALUES ?search {wd:$1}

  ?item wdt:P31 wd:Q61855877.
  ?item wdt:P179 ?search;
          p:P577/psv:P577 [
                wikibase:timePrecision ?precision ;
                wikibase:timeValue ?date ;
              ] .
  BIND(YEAR(?date) as ?year).
  FILTER( ?date >= "2000-01-01T00:00:00"^^xsd:dateTime )
  FILTER( ?precision >= "9"^^xsd:integer ) # precision of at least month
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "en"
  }
}
GROUP BY ?year ?search ?searchLabel
ORDER BY ?year`,
  },
  {
    name: "monthly_podcasts",
    query: `SELECT  ?yearmonth (COUNT(?item) as ?value)
WHERE
{
  ?item wdt:P31 wd:Q61855877.
  ?item wdt:P179 wd:Q30323986;
          p:P577/psv:P577 [
                wikibase:timePrecision ?precision ;
                wikibase:timeValue ?date ;
              ] .
  BIND(CONCAT(STR(YEAR(?date)),"-",STR(MONTH(?date))) as ?yearmonth).
  FILTER( ?date >= "2000-01-01T00:00:00"^^xsd:dateTime )
  FILTER( ?precision >= "10"^^xsd:integer ) # precision of at least month
}
GROUP BY ?yearmonth`,
  },
];
