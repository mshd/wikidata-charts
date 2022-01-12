##

The aim of this tool is to display charts of exististing data. The only data source at the moment is Wikidata.org

![Image missing](/img/marketcap.png)

Please select an indicator/property and then select the Items you want to display.

The query for this example can [checked here](https://query.wikidata.org/#SELECT%20?search%20?searchLabel%20?value%20?time%0AWHERE%20%0A%7B%0A%20%20VALUES%20?search%20%7Bwd:Q478214%20wd:Q20800404%20wd:Q312%7D.%0A%20%20%0A%20%20?search%20p:P2226%20?statement.%0A%20%20?statement%20ps:P2226%20?value;%0A%20%20%20%20%20%20%20%20%20%20%20%20%20pq:P585%20?time.%0A%20%20SERVICE%20wikibase:label%20%7B%20bd:serviceParam%20wikibase:language%20%22%5BAUTO_LANGUAGE%5D,en%22.%20%7D%0A%7D%0A%0A). To change values or see its references please click on the item on Wikidata.org.

This tool was developed using next.js and TypeScript.

## Getting Started

First, install deps and then run the development server:

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Live demo

A live demo can be found here https://wikidata-charts.vercel.app/
and https://wikidata-charts.vercel.app/charts

## Development

This project was developed as part of Digital Toolkits course by Christopher Handy
https://github.com/handyc
