const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BookSchema = new Schema({
   title: {
      type: String,
      required: true
   },
   
   author: {
      type: String,
      required: true
   },
   
   photo: {
      type: String,
   },

   note: {
      type: Schema.Types.ObjectId,
      ref: "Note"
   }
});

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;