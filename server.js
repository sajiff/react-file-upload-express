const express = require("express");
const fileUpload = require("express-fileupload");

const PORT = process.env.PORT || 5000;

const app = express();

app.use(fileUpload());

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

//upload endpoint
app.post("/upload", (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "no file uploaded" });
  }

  const file = req.files.file;

  file.mv(`${__dirname}/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }

    res.json({
      fileName: file.name,
      filePath: `uploads/${file.name}`,
    });
  });
});

app.listen(PORT, () => console.log("server started...."));
