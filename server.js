//required node modules
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

//required models
const db = require("./models");

const PORT = process.env.PORT || 3000;

//express app
const app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/news-scraperdb", { useNewUrlParser: true });

//website link
const webLink = "https://www.nytimes.com/books/best-sellers/hardcover-fiction/?action=click&contentCollection=Books&referrer=https%3A%2F%2Fwww.nytimes.com%2Fsection%2Fbooks&region=Body&module=CompleteListLink&version=Fiction&pgtype=Reference";

axios.get(webLink).then((response) => {

   const $ = cheerio.load(response.data);
   let results = [];

   // const book =$(".book-menu li article .book-body").html();
   // const title = $(".book-menu li article .book-body h2").text();
   // console.log(book);
   // console.log(title);

   $(".book-menu li article .book-body").each( (i,element) => {
      let title = $(element).children("h2").text();
      let author = $(element).children(".author").text().slice(3);
      let photo = $(element).parent("article").children("footer").children("div").children("img").attr("src");
      console.log(photo);
      results.push({
         "title": title,
         "author":author,
         // "photo": photo
      });
   });
   console.log(results);
});

//app routes
app.get("/", (req,res) => {
   res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/scrape", (req,res) => {
   axios.get(webLink).then((res) => {

   });
})

app.listen(PORT, () => {
   console.log(`App running on port ${PORT}`);
});