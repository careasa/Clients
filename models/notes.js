const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    title: String,
    details: String,
});

module.exports = mongoose.model("notes", noteSchema);

