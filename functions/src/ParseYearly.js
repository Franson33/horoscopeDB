const DomParser = require("dom-parser");

const parser = new DomParser();

exports.parseYearly = async (html) => {
  const dom = parser.parseFromString(html);

  const horoscopeDiv = dom.getElementsByClassName("yearly-horoscope")[0];
  const horoscopeP = horoscopeDiv.getElementsByTagName("p")[0];
  const childs = horoscopeP.childNodes;

  let horoscopeText = "";

  childs.forEach((item) => {
    let currentText = item.text !== undefined ? item.text + " " : "";

    horoscopeText += currentText;
  });

  const resultObj = {
    text: horoscopeText,
  };

  return resultObj;
};
