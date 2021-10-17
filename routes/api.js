const express = require('express');
const passport = require('passport');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const Post = require('../models/Post');

router.get('/posts/:postId', async(req, res) => {
    const requestedPostId = req.params.postId;
    try {
        const post = await Post.findById(requestedPostId);
        res.send(post);
    } catch (err) {
        res.send(err);
    }
});

router.put('/posts/:postId', async(req, res) => {
    const putPostId = req.params.postId;
    try {
        await Post.findByIdAndReplace(putPostId, req.body)
        res.send("Put Okay")
    } catch (err) {
        res.send(err)
    }
});

router.patch('/posts/:postId', async(req, res) => {
    const putPostId = req.params.postId;
    try {
        await Post.findByIdAndUpdate(putPostId, req.body)
        res.send("Patch Okay")
    } catch (err) {
        res.send(err)
    }
});

router.post('/compose', async(req, res) => {
    const post = new Post(req.body);
    try {
        await post.save();
        res.send("Posted");
    } catch (err) {
        res.send(err);
    }
});

router.delete('/delete/:postId', async(req, res) => {
    const deletedPostId = req.params.postId;
    try {
        await Post.deleteOne({ _id: deletedPostId });
        res.send("Deleted");
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;