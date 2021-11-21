import { basicQuery, byYear } from "./queryHelper";

export const superQueries = {
  // OPTIONAL { ?search wdt:P585 ?electionDate. }
  // OPTIONAL { ?search wdt:P361 ?parentElection. ?parentElection wdt:P585 ?electionDate. }
  valueByItem: basicQuery(
    `
  ?search p:$p ?statement.
  ?statement ps:$p ?value;
             pq:$d ?time.`,
    "?value ?time"
  ),
  ageByEvent: basicQuery(
    `$query

  ?item p:P569/psv:P569 ?birth_date_node .
  ?birth_date_node wikibase:timeValue ?birth_date .
  ?search wdt:$eventDate ?eventDate.
  { ?search wdt:$eventDate ?eventDate } UNION {
    ?search wdt:P361 ?partOf . ?partOf wdt:$eventDate ?eventDate} 
    #Also include elections that are part of elections

  BIND( year(?eventDate) - year(?birth_date) - if(month(?eventDate)<month(?birth_date) || (month(?eventDate)=month(?birth_date) && day(?eventDate) < day(?birth_date)),1,0) as ?age )
  `,
    "?age (COUNT(?item) as ?value)",
    `
GROUP BY ?age ?search ?searchLabel
ORDER BY ?age`
  ),
  byYear: byYear(
    `
  ?item wdt:$s ?search.
  ?item wdt:P31/wdt:P279* wd:$i.
  `,
    "(COUNT(?item) as ?value) "
  ),
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
  byCharacteristic: byYear(
    `
  ?item wdt:P5030 ?guest.
  ?guest wdt:$p ?c.
  ?item wdt:P31/wdt:P279* wd:Q61855877.
  ?item wdt:P179 ?search.
  `,
    " (COUNT(?guest) as ?value) ?cLabel",
    " ?cLabel"
  ),
  avgAge: `SELECT ?search ?searchLabel ?year (COUNT(?item) as ?amount) (avg(?year - ?birthYear) as ?value) 
WHERE
{
  VALUES ?search {wd:$1}
  ?episode wdt:$p ?item.
  ?item wdt:P569 ?birthDate.
    BIND(YEAR(?birthDate) as ?birthYear).
  ?episode wdt:P31/wdt:P279* wd:$i.
  ?episode wdt:P179 ?search;
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
GROUP BY ?year ?search ?searchLabel
ORDER BY ?year`,
  avgDuration: `SELECT ?search ?searchLabel ?year (COUNT(?episode) as ?amount) (round(avg(?duration)/60) as ?value)  
WHERE
{
  VALUES ?search {wd:$1}
  ?episode p:P2047 [ psv:P2047 [ wikibase:quantityAmount ?duration ; wikibase:quantityUnit wd:Q11574 ] ] .

  ?episode wdt:P31/wdt:P279* wd:$i.
  ?episode wdt:P179 ?search;
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
GROUP BY ?year ?search ?searchLabel
ORDER BY ?year`,
};
