const fetch = require("node-fetch");

const { parseWeekly } = require("./ParseWeekly.js");
const {
  zodiacSigns,
  categorysWeekly,
  categorysWeeklyLong,
} = require("./Data.js");

exports.scrapeWeeklyHoroscope = async () => {
  const signes = zodiacSigns;
  const categorys = categorysWeekly;
  const categorysLong = categorysWeeklyLong;
  let weeklyHoroscopes = {};

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
            return parseWeekly(html);
          } else {
            throw new Error("HTML is empty");
          }
        })
        .then((result) => {
          weeklyHoroscopes = {
            [result.date]: {
              ...weeklyHoroscopes[result.date],
              [signes[i]]: {
                ...(weeklyHoroscopes[result.date] &&
                weeklyHoroscopes[result.date][signes[i]]
                  ? weeklyHoroscopes[result.date][signes[i]]
                  : {}),
                [categoryLong]: result.text,
              },
            },
          };
        })
        .catch((err) => console.log(err));
    }
  }

  return weeklyHoroscopes;
};
