const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://zeroxnova:7NN2e5QXDQzxvGaT@songdb.qsrg4ye.mongodb.net/?retryWrites=true&w=majority&appName=SongDB",{useNewUrlParser: true});

module.exports = mongoose;