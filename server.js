const express = require("express");
const path = require("path");
const compression = require("compression");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(compression());
app.use(express.static("client/build"));

app.get("*", (req, res) => {
    res.sendFile(path.resolve("client", "build", "index.html"));
});

app.listen(PORT, () => {
    console.log("App listen on port: " + PORT);
});
