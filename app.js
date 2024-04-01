const express = require('express');
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const basicAuth = require("express-basic-auth");
const bcrypt = require('bcrypt');

const Authorizer = async (username, password, callback) => {
  fs.readFile('./users.csv', 'utf-8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture de users.csv :', err);
      return callback(null, false);
    }
    console.log(password)
    const lignes = data.trim().split('\n');

    for (let i = 0; i < lignes.length; i++) {
      const ligne = lignes[i];
      const [user, EncryptedPassword] = ligne.split(',').map(str => str.trim());
      console.log(EncryptedPassword)
      if (user.trim() === username) {
        bcrypt.compare(password, EncryptedPassword, (err, result) => {
          if (err) {
            console.error('Erreur lors de la comparaison des mots de passe :', err);
            return callback(null, false);
          }
          if (result) {
            console.log('Autorisation reussie');
            return callback(null, true);
          } else {
            console.log('Autorisation echouee');
            return callback(null, false);
          }
        });
        return;
      }
    }

    console.log('Utilisateur non trouvé');
    callback(null, false);
  });
};




app.use(basicAuth({
  authorizer: Authorizer,
  challenge: true,
  authorizeAsync: true,
}));

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
