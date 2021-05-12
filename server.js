require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const shortid = require('shortid');
const Url = require('./models/url.js');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

try {
  mongoose.connect("mongodb+srv://chirayu:Chirayu@123@cluster0.jdqrk.mongodb.net/urlshortner?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
} catch (err) {
  console.log(err);
}


app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async function (req, res) {

  var longurl = req.body.url;

  try {

    var url = await Url.findOne({ longurl: longurl }).exec();

    if (url) {
      res.status(200).json({ "original_url": longurl, "short_url": url.code });
    }
    else {

      const code = shortid.generate();
      new Url({
        longurl: longurl,
        code: code
      }).save();

      res.status(200).json({ "original_url": longurl, "short_url": code });

    }
  } catch (err) {
    console.log(err);
  }

});

app.get("/api/shorturl/:code", async function (req, res) {
  var code = req.params.code;
  var url = await Url.findOne({ code: code }).exec();
  if (url) {
    res.redirect(url.longurl);
  } else {
    res.status(404).send("URL Not Found");
  }


})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
