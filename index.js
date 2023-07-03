//Clothing line backend 

const express = require('express');
const app = express();

const port = 8080;
const clothes = ['hoodie', 't-shirt', 'blouse', 'tracksuit', 'crewneck', 'cardigan'];

app.get('/', (req, res) => {
  res.send(`<h1>Clothing line home</h1>`);
});

app.get('/clothes', (req, res) => {
  res.send(clothes);
});

app.listen(port, () => {
  console.log(`Runnig right now on port ${port}`);
});

