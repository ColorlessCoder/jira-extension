const express = require("express");
const cors = require('cors')
const fetch = require('node-fetch')

const app = express();
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.put('/proxy', (req, response) => {
  fetch(req.body.url, {
    method: req.body.method,
    headers: req.body.headers,
    body: JSON.stringify(req.body.bodyData)
  }).then(res => {return res.json()})
    .then(res => {response.json(res)})
    .catch(err => response.status(500).send(err))
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`listening on ${PORT}`));