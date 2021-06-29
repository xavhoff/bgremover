const express = require("express");
const { spawn } = require("child_process");
const app = express();
require("dotenv").config();

const port = 8888;

app.get("/", (req, res) => {
  const python = spawn(
    "python3",
    [
      `${process.env.TOOL_PATH}main.py`,
      "-i",
      process.env.INPUT_SRC,
      "-o",
      process.env.OUTPUT_SRC,
      "-postp",
      "rtb-bnb2",
      "-m",
      "u2netp",
    ],
    { cwd: process.env.TOOL_PATH }
  );

  var dataToSend;

  python.stdout.on("data", function (data) {
    console.log("Pipe data from python script ...");
    dataToSend = data.toString();
  });

  python.stderr.on("data", (data) => console.log(data.toString()));

  python.on("close", (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    res.send(dataToSend);
  });
});

app.listen(port, () => console.log("App listening on %s", port));
