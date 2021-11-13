//@ts-nocheck
import { SparqlResult } from "./queries";

export const stackYear = function (
  res: SparqlResult[],
  start = 2010,
  end = 2022
) {
  const data = [];
  for (let i = start; i < end; i++) {
    let values = {};
    let find = res
      .filter((r) => r.year === i)
      .forEach((r) => {
        values[r.search.value] = r.value;
      });
    data.push({ year: i, ...values });
  }
  return data;
};

export const stackMonth = function (res, start = 2010, end = 2022) {
  const data = [];
  for (let year = start; year < end; year++) {
    for (let month = 1; month <= 12; month++) {
      let timePoint = `${year}-${month}`;
      let values = {};
      let find = res
        .filter((r) => r.yearmonth === timePoint)
        .forEach((r) => {
          values[r.search.value] = r.value;
        });
      data.push({ year: timePoint, ...values });
    }
  }
  return data;
};

export const stackAge = function (res, start = 18, end = 90) {
  const data = [];
  for (let i = start; i < end; i++) {
    let values = {};
    let find = res
      .filter((r) => r.age === i)
      .forEach((r) => {
        values[r.search.value] = r.value;
      });
    data.push({ year: i, ...values });
  }
  return data;
};
