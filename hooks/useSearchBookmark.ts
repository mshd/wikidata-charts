import { useEffect, useLayoutEffect } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import { WikidataSearchResult } from "../src/service/wikidataSearch";

export default function useSearchBookmark(
  items: WikidataSearchResult[],
  setItems: React.Dispatch<React.SetStateAction<WikidataSearchResult[]>>
) {
  const router = useRouter();

  useLayoutEffect(() => {
    if (router.query.search) {
      setItems([]);
    }
  }, [router.query.search, setItems]);

  useEffect(() => {
    if (items) {
      Router.push(
        {
          query: {
            ...Router.router?.query,
            items: items.map((item) => item.id),
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [items]);
}
