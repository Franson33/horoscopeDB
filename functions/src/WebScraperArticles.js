const fetch = require("node-fetch");

const { categorysArticleHoroscope } = require("./Data.js");
const { parseArticles } = require("./ParseArticles.js");
const {
  findPaginationLength,
} = require("./ParseArticlesFindPaginationLength.js");

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

    const fetchPaginationLength = async (url) => {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const paginationLength = await findPaginationLength(html);
        return paginationLength;
      } catch (err) {
        console.log(err);
      }
    };

    const paginationLength = await fetchPaginationLength(url);

    const fetchArticles = async (url) => {
      try {
        const response = await fetch(url);
        const html = await response.text();
        const result = await parseArticles(html);

        Object.keys(result).forEach(
          (item) => (result[item]["category"] = category)
        );

        return result;
      } catch (err) {
        console.log(err);
      }
    };

    for (let l = 0; l < paginationLength; l++) {
      const result = await fetchArticles(`${urlWithPagination}${l + 1}`);

      articles = {
        ...articles,
        ...result,
      };
    }
  }

  return articles;
};
