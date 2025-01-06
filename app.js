const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/user');
const Note = require('./models/notes'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.get("/", (req, res) => {
    res.render("index");
});

let notes = []; 

app.get('/notes', (req, res) => {
    res.render('notes', { notes });
});

app.post('/notes', (req, res) => {
    const { date, text } = req.body;
    const newNote = { date, text };
    notes.push(newNote);
    res.redirect('/notes'); 
});


/* app.get('/notes', (req, res) => {
    res.render('notes', { Note });
});

app.post('/notes', (req, res) => {
    const { date, note } = req.body;
    note.push({ date, text: note });
    res.redirect('/notes'); 
}); */


app.get('/note/:id', async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render("show", { note }); 
});

app.get('/edit/:id', async (req, res) => {
    const note = await Note.findById(req.params.id);
    res.render("edit", { note }); 
});

app.post('/edit', async (req, res) => {
    const { id, title, details } = req.body;
    await Note.findByIdAndUpdate(id, { title, details });
    res.redirect("/notes");
});

app.post('/create', async (req, res) => {
    const { title, details } = req.body;
    await Note.create({ title, details });
    res.redirect("/notes");
});

app.post('/deletenote/:id', async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);
    res.redirect("/notes");
});

app.post('/deleteuser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);  
        res.redirect('/clients');  
    } catch (error) {
        console.error(error);
        res.status(500).send("Error deleting user.");
    }
});


app.get("/welcome", (req, res) => {
    res.render("welcome");
});

app.get('/clients', async (req, res) => {
    try {
        const clients = await User.find(); 
        res.render("clients", { clients }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/clients', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).send("The name field is required.");
        }

        await User.create({
            name,
            lastname: '', 
            email: '', 
            password: 'default' 
        });

        res.redirect('/clients');
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/community", (req, res) => {
    res.render("community");
});

app.get("/chat", (req, res) => {
    res.render("chat");
});

app.get("/resources", (req, res) => {
    res.render("resources");
});

app.get("/profile", (req, res) => {
    res.render("profile");
});

app.get("/calender", (req, res) => {
    res.render("calender");
});

app.get("/liveactivity", (req, res) => {
    res.render("liveactivity");
});

// User Registration
app.post("/register", async (req, res) => {
    try {
        const { name, lastname, email, password } = req.body;

        if (!name || !lastname || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            name,
            lastname,
            email,
            password: hash
        });

        const token = jwt.sign({ email: newUser.email, userId: newUser._id }, "shhhh");
        res.cookie("token", token, { httpOnly: true });

        res.send("User registered successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// User Login
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send("All fields are required");
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }

        const token = jwt.sign({ email: user.email, userId: user._id }, "shhhh");
        res.cookie("token", token, { httpOnly: true });

        res.send("Login successful");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// User Logout
app.get("/logout", (req, res) => {
    res.cookie("token", "", { maxAge: 1 });
    res.redirect("/");
});

// Start the Server
app.listen(3001, function () {
    console.log("Server is running on http://localhost:3001");
});
