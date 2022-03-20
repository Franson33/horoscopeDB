const fetch = require("node-fetch");

const { categorysArticleHoroscope } = require("./Data.js");
const { parseArticles } = require("./ParseArticles.js");

exports.scrapeArticles = async () => {
  const sites = [
    {
      site: "horoscope",
      categorys: categorysArticleHoroscope,
    },
  ];

  let articles = {};

  for (let i = 0; i < sites.length; i++) {
    const categorys = sites[i].categorys;
    const site = sites[i].site;

    for (let j = 0; j < categorys.length; j++) {
      const category = categorys[j];

      const url = `https://www.${site}.com/articles/${category}`;

      await fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.text();
          } else {
            throw new Error("Response status is not 200");
          }
        })
        .then((html) => {
          if (html.length) {
            return parseArticles(html);
          } else {
            throw new Error("html is empty");
          }
        })
        .then((result) => {
          Object.keys(result).forEach(
            (item) => (result[item]["category"] = category)
          );
          return result;
        })
        .then((result) => {
          articles = {
            ...articles,
            ...result,
          };
        })
        .catch((err) => console.log(err));
    }
  }

  return articles;
};
