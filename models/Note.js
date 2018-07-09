var mongoose = require("mongoose");

// save a reference to the Schema constructor
var Schema = mongoose.Schema;

// using the Schema constructor, create a new NoteSchema object
// this is similar to a Sequelize model
var NoteSchema = new Schema({
  // `body` is of type String
  body: String
});

// this creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// export the Note model
module.exports = Note;