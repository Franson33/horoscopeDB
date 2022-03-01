const fetch = require("node-fetch");

const { parseMonthly } = require("./ParseMonthly.js");
const {
  zodiacSigns,
  categorysMonthly,
  categorysMonthlyLong,
} = require("./Data.js");

exports.scrapeMonthlyHoroscope = async () => {
  const signes = zodiacSigns;
  const categorys = categorysMonthly;
  const categorysLong = categorysMonthlyLong;
  let monthlyHoroscopes = {};

  for (let l = 0; l < categorys.length; l++) {
    let category = categorys[l];
    let categoryLong = categorysLong[l];

    for (let i = 0; i < signes.length; i++) {
      let signN = i + 1;
      let url = `https://www.horoscope.com/us/horoscopes/${category}/horoscope-${categoryLong}.aspx?sign=${signN}`;

      await fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.text();
          } else {
            throw new Error("Response status is not 200");
          }
        })
        .then((html) => {
          if (html.length) {
            return parseMonthly(html);
          } else {
            throw new Error("HTML is empty");
          }
        })
        .then((result) => {
          monthlyHoroscopes = {
            [result.date]: {
              ...monthlyHoroscopes[result.date],
              [signes[i]]: {
                ...(monthlyHoroscopes[result.date] &&
                monthlyHoroscopes[result.date][signes[i]]
                  ? monthlyHoroscopes[result.date][signes[i]]
                  : {}),
                [categoryLong]: result.text,
              },
            },
          };
        })
        .catch((err) => console.log(err));
    }
  }

  return monthlyHoroscopes;
};
