const mongoose = require('mongoose');
const Note = require('./models/notes'); 


const ClientSchema = mongoose.Schema({
    name: String,
    notes: [Note]
});

const clientModel = mongoose.model('clients', ClientSchema);

module.exports = clientModel;
