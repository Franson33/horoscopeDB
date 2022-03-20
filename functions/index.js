const functions = require("firebase-functions");
const admin = require("firebase-admin");

const { scrapeDailyHoroscope } = require("./src/WebScrapperDaily.js");
const { scrapeWeeklyHoroscope } = require("./src/WebScrapperWeekly.js");
const { scrapeMonthlyHoroscope } = require("./src/WebScrapperMonthly.js");
const { scrapeYearlyHoroscope } = require("./src/WebScrapperYearly.js");
const { scrapeArticles } = require("./src/WebScraperArticles.js");

admin.initializeApp();
const db = admin.firestore();

const dailyHoroscope = db.collection("dailyHoroscopeByDate");
const weeklyHoroscope = db.collection("weeklyHoroscopeByDate");
const monthlyHoroscope = db.collection("montlyHoroscopeByDate");
const yearlyHoroscope = db.collection("yarlyHoroscopeByYear");
const dailyArticles = db.collection("articles");

exports.dailyJob = functions.pubsub
  .schedule("1 00,12 * * *")
  .timeZone("Europe/London")
  .onRun(async (context) => {
    const dailyResult = await scrapeDailyHoroscope();
    const dailyDates = Object.keys(dailyResult);

    dailyDates.forEach(async (date) => {
      await dailyHoroscope.doc(date).set(dailyResult[date]);
    });
  });

exports.weeklyJob = functions.pubsub
  .schedule("1 00 * * mon")
  .timeZone("Europe/London")
  .onRun(async (context) => {
    const weeklyResult = await scrapeWeeklyHoroscope();
    const weeklyDates = Object.keys(weeklyResult);
    const date = weeklyDates[0];

    await weeklyHoroscope.doc(date).set(weeklyResult[date]);
  });

exports.monthlyJob = functions.pubsub
  .schedule("1 00 1 * *")
  .timeZone("Europe/London")
  .onRun(async (context) => {
    const monthlyResult = await scrapeMonthlyHoroscope();
    const monthlyDates = Object.keys(monthlyResult);
    const date = monthlyDates[0];

    await monthlyHoroscope.doc(date).set(monthlyResult[date]);
  });

exports.yearlyJob = functions.pubsub
  .schedule("1 00 1 */3 *")
  .timeZone("Europe/London")
  .onRun(async (context) => {
    const yearlyResult = await scrapeYearlyHoroscope();
    const yearlyDates = Object.keys(yearlyResult);

    yearlyDates.forEach(async (date) => {
      await yearlyHoroscope.doc(date).set(yearlyResult[date]);
    });
  });

exports.articlesDailyJob = functions.pubsub
  .schedule("1 00 * * *")
  .timeZone("Europe/London")
  .onRun(async (context) => {
    const articles = await scrapeArticles();
    const titles = Object.keys(articles);

    titles.forEach(async (title) => {
      await dailyArticles.doc(title).set(articles[title]);
    });
  });
