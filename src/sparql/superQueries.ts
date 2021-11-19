export const superQueries = {
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
  $query

  ?item p:P569/psv:P569 ?birth_date_node .
  ?birth_date_node wikibase:timeValue ?birth_date .
  ?search wdt:$eventDate ?eventDate.
  { ?search wdt:$eventDate ?eventDate } UNION {
    ?search wdt:P361 ?partOf . ?partOf wdt:$eventDate ?eventDate} 
    #Also include elections that are part of elections

  BIND( year(?eventDate) - year(?birth_date) - if(month(?eventDate)<month(?birth_date) || (month(?eventDate)=month(?birth_date) && day(?eventDate) < day(?birth_date)),1,0) as ?age )

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
  ?item wdt:$s ?search.
  ?item wdt:P31/wdt:P279* wd:$i.
  ?item p:$d/psv:$d [
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
