const DomParser = require("dom-parser");
const dayjs = require("dayjs");

const parser = new DomParser();

exports.parseWeekly = async (html) => {
  const dom = parser.parseFromString(html);

  const horoscopeDiv = dom.getElementsByClassName("main-horoscope")[0];
  const horoscopeP = horoscopeDiv.getElementsByTagName("p")[0];
  const childs = horoscopeP.childNodes;

  let horoscopeDate = childs[0].innerHTML;
  horoscopeDate = horoscopeDate.slice(0, 12);
  horoscopeDate = dayjs(horoscopeDate).format("YYYY-MM-DDTHH:mm:ss");

  let horoscopeText = "";

  childs.forEach(item => {
    const currentText = (item.text !== undefined) ? item.text + " " : "";

    horoscopeText += currentText;
  });

  const resultObj = {
    date: horoscopeDate,
    text: horoscopeText,
  };

  return resultObj;
};
