const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Project = require("./Project");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");
const uploadImage = require("../middlewares/uploadImage");

router.get("/admin/projects", adminAuth, (req, res) => {
    Project.findAll({
        include: [{model: Category}]
    }).then(projects => {
        res.render("admin/projects/index", {projects: projects});
    });
});

router.get("/admin/projects/new", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/projects/new", {categories: categories});
    });
});

router.post("/upload", uploadImage.single("image"), (req, res) => {
    image = req.file.filename;
    console.log("Upload realizado.");
});

router.post("/projects/save", uploadImage.single("cape-image"), adminAuth, (req, res) => {
    let capeImage = req.file.filename;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;
    Project.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category,
        capeImage: capeImage
    }).then(() => {
        res.redirect("/admin/projects");
    });
});

router.post("/projects/delete", adminAuth, (req, res) => {
    let id = req.body.id;
    if(id != undefined) {
        if(!isNaN(id)) { // se for um numero
            Project.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/projects");
            });
        } else { // se não for um numero
            res.redirect("/admin/projects");
        }
    } else {
        res.redirect("admin/projects");
    }
});

router.get("/admin/projects/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id;
    Project.findByPk(id).then(project => {
        if(project != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/projects/edit", {project: project, categories: categories});
            });
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

router.post("/projects/update", adminAuth, (req, res) => {
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;
    Project.update({title: title, body: body, categoryId: category, slug: slugify(title)},{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/projects");
    }).catch(err => {
        res.redirect("/");
    });
});

module.exports = router;