const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
//const router = express.Router();

const config = require("./config");
mongoose.connect(config.database);

// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use("/api/projects", require("./app/routes/projects"));
app.use("/api/tasks", require("./app/routes/tasks"));



// launch our backend into a port
app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));