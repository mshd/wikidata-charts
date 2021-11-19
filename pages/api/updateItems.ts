import type { NextApiRequest, NextApiResponse } from "next";

import { updateSparqlItems } from "../../src/sparql/properties/run";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ name: "Done" });
  updateSparqlItems().then(() => {
    // res.status(200).json({ name: "Done" });
  });
}
