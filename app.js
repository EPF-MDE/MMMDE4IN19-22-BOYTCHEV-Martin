const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");

app.get('/', (req, res) => res.sendFile(path.join(__dirname, "./views/home.html")));
app.get('/', (req, res) => res.send('Hello World & Alien?!'));

app.use(express.json());

app.post('/api/students/create', (req, res) => {
  const csvLine =`\n${req.body.name},${req.body.school}`
  console.log(csvLine);
  res.send("Student created");
  fs.writeFile('./students.csv', csvLine, { flag: 'a' }, (err) => {
    console.log("Added!");
  });
});

app.get('/api/students', (req, res) => {
  const rowSeparator = "\r\n";
  const cellSeparator = ",";
  fs.readFile('./students.csv', 'utf8', (err, data) => {
    console.log("Contenu de students.csv :");
    console.log(data);

    const rows = data.split(rowSeparator);
    const[headerRow, ...contentRows]=rows ;
    const header = headerRow.split(cellSeparator);

    const students = contentRows.map(row => {
      const cells = row.split(cellSeparator);
      const student ={
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student
    });
    res.send(students);
  });
});

app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`)); 