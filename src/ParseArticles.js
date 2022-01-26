const DomParser = require("dom-parser");
const dayjs = require("dayjs");

const {removeUnicode} = require("./RemoveUnicode.js");

const parser = new DomParser();

exports.parseArticles = async (html) => {
  const dom = parser.parseFromString(html);

  const isHoroscope = (/horoscope.com/ig).test(html);

  const numberInClassName = (isHoroscope) ? "2" : "4";
  const horoscopeDiv = dom.getElementsByClassName(`grid grid-${numberInClassName}`)[0];

  const horoscopeA = (isHoroscope)
                       ? horoscopeDiv.getElementsByClassName("module-skin")
                       : horoscopeDiv.getElementsByTagName("a");

  let date = new Date();
  date = dayjs(date).format("YYYY-MM-DDTHH:mm:ss");

  let resultObj = {};

  horoscopeA.forEach((item) => {
    const source = (isHoroscope)
                     ? item.attributes[0].value
                     : "https://www.astrology.com" + item.attributes[0].value;

    const titleTag = (isHoroscope) ? "h3" : "h4";
    let title = item.getElementsByTagName(`${titleTag}`)[0].innerHTML;
    title = (/&#/).test(title) ? removeUnicode(title) : title;

    const image = item.getElementsByTagName("img")[0].attributes[0].value;

    resultObj = {
      ...resultObj,
      [title]: {
        date: date,
        source: source,
        image: image,
      },
    };
  });

  return resultObj;
};
