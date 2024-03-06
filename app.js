const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World & Alien?!')
})

app.get('/students', function (req, res) {
  const studentsInfo = [
    { name: "Eric Burel", school: "EPF" },
    { name: "Harry Potter", school: "Poudlard" }
  ];
  res.send(studentsInfo);
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})
