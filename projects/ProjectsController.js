const express = require("express");
const router = express.Router();
const Project = require("./Project");
const SecondaryImages = require("./SecondaryImages");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");
const uploadImage = require("../middlewares/uploadImage");
const fs = require("fs");
const { Sequelize, col } = require("sequelize");

router.get("/admin/projects", adminAuth, (req, res) => {
    Project.findAll()
    .then(projects => {
        res.render("admin/projects/index", {projects: projects});
    });
});

router.get("/admin/projects/new", adminAuth, (req, res) => {
    res.render("admin/projects/new");
});

router.post("/projects/save", uploadImage.array("project-images", 30), adminAuth, (req, res) => {
    let title = req.body.title;
    let location = req.body.location;
    let year = req.body.year;
    let area = req.body.area;
    let description = req.body.description;
    let projectImages = [];
    req.files.forEach((file) => {
        projectImages.push(file.filename);
    });
    let capeImage = projectImages[0];
    Project.create({
        title: title,
        capeImage: capeImage,
        slug: slugify(title),
        location: location,
        year: year,
        area: area,
        description: description
    }).then(() => {     
        Project.max('id').then(function(max) {
            let maxId = max;
            req.files.forEach((file) => {
                projectImages.push(file.filename);
                SecondaryImages.create({
                    title: file.filename,
                    projectId: maxId
                });
            });
            res.redirect("/admin/projects");
        }).catch(err => {
            res.redirect("/");
        });   
    });
});

router.post("/projects/delete", adminAuth, (req, res) => {
    let id = req.body.id;
    if(id != undefined) {
        const projectImagesArray = SecondaryImages.findAll({
            where: {
                projectId: id
            }
        }).then(() => {
            const imagesArray = projectImagesArray;
            console.log(`A ID EHHHHH: ${id}`)
            console.log(`O array das imagens eh o seguinteeeeeeeeee: ${projectImagesArray}`);
            console.log(`O array das imagens eh o seguinteeeeeeeeee: ${imagesArray}`);
            res.redirect("/admin/projects");
        });
        /*
        fs.unlink("./public/uploads/")
        if(!isNaN(id)) { // se for um numero
            Project.destroy({
                where: {
                    id: id
                }
            })
            SecondaryImages.destroy({
                where: {
                    projectId: id
                }
            }).then(() => {
                res.redirect("/admin/projects");
            });
        } else { // se não for um numero
            res.redirect("/admin/projects");
        }
        */
    } else {
        res.redirect("admin/projects");
    }
});

router.get("/admin/projects/edit/:id", adminAuth, (req, res) => {
    let images = [];
    fs.readdir("./public/uploads/", (err, files) => {
        if(!err){
            files.forEach(file => {
            images.push(file);
            })
            //res.render("admin/projects/edit", { images: images})
        } else {
            console.log(err);
        }
    });
    let id = req.params.id;
    Project.findByPk(id).then(project => {
        if(project != undefined) {
            Category.findAll().then(categories => {
                res.render("admin/projects/edit", {images: images, project: project, categories: categories});
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