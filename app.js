const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set("views", "./views"); 
app.set("view engine", "ejs");

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./views/home.html")));
//app.get('/', (req, res) => res.send('Hello World & Alien?!'));

app.get("/students", (req, res) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  fs.readFile("./students.csv", 'utf-8', (err, data) => {
    console.log("Contenu de students.csv :");
    console.log(data);

    const rows = data.split(rowSeparator);
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      console.log(student);
      return student;
    });
    res.render("students", { students });
  });
});


app.get("/students/create", (req, res) => {
  res.render("create-student");
});

app.post("/students/create", (req, res) => {
  console.log(req.body);
  const name = req.body.name;
  const school = req.body.school; 
  const csvLine =`\n${name},${school}`
  console.log(csvLine);
  fs.writeFile("./students.csv", csvLine, { flag: 'a' }, (err) => {
    console.log("Added!");
  });
  res.redirect("/students/create?created=1");
});

app.use(express.json());

app.post("/api/students/create", (req, res) => {
  const csvLine =`\n${req.body.name},${req.body.school}`
  console.log(csvLine);
  res.send("Student created");
  fs.writeFile("./students.csv", csvLine, { flag: 'a' }, (err) => {
    console.log("Added!");
  });
});

app.get("/api/students", (req, res) => {
  const rowSeparator = "\r\n";
  const cellSeparator = ",";
  fs.readFile("./students.csv", "utf-8", (err, data) => {
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