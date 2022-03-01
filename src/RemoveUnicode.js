exports.removeUnicode = (strng) => {
  const expr4digits = /&#\d{3,};/g;
  const expr3digits = /&#\d{,3};/g;

  return (strng = expr3digits.test(strng)
    ? strng.replace(expr3digits, "&")
    : strng.replace(expr4digits, "'"));
};
