const express = require("express");
const router = express.Router();
const Task = require("../models/task");


router.post("/", (req, res, next) => {
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
router.put("/:id/completed", (req, res, next) => {
    Task.findOneAndUpdate(
        { _id: req.params.id },
        { isDone: req.body.isDone },
        { upsert: false, new: true },
        function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    error: err
                });
            }
            else if (result) {
                const response = {
                    success: true,
                    message: "task  found",
                    task: result
                };
                console.log(response);
                res.status(200).json(response);
            }
        }
    );
});
router.put("/:id/content", (req, res, next) => {
    Task.findOneAndUpdate(
        { _id: req.params.id },
        { content: req.body.content },
        { upsert: false, new: true },
        function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    error: err
                });
            }
            else if (result) {
                const response = {
                    success: true,
                    message: "task  found",
                    task: result
                };
                res.status(200).json(response);
            }
        }
    );
});
router.delete("/:id", (req, res, next) => {
    Task.findByIdAndRemove(req.params.id, function (err, task) {
        if (err) {
            res.json({
                success: false,
                error: err
            });
        }
        else if (task) {
            const response = {
                message: "task  found",
                id: req.params.id
            };

            res.status(200).json(response);
        }
    }
    );
});
router.get("/", (req, res, next) => {
    let projectId = req.query.projectId;
    Task.find({ projectId: projectId }, (err, docs) => {
        if (err) return res.json({ success: false, error: err });
        console.log(docs);
        res.json(docs);
    });
});

module.exports = router;
