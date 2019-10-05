const express = require("express");
const router = express.Router();
const Task = require("../models/task");


router.post("/", (req, res, next) => {
    console.log('tasks');
    let content = req.body.content;
    let projectId = req.body.projectId;
    const task = new Task({
        content: content,
        projectId: projectId
    });
    task
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Task created"
            });
        })
        .catch(err => {
            console.log("err", err);
            res.status(500).json({
                error: err
            });
        });
});
router.get("/", (req, res, next) => {
    let projectId = req.query.projectId;
    console.log("tasks", projectId)
    Task.find({ projectId: projectId }, (err, docs) => {
        if (err) return res.json({ success: false, error: err });
        console.log(docs);
        res.json(docs);
    });
});

module.exports = router;
