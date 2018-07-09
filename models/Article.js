var mongoose = require("mongoose");

// save a reference to the Schema constructor
var Schema = mongoose.Schema;

// using the Schema constructor, create a new UserSchema object
// this is similar to a Sequelize model
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // `subhead` is required and of type String
  subhead: {
    type: String,
    required: true
  },
  // `note` is an object that stores a Note id
  // the ref property links the ObjectId to the Note model
  // this allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// this creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// export the Article model
module.exports = Article;
