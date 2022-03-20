exports.removeUnicode = (string) => {
  const expr4digits = /&#\d{3,};/g;
  const expr3digits = /&#\d{,3};/g;

  return (string = expr3digits.test(string)
    ? string.replace(expr3digits, "&")
    : string.replace(expr4digits, "'"));
};

exports.removeSlash = (string) => {
  const newString = string.replace(/\//, ".");

  return newString;
};
