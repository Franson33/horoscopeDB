const fetch = require("node-fetch");

const { categorysArticleHoroscope } = require("./Data.js");
const { parseArticles } = require("./ParseArticles.js");
const {
  findPaginationLength,
} = require("./ParseArticlesFindPaginationLength.js");

const ERRORS = {
  EMPTY: "html is empty",
  STATUS: "response status is not 200",
};

const categoryNameFormat = (category) => {
  const firstLetterToUpper = (match) => match.toUpperCase();
  return category.replace(/(^[a-z])/, firstLetterToUpper);
};

exports.scrapeArticles = async () => {
  let articles = {};
  const categorys = categorysArticleHoroscope;
  const baseUrl = "https://www.horoscope.com";

  for (let j = 0; j < categorys.length; j++) {
    const category = categorys[j];
    const categoryUpper = categoryNameFormat(category);

    const url = `${baseUrl}/articles/${category}`;
    const urlWithPagination = `${baseUrl}/us/editorial/editorial-article-list-tag.aspx?ArticleTag_alphastring=${categoryUpper}&part=`;

    const paginationLength = await fetch(url)
      .then((response) => {
        if (response.status === 200) {
          return response.text();
        } else {
          throw new Error(ERRORS.STATUS);
        }
      })
      .then((html) => {
        if (html.length) {
          return findPaginationLength(html);
        } else {
          throw new Error(ERRORS.EMPTY);
        }
      })
      .catch((err) => console.log(err));

    for (let l = 0; l < paginationLength; l++) {
      await fetch(`${urlWithPagination}${l + 1}`)
        .then((response) => {
          if (response.status === 200) {
            return response.text();
          } else {
            throw new Error(ERRORS.STATUS);
          }
        })
        .then((html) => {
          if (html.length) {
            return parseArticles(html);
          } else {
            throw new Error(ERRORS.EMPTY);
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

  console.log(articles);
  return articles;
};

const getArticles = async () => {
  const articles = await this.scrapeArticles();
};

getArticles();
