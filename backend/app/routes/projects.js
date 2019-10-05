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
router.get("/", (req, res, next) => {
    console.log('projects')
    Project.find((err, docs) => {
        if (err) return res.json({ success: false, error: err });
        console.log("projects", docs);
        res.json(docs);
    });
});


module.exports = router;
