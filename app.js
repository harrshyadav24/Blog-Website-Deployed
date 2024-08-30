require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require('lodash');
const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;
mongoose.connect(url);

const postSchema = new mongoose.Schema({
    title: String,
    body: String
});
const Post = mongoose.model("Post", postSchema);


const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async function (req, res) {
    res.render("home");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/compose", function (req, res) {
    res.render("compose");
});

app.post("/compose", function (req, res) {
    const post = new Post({
        title: req.body.postTitle,
        body: req.body.postBody
    });
    post.save();
    res.redirect("/");
});

app.post("/", async function (req, res) {
    try {
        const posts = await Post.find({});
        res.render("posts", {postArray: posts});
    } catch (error) {
        console.log(error);
    }
});

app.get("/posts/:id", async function (req, res) {
    const postID = req.params.id;
    try {
        const post = await Post.findOne({_id: postID});
        res.render("post", {post: post});
    } catch (error) {
        console.log(error);
    }
});

const port = process.env.PORT;
app.listen(port, function () {
    console.log(`Server is running on port ${port}.`);
});