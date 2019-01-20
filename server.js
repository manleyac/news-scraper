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
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

mongoose.connect(MONGODB_URI);
//website link
const webLink = "https://www.nytimes.com/books/best-sellers/hardcover-fiction/?action=click&contentCollection=Books&referrer=https%3A%2F%2Fwww.nytimes.com%2Fsection%2Fbooks&region=Body&module=CompleteListLink&version=Fiction&pgtype=Reference";

axios.get(webLink).then((response) => {

   
});

//app routes
app.get("/", (req,res) => {
   res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/scrape", (req,res) => {
   
   axios.get(webLink).then((response) => {
      const $ = cheerio.load(response.data);
   
      $(".book-menu li article .book-body").each( (i,element) => {

         //gets book title
         let title = $(element).find($(".title")).text();
         //gets book author
         let author = $(element).find(".author").text().slice(3);
         //gets book image
         let photo = $(element).parent("article").children("footer").children("div").find("img").attr("src");

         let result = {
            "title": title,
            "author":author,
             "photo": photo
         };
         if(db.Book.find({
            "title":title,
            "author":author
         }) === undefined) {
            db.Book.create(result)
            .then((dbArticle) => {
               console.log(dbArticle);
            }).catch((err) => {
               console.log(err);
            });
         }
      });

      res.send("Scrape Complete!")
   });
});

app.listen(PORT, () => {
   console.log(`App running on port ${PORT}`);
});