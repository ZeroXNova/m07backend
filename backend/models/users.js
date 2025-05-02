const db = require("../db.js");

const User = db.model("User", {
    // hidden _id parameter
    username: { type:String, required:true},
    password:{ type:String, required:true},
    status:{ type:String},
});

module.exports = User;
