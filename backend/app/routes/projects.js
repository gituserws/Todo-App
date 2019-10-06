const express = require("express");
const router = express.Router();
const Project = require("../models/project");


router.post("/", (req, res, next) => {
    console.log('projects');
    let name = req.body.name;
    const project = new Project({
        name: name
    });
    project
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Project created"
            });
        })
        .catch(err => {
            console.log("err", err);
            res.status(500).json({
                error: err
            });
        });
});
router.put("/:id", (req, res, next) => {
    Project.findOneAndUpdate(
        { _id: req.params.id },
        { name: req.body.name },
        { upsert: false, new: true },
        function (err, result) {
            console.log("project callback");
            if (err) {
                console.log("project find and update err");
                res.json({
                    success: false,
                    error: err
                });
            }
            else if (result) {
                const response = {
                    success: true,
                    message: "project  found",
                    project: result
                };
                console.log("project content succesfully  updated", result);
                console.log(response);
                res.status(200).json(response);
            }
        }
    );
});
router.delete("/:id", (req, res, next) => {
    Project.findByIdAndRemove(req.params.id, function (err, project) {
        console.log("project callback");
        if (err) {
            console.log("project find and remove err");
            res.json({
                success: false,
                error: err
            });
        }
        else if (project) {
            const response = {
                message: "project  found",
                id: req.params.id
            };
            console.log("project successfully  removed", project);
            console.log(response);
            res.status(200).json(response);
        }
    }
    );
});
router.get("/", (req, res, next) => {
    console.log('projects')
    Project.find((err, docs) => {
        if (err) return res.json({ success: false, error: err });
        console.log("projects", docs);
        res.json(docs);
    });
});


module.exports = router;
