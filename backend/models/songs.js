const db = require("../db.js");

const Song = db.model("Song", {
    // hidden _id parameter
    title: { type:String, required:true},
    artist: String,
    popularity:{ type:Number, min:1, max:10},
    releaseDate:{ type:Date, default:Date.now},
    genre: [ String ],
    username: String
});

module.exports = Song;
