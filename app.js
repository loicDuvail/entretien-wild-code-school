const express = require("express");
const path = require("path");
const timers = require("timers");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/script", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.js"));
});

app.get("/styles", (req, res) => {
    res.sendFile(path.join(__dirname, "./styles.css"));
});

const pool = require("./DB link");

app.post("/api/addMember", (req, res) => {
    const { name } = req.body;

    pool.query(
        `INSERT INTO argonautes (nom) VALUES ("${name}")`,
        (error, response) => {
            if (error)
                res.status(500).send("failed to connect to database").end();
        }
    );

    //timeout to also acces the last value inserted
    timers.setTimeout(() => {
        pool.query(`SELECT * FROM argonautes`, (error, response) => {
            if (error)
                res.status(500).send("failed to connect to database").end();
            res.send(response);
        });
    }, 100);
});

app.get("/api/getMembers", (req, res) => {
    pool.query(`SELECT * FROM argonautes`, (error, response) => {
        res.send(response);
    });
});
const PORT = 3000;
app.listen(PORT, console.log(`listening on port ${PORT}...`));
