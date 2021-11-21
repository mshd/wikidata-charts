//@ts-nocheck
import { WikidataSearchResult, searchTerm } from "./wikidataSearch";

import { IndicatorInfo } from "../sparql/queries";
import wbk from "wikidata-sdk";

export async function itemSearch(
  term: string,
  indicator?: IndicatorInfo
): Promise<WikidataSearchResult[]> {
  // try {
  if (indicator && indicator.time == "time") {
    console.log(indicator);
    const widget = await import(
      "../sparql/properties/res/" + indicator.props.p + ".json"
    ).then((module) => module.default);
    const possibleResults = widget.map((x) => {
      return {
        label: x.item.label,
        id: x.item.value,
        description: x.item.description,
        url: wbk.getSitelinkUrl({ site: "wikidata", title: x.item.value }),
      };
    });
    if (!term || term.length == 0) {
      return possibleResults;
    }
    const ret = possibleResults.filter((element) =>
      element.label.toLowerCase().includes(term.toLowerCase())
    );
    return ret;
  }
  if (term.length < 3) {
    return [];
  }
  console.log(term);

  const items = await searchTerm(term, "en");
  // const ret = items as SearchResult[];
  return items;
  // } catch (e) {
  //   console.error("authorsSearch", e);
  //   throw e;
  // }
}
