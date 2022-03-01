const fetch = require("node-fetch");

const { parseYearly } = require("./ParseYearly.js");
const { zodiacSigns, yearsArray, categorysYearly } = require("./Data.js");

exports.scrapeYearlyHoroscope = async () => {
  const years = yearsArray;
  const signes = zodiacSigns;
  const categorys = categorysYearly;
  let yearlyHoroscopes = {};

  for (let j = 0; j < years.length; j++) {
    let year = years[j];

    for (let l = 0; l < categorys.length; l++) {
      let category = categorys[l];

      for (let i = 0; i < signes.length; i++) {
        let sign = signes[i];
        let url = `https://www.horoscope.com/us/horoscopes/yearly/${year}-horoscope-${sign}.aspx?type=${category}`;

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
              return parseYearly(html);
            } else {
              throw new Error("html is empty");
            }
          })
          .then((result) => {
            yearlyHoroscopes = {
              ...yearlyHoroscopes,
              [year]: {
                ...yearlyHoroscopes[year],
                [sign]: {
                  ...(yearlyHoroscopes[year] && yearlyHoroscopes[year][sign]
                    ? yearlyHoroscopes[year][sign]
                    : {}),
                  [category]: result.text,
                },
              },
            };
          })
          .catch((err) => console.log(err));
      }
    }
  }

  return yearlyHoroscopes;
};
