const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const fs = require("fs");
const path = require("path");
const basicAuth = require("express-basic-auth");
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const Student = require("./models/Student");

app.use(cookieParser());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/epfbook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check connection
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', err => console.error('MongoDB connection error:', err));

module.exports = db;

const Authorizer = async (username, password, callback) => {
  fs.readFile('./users.csv', 'utf-8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture de users.csv :', err);
      return callback(null, false);
    }
    const lignes = data.trim().split('\n');

    for (let i = 0; i < lignes.length; i++) {
      const ligne = lignes[i];
      const [user, EncryptedPassword] = ligne.split(',').map(str => str.trim());
      if (user.trim() === username) {
        bcrypt.compare(password, EncryptedPassword, (err, result) => {
          if (err) {
            console.error('Error :', err);
            return callback(null, false);
          }
          if (result) {
            console.log('Successful');
            return callback(null, true);
          } else {
            console.log('Failed');
            return callback(null, false);
          }
        });
        return;
      }
    }

    console.log('User not found');
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

app.get("/students/data", (req, res) => {
  res.render("students_data");
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

app.post("/api/login", (req, res) => {
  console.log("current cookies:", req.cookies);
  const token = "FOOBAR";
  const tokenCookie = {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  };
  res.cookie("auth-token", token, tokenCookie);
  res.send("OK");
});

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

app.post('/students/create-in-db', async (req, res) => {
  try {
    const { name, school } = req.body;
    const student = new Student({ name, school });
    await student.save();
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student', details: error.message });
  }
});

app.get('/from-db', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/students/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('./students.csv', 'utf-8', (err, data) => {
      if (err) {
          console.error('Erreur lors de la lecture de students.csv :', err);
          return res.status(500).send('Erreur interne du serveur');
      }

      const lignes = data.trim().split('\n');

      // Vérifier si l'ID est valide
      if (id < 0 || id >= lignes.length) {
          return res.status(404).send('Étudiant non trouvé');
      }

      // Séparer les lignes non vides ou non valides
      const etudiantLigne = lignes[id];
      if (!etudiantLigne) {
          return res.status(404).send('Étudiant non trouvé');
      }

      // Séparer les informations de l'étudiant
      const infosEtudiant = etudiantLigne.split(',').map(str => str.trim());
      if (infosEtudiant.length !== 2) {
          return res.status(404).send('Étudiant non trouvé');
      }

      const student = { name: infosEtudiant[0], school: infosEtudiant[1] };

      // Rendre la vue student_details avec les données d'étudiant
      res.render('student_details', { student });
  });
});


app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`)); 
