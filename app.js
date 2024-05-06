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

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/epfbook', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//check connection
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));
db.on('error', err => console.error('MongoDB connection error:', err));

module.exports = db;


const Authorizer = async (username, password, callback) => {
  //read the users.csv file to check credentials
  fs.readFile('./users.csv', 'utf-8', (err, data) => {
    if (err) {
      //see if there is error
      console.error('Error users.csv:', err);
      return callback(null, false);
    }
    //split the lines of the CSV file
    const lines = data.trim().split('\n');

    //iterate over each line to find the corresponding user
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      //split the line into username and password
      const [user, EncryptedPassword] = line.split(',').map(str => str.trim());
      //check if the username matches the provided one
      if (user.trim() === username) {
        //compare the provided password with the encrypted password
        bcrypt.compare(password, EncryptedPassword, (err, result) => {
          if (err) {
            //handle errors comparing passwords
            console.error('Error:', err);
            return callback(null, false);
          }
          //if comparison succeeds, authentication is successful
          if (result) {
            console.log('Successful');
            return callback(null, true);
          } else {
            //if comparison fails, authentication fails
            console.log('Failed');
            return callback(null, false);
          }
        });
        return;
      }
    }

    //if user is not found in the CSV file, authentication fails
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
  //define separators for rows and cells
  const rowSeparator = "\n";
  const cellSeparator = ",";
  
  //read the students.csv file
  fs.readFile("./students.csv", 'utf-8', (err, data) => {
    //see if there is error
    if (err) {
      console.error('Error students.csv:', err);
      return res.status(500).send('Error');
    }
    //split the data into rows based on row separator
    const rows = data.split(rowSeparator);
    //separate header row from content rows
    const [headerRow, ...contentRows] = rows;
    //split header row into column names
    const header = headerRow.split(cellSeparator);

    //map each content row to a student object
    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student;
    });
    res.render("students", { students });
  });
});


//render the "students_data" view
app.get("/students/data", (req, res) => {
  res.render("students_data");
});

//render the "create-student" view
app.get("/students/create", (req, res) => {
  res.render("create-student");
});

//to create a new student
app.post("/students/create", (req, res) => {
  //extract name and school from the request body
  const name = req.body.name;
  const school = req.body.school;
  
  //construct a CSV line with the new student's information
  const csvLine =`\n${name},${school}`;
  
  //append the new student's information to the students.csv file
  fs.writeFile("./students.csv", csvLine, { flag: 'a' }, (err) => {
    if (err) {
      console.error("Error writing to students.csv:", err);
    } else {
      console.log("Added!");
    }
  });
  res.redirect("/students/create?created=1");
});

app.use(express.json());

//to log in
app.post("/api/login", (req, res) => {
  //set a authentication token cookie
  const token = "FOOBAR";
  const tokenCookie = {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  };
  res.cookie("auth-token", token, tokenCookie);
  res.send("OK");
});

//to create a new student via API
app.post("/api/students/create", (req, res) => {
  //extract name and school from the request body
  const csvLine =`\n${req.body.name},${req.body.school}`;
  
  //append the new student's information to the students.csv file
  fs.writeFile("./students.csv", csvLine, { flag: 'a' }, (err) => {
    if (err) {
      console.error("Error writing to students.csv:", err);
    } else {
      console.log("Added!");
    }
  });
  
  res.send("Student created");
});

//to retrieve all students via API
app.get("/api/students", (req, res) => {
  //define separators for rows and cells
  const rowSeparator = "\r\n";
  const cellSeparator = ",";
  
  //read the students.csv file
  fs.readFile("./students.csv", "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading students.csv:", err);
      return res.status(500).send("Internal server error");
    }
    
    const rows = data.split(rowSeparator);
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);
    
    //map each content row to a student object
    const students = contentRows.map(row => {
      const cells = row.split(cellSeparator);
      //construct a student object
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student;
    });
    res.send(students);
  });
});

//create a student who will be stored in the database mongoose
app.post('/students/create-in-db', async (req, res) => {
  try {
    const { name, school } = req.body;
    const student = new Student({ name, school });
    await student.save();
    res.status(201).json({ message: 'student created successfully', student });
  } catch (error) {
    res.status(500).json({ error: 'failed to create student', details: error.message });
  }
});

app.get('/from-db', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/students/:id', (req, res) => {
  //get the id 
  const id = parseInt(req.params.id);

  //read the students.csv file
  fs.readFile('./students.csv', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error students.csv:', err);
      return res.status(500).send('error');
    }

    //split the data into lines
    const lines = data.trim().split('\n');

    //check if the id is within valid range
    if (id < 0 || id >= lines.length) {
      return res.status(404).send('Student not found');
    }

    //get the student information
    const studentLine = lines[id];

    //check if student information is found
    if (!studentLine) {
      return res.status(404).send('Student not found');
    }

    //split the student information into name and school
    const studentInfo = studentLine.split(',').map(str => str.trim());

    //check if student information is valid
    if (studentInfo.length !== 2) {
      return res.status(404).send('student not found');
    }

    //construct the student object to have the id for the post method
    const student = { id: id, name: studentInfo[0], school: studentInfo[1] }; 

    res.render('student_details', { student });
  });
});


app.post('/students/:id', (req, res) => {
  //get the id
  const id = parseInt(req.params.id);

  //read the students.csv file
  fs.readFile('./students.csv', 'utf-8', (err, data) => {
    if (err) {
      console.error('Error reading students.csv:', err);
      return res.status(500).send('Internal server error');
    }

    //split the data into rows based on newline separator
    const rows = data.trim().split('\n');

    //map each row to a student object
    const students = rows.map(row => {
      const [name, school] = row.split(',').map(str => str.trim());
      return { name, school };
    });

    //check if the id is valid
    if (id < 0 || id >= students.length) {
      return res.status(404).send('student not found');
    }

    //update the name and school of the student with the provided id
    students[id].name = req.body.name;
    students[id].school = req.body.school;

    //generate updated CSV data
    const updatedCSV = students.map(student => `${student.name},${student.school}`).join('\n');

    //write the updated CSV 
    fs.writeFile('./students.csv', updatedCSV, (err) => {
      if (err) {
        //see if there is error
        console.error('error students.csv:', err);
        return res.status(500).send('error');
      }
      //redirect the client to the details page with data updated
      res.redirect(`/students/${id}`);
    });
  });
});


app.listen(port, () => console.log(`Example app listening on http://localhost:${port}`)); 