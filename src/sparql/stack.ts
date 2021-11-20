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

export const stackAge = function (res, start = 17, end = 90) {
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

export const stackFemaleProportion = function (
  ids,
  res,
  start = 2010,
  end = 2022
) {
  const data = [];
  console.log(res);
  for (let i = start; i < end; i++) {
    let values = {};
    let findYear = res.filter((r) => r.year === i);
    ids.forEach((id) => {
      let female = findYear.filter(
        (r) => id == r.search.value && r.genderLabel == "female"
      );
      let male = findYear.filter(
        (r) => id == r.search.value && r.genderLabel == "male"
      );
      if (male.length && female.length) {
        let female_count = female[0].value;
        let male_count = male[0].value;
        values[id] = female_count / (male_count + female_count);
      }
    });
    data.push({ year: i, ...values });
  }
  return data;
};

export const stackTime = function (res: SparqlResult[]) {
  const data = [];
  const allTimePoints = res.map((r) => r.time);
  const uniq = [...new Set(allTimePoints)];
  for (let i = 0; i < uniq.length; i++) {
    let values = {};
    let find = res
      .filter((r) => r.time === uniq[i])
      .forEach((r) => {
        values[r.search.value] = r.value;
      });
    data.push({ year: Date.parse(uniq[i]) / 1000, ...values });
  }
  return data.sort((n1, n2) => n1.year - n2.year);
};

export const stackBarProportion = function (
  // ids,
  res,
  start = 2010,
  end = 2022
) {
  const data = [];
  console.log(res[0]);
  for (let i = start; i < end; i++) {
    let values = {};
    let findYear = res.filter((r) => r.year === i);
    if (findYear.length) {
      var total = findYear.reduce((acc, curr) => {
        return (acc = acc + curr.value);
      }, 0);
      values.other = 0;
      findYear.forEach((r) => {
        let proportion = r.value / total;
        if (proportion < 0.02) {
          values.other += proportion;
        } else {
          values[r.cLabel] = proportion;
        }
      });
      data.push({ year: i, ...values });
    }
  }
  return data;
};

export const getAllC = function (res) {
  const data = res.map((r) => r.cLabel);
  return ["other", ...new Set(data)];
};
