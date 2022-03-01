const DomParser = require("dom-parser");
const dayjs = require("dayjs");

const parser = new DomParser();

exports.parseMonthly = async (html) => {
  const dom = parser.parseFromString(html);

  const horoscopeDiv = dom.getElementsByClassName("main-horoscope")[0];
  const horoscopeP = horoscopeDiv.getElementsByTagName("p")[0];
  const childs = horoscopeP.childNodes;

  let horoscopeDate = childs[0].innerHTML;
  horoscopeDate = dayjs(horoscopeDate).format("YYYY-MMTHH:mm:ss");

  let horoscopeText = "";

  childs.forEach((item) => {
    let currentText = item.text !== undefined ? item.text + " " : "";

    horoscopeText += currentText;
  });

  const resultObj = {
    date: horoscopeDate,
    text: horoscopeText,
  };

  return resultObj;
};
