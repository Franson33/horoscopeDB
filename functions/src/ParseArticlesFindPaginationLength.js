const DomParser = require("dom-parser");

const parser = new DomParser();

const CLASS_TO_FIND = "pagination";

exports.findPaginationLength = async (html) => {
  const dom = parser.parseFromString(html);

  const [paginationParentNode] = dom.getElementsByClassName(CLASS_TO_FIND);
  const paginationChildren = paginationParentNode.innerHTML;
  const arrayOfPageNumbers = paginationChildren.match(/[0-9]/g);

  return arrayOfPageNumbers[arrayOfPageNumbers.length - 1];
};
