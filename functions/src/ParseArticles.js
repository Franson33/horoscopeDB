const DomParser = require("dom-parser");
const dayjs = require("dayjs");

const { removeUnicode, removeSlash } = require("./RemoveUnicode.js");

const parser = new DomParser();

exports.parseArticles = async (html) => {
  const dom = parser.parseFromString(html);

  const numberInClassName = "2";
  const horoscopeDiv = dom.getElementsByClassName(
    `grid grid-${numberInClassName}`
  )[0];

  const horoscopeA = horoscopeDiv.getElementsByClassName("module-skin");

  let date = new Date();
  date = dayjs(date).format("YYYY-MM-DDTHH:mm:ss");

  let resultObj = {};

  horoscopeA.forEach((item) => {
    const source = item.attributes[0].value;

    const titleTag = "h3";
    let title = item.getElementsByTagName(`${titleTag}`)[0].innerHTML;
    title = /&#/.test(title) ? removeUnicode(title) : title;
    title = removeSlash(title);

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
