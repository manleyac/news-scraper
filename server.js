//required node modules
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");
const exphbs = require("express-handlebars");

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

//set up handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

mongoose.connect(MONGODB_URI);
//website link
const webLink = "https://www.nytimes.com/books/best-sellers/hardcover-fiction/?action=click&contentCollection=Books&referrer=https%3A%2F%2Fwww.nytimes.com%2Fsection%2Fbooks&region=Body&module=CompleteListLink&version=Fiction&pgtype=Reference";

//app routes
app.get("/", (req,res) => {
   db.Book.find({}).then((response) => {
      res.render("index", {books: response});
   });
   // let data = db.Book.find({}, (err,response) => {
   //    let dataArray = [];
   //    response.map((book) => {
   //       dataArray.push(book);
   //    });
   //    return dataArray;
   // });
   // console.log(data);
   // res.render("index", {books: data});
});

app.get("/scrape", (req,res) => {
   
   axios.get(webLink).then((response) => {
      const $ = cheerio.load(response.data);
   
      $(".book-menu li article .book-body").each( (i,element) => {

         //gets book title
         let bookTitle = $(element).find($(".title")).text();
         //gets book author
         let bookAuthor = $(element).find(".author").text().slice(3);
         //gets book image
         let bookPhoto = $(element).parent("article").children("footer").children("div").find("img").attr("src");

         let result = {
            title: bookTitle,
            author: bookAuthor,
            photo: bookPhoto
         };

         db.Book.findOneAndUpdate({
            title: bookTitle,
            author: bookAuthor
            },result,{
               upsert: true,
               new: true
            }, function(data){
               console.log(data)
            });
         });
      });
      res.send("Scrape Complete!")
   });

app.listen(PORT, () => {
   console.log(`App running on port ${PORT}`);
});