const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const session = require('express-session');
const connection = require("./database/database");

const projectsController = require("./projects/ProjectsController");
const usersController = require("./users/UsersController");
const architectsController = require("./architects/ArchitectsController");

const Project = require("./projects/Project");
const User = require("./users/User");
const Architect = require("./architects/Architect");

// favicon
app.use("/favicon.ico", express.static("public/img/favicon/favicon.ico"));

// static
// app.use('/static', express.static('public'));
app.use('/static', express.static(__dirname + '/public'));

// view engine
app.set('view engine', 'ejs');

// body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// sessions
app.use(session({
    secret: "klasdksdfdflasdgvbjasdkdjdhfbbf", cookie: { maxAge: 3000000000 }
}));

// database
connection
    .authenticate()
    .then(() => {
        console.log("Connection established with the database");
    }).catch((error) => {
        console.log(`An error has ocurred while connecting with the database, ${error}`);
    });

// use
app.use("/", projectsController);
app.use("/", usersController);
app.use("/", architectsController);

app.get('/', (req, res) => {
    res.render("index");
});

// rotas
app.get('/about', (req, res) => {
    Architect.findAll({
        order: [
            ['id', 'DESC' ]
        ],
        limit: 5
    }).then(architects => {
        res.render("about", {architects: architects});
    });
});

app.get('/projects', (req, res) => {
    Project.findAll({
        order: [
            ['id', 'DESC' ]
        ],
        limit: 30
    }).then(projects => {
        Category.findAll().then(categories => {
            res.render("projects", {projects: projects, categories: categories});
        });
    });
});

app.get("/:slug", (req, res) => {
    let slug = req.params.slug;
    Project.findOne({
        where: {
            slug: slug
        }
    }).then(project => {
        if(project != undefined) {
            Category.findAll().then(categories => {
                res.render("project", {project: project, categories: categories});
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});