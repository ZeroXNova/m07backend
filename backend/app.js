const express = require("express");
var cors = require("cors");
const Song = require("./models/songs.js");
const app = express();
// const bodyParser = require('body-parser');
const jwt = require("jwt-simple");
const User = require("./models/users.js");

app.use(cors());

app.use(express.json());
const router = express.Router();
const secret = "supersecret";

// creating a new user
router.post("/user", async(req,res) => {
    if(!req.body.username || !req.body.password){
        res.status(400).json({error: "Missing username or password"})
    }

    const newUser = await new User({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })

    try{
        await newUser.save()
        console.log(newUser)
        res.sendStatus(201) //user created
    }
    catch(err){
        console.log(err)
    }

})

//authenticate or login
//post request because logging in creates a new 'session'
router.post("/auth", async(req,res) =>{
    if(!req.body.username || !req.body.password){
        res.status(400).json({error: "Missing username or password"})
        return
    }
    //try to find username in db, then see if it matches a un/pw combo
    //await finding user
    
    let user = await User.findOne({username : req.body.username})

        // bad username
        if(!user){
            res.status(401).json({error:"Bad username"})
        }
        // check password
        else{
            if(user.password != req.body.password){
                res.status(401).json({error: "Bad password"})
            }
            // successful login attempt
            else{
                // create token encoded with jwt, and send username
                // also send back authorization
                // using boolean or number

                username2 = user.username
                const token = jwt.encode({username: user.username},secret)
                const auth = 1

                // respond with token
                res.json({
                    username2, 
                    token: token,
                    auth: auth
                })
            }
        }
    })

    // check status of user with valid token, see if it matches frontend token
    router.get("/status", async(req,res) => {
        if(!req.headers["x-auth"]){
            return res.status(401).json({error: "Missing X-Auth"})
        }

        // if x-auth contains token
        const token = req.headers["x-auth"]
        try{
            const decoded = jwt.decode(token,secret)

            // send back all usernames and status fields to front end
            let users = User.find({}, "username status")
            res.json(users)
        }
        catch(ex){
            res.status(401).json({error: "invalid jwt"})
        }
    })


//grab all db Songs
router.get("/songs", async(req,res) =>{
    try{
        const songs = await Song.find({});
        res.send(songs);
        console.log(songs);
    }
    catch (err){
        console.log(err);
    }

});

// grab single song
router.get("/songs/:id", async (req,res) =>{
    try{
        const song = await Song.findById(req.params.id)
        res.json(song);
    }
    catch (err){
        res.status(400).send(err);
    }
});

//create a song
router.post("/songs", async(req,res) => {
    try{
        const song = await new Song(req.body);
        await song.save();
        res.status(201).json(song);
        console.log(song);
    }
    catch{
        res.status(400).send(err);
    }
})

//update uses a put request
router.put("/songs/:id", async(req,res) =>{
    //to find song, request the id, then search for it
    try{
        const song = req.body
        await Song.updateOne({_id: req.params.id}, song)
        console.log(song)
        res.sendStatus(204)
    }
    catch(err){
            res.status(400).send(err)
    }
})

//update uses a delete request
router.delete("/songs/:id", async(req,res) =>{
    try{
        const song = await Song.findById(req.params.id)
        console.log(song)
        await Song.deleteOne({_id: req.params.id})
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
    }
})


app.use("/api", router);
app.listen(3000);