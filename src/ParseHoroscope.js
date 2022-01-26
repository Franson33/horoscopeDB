const DomParser = require("dom-parser");
const dayjs = require("dayjs");

const parser = new DomParser();

exports.parseHoroscope = async (html) => {
  const dom = parser.parseFromString(html);

  const horoscopeDiv = dom.getElementsByClassName("main-horoscope")[0];
  const horoscopeP = horoscopeDiv.getElementsByTagName("p")[0];
  const childs = horoscopeP.childNodes;
  let horoscopeDate = childs[0].innerHTML;
  horoscopeDate = dayjs(horoscopeDate).format("YYYY-MM-DDTHH:mm:ss");
  const horoscopeText = childs[1].text;

  const matchDiv = dom.getElementsByClassName("inner")[0];
  const matchA = matchDiv.getElementsByTagName("a");
  const matchResult = {};
  matchA.forEach((item) => {
    const key = item.getElementsByTagName("h4")[0].innerHTML;
    const value = item.getElementsByTagName("p")[0].innerHTML;
    matchResult[key] = value;
  });

  const ratingsDiv = dom.getElementsByClassName("ratings")[0];
  const ratingsA = ratingsDiv.getElementsByTagName("a");
  const ratingsResult = {};
  ratingsA.forEach((item) => {
    const key = item.getElementsByTagName("h4")[0].innerHTML;
    const value = item.getElementsByClassName("highlight").length;
    ratingsResult[key] = value;
  })

  const resultObj = {
    date: horoscopeDate,
    text: horoscopeText,
    match: matchResult,
    rating: ratingsResult,
  };

  return resultObj;
};
