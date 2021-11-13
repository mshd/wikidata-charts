// import { DataSource } from "wikibase/getWikibaseInstance";
import axios from "axios";
import wdk from "wikidata-sdk";

// import serviceSuccessInterceptor from "./serviceSuccessInterceptor";

export type WikidataSearchResult = {
  aliases?: string[]; // ["Queen Elizabeth II"]
  id: string; // Q623
  description?: string; // "chemical element with symbol C and atomic number 6; common element of all known life"
  concepturi: string; // "http://www.wikidata.org/entity/Q623"
  label: string; // carbon
  match: {
    language: string; // en
    text: string; // carbon
    type: string; // label
  };
  pageid: number; // 908
  repository: string; // wikidata
  title: string; // Q623
  url: string; // www.wikidata.org/wiki/Q623
};

type WikidataSearchResponse = {
  search: WikidataSearchResult[];
  "search-continue": number;
  searchinfo: { search: string };
  success: number;
  error?: {
    code: string;
    info: string;
    "*": string;
  };
  servedby: string;
};
function serviceSuccessInterceptor(res) {
  return res.data;
}

export const searchTerm = async (term: string, languageCode: string) => {
  const baseURL = "https://www.wikidata.org";

  const wikibaseService = axios.create({
    baseURL,
  });

  wikibaseService.interceptors.response.use(serviceSuccessInterceptor);
  const { search, error } = await wikibaseService.get<
    any,
    WikidataSearchResponse
  >("/w/api.php", {
    params: {
      origin: "*",
      action: "wbsearchentities",
      format: "json",
      uselang: languageCode,
      language: languageCode,
      search: term,
    },
  });
  if (error) throw error;

  return search;
};

export default async function runSparql(query: string): Promise<any[]> {
  const url = await new Promise<string>((resolve, reject) => {
    try {
      const url = wdk.sparqlQuery(query);
      resolve(url);
    } catch (error) {
      reject(error);
    }
  });

  return axios
    .get(url)
    .then(({ data }) => wdk.simplify.sparqlResults(data))
    .then((results) => {
      return results;
    })
    .catch();
}
