const fetch = require("node-fetch");

const {parseHoroscope} = require("./ParseHoroscope.js");
const {zodiacSigns, categorysArray, daysArray} =  require("./Data.js");

exports.scrapeDailyHoroscope = async () => {
  const days = daysArray;
  const signes = zodiacSigns;
  const categorys = categorysArray;
  let dailyHoroscopes = {};
  
  for (let j = 0; j < days.length; j++) {
    let day = days[j];
    
    for (let l = 0; l < categorys.length; l++) {
      let category = categorys[l];
      
      for (let i = 0; i < signes.length; i++) {
        let signN = i + 1;
        let url = `https://www.horoscope.com/us/horoscopes/${category}/horoscope-${category}-${day}.aspx?sign=${signN}`;
     
        await fetch(url)
          .then(response => {
            if (response.status === 200) {
              return response.text()
            } else {
              throw new Error("Response status is not 200")
            };
          })
          .then(html => {
            if (html.length) {
              return parseHoroscope(html)
            } else {
              throw new Error("html is empty")
            };
          })
          .then(result => {
            dailyHoroscopes = {
              ...dailyHoroscopes,
              [result.date]: {
                ...dailyHoroscopes[result.date],
                [signes[i]]: {
                  ...((dailyHoroscopes[result.date] && dailyHoroscopes[result.date][signes[i]]) 
                       ? dailyHoroscopes[result.date][signes[i]]
                       : {}
                  ),
                  [category]: result.text,
                  rating: result.rating,
                  match: result.match,
                }
              }
            }
          })
          .catch(err => console.log(err))
      };
    };  
  };

  return dailyHoroscopes;
};
