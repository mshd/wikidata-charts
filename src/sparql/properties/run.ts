import fs from "fs";
import path from "path";
import { quantityProps } from "./quantity";
import runSparql from "../../service/wikidataSearch";

type SparqlRes = {
  item: string;
  itemLabel: string;
};

export async function updateSparqlItems() {
  const parentFolder = "src/sparql/properties/";
  // const qu_file = fs.readFileSync(
  //   path.resolve(process.cwd(), parentFolder + "quantity.json"),
  //   "utf8"
  // );
  const templateSparql = fs.readFileSync(
    path.resolve(process.cwd(), parentFolder + "getIds.rq"),
    "utf8"
  );

  const props: SparqlRes[] = quantityProps; // JSON.parse(qu_file);
  for (let i = 0; i < props.length; i++) {
    const item = props[i].item;
    const prop = item.split("entity/")[1];
    const writeFile = path.resolve(
      process.cwd(),
      parentFolder + "res/" + prop + ".json"
    );
    console.log(writeFile, prop);
    try {
      const query = templateSparql.replaceAll("$p", prop);
      if (!fs.existsSync(writeFile)) {
        const res = await runSparql(query);
        fs.writeFileSync(writeFile, JSON.stringify(res));
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (e) {
      console.log("failed", e);
    }
  }
}
