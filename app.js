const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/welcome", (req, res) => {
    res.render("welcome");
});

app.get("/clients",(req,res) => {
        res.render("clients");
});

app.get("/community",(req,res) => {
        res.render("community");
});

app.get("/chat",(req,res) => {
        res.render("chat");
});

app.get("/resources",(req,res) => {
        res.render("resources");
});

app.get("/profile",(req,res) => {
        res.render("profile");
});

app.get("/calender",(req,res) => {
        res.render("calender");
});

app.get("/liveactivity",(req,res) => {
        res.render("liveactivity");
});

app.get("/createnotes",(req,res) => {
        res.render("createnotes");
});

app.get("/create", (req,res) => {
    res.send("done");
})

app.post("/createnotes", async (req, res) => {
    const { title, details } = req.body;
    await notes.createnotes({ title, details }); 
});

/* app.post('/create', async (req, res) => {
    const { title, details } = req.body;
    await notes.create({ title, details });
    res.redirect("/");
}); */

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

app.get("/logout", (req, res) => {
    res.cookie("token", "", { maxAge: 1 });
    res.redirect("/");
});

app.listen(3001, function () {
    console.log("Server is running on http://localhost:3001");
});

    
