const express = require("express");
const router = express.Router();
const Project = require("./Project");
const SecondaryImages = require("./SecondaryImages");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");
const uploadImage = require("../middlewares/uploadImage");
const fs = require("fs");
const { Sequelize, col } = require("sequelize");
const connection = require("../database/database");
const SecondaryImage = require("./SecondaryImages");

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
    let titleImagesArray = [];
    if(id != undefined) {
        SecondaryImage.findAll({
            where: {
                projectId: id
            }
        }).then(secondaryImages => {
            ({secondaryImages: secondaryImages});
            secondaryImages.forEach((secondaryImage) => {
                titleImagesArray.push(secondaryImage.title);
            });
            titleImagesArray.push(SecondaryImages.title);
            for(i = 0; i < titleImagesArray.length-1; i++) {
                fs.unlink(`./public/uploads/${titleImagesArray[i]}`, (err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Imagem apagada");
                    }
                });
            }
        }).then(() => {
            SecondaryImage.destroy({
                where: {
                    projectId: id
                }
            });
            Project.destroy({
                where: {
                    id: id
                }
            })
        }).then(() => {
            res.redirect("/admin/projects");
        });
    } else {
        res.redirect("admin/projects");
    }
});

router.get("/admin/projects/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id;
    if(id != undefined) {
        Project.findByPk(id).then(project => {
            SecondaryImage.findAll({
                where: {
                    projectId: id
                }
            }).then(secondaryImage => {
                res.render("admin/projects/edit", {project: project, secondaryImage: secondaryImage});
            })
        });
    } else {
        res.redirect("/");
    }
});

router.post("/projects/update", uploadImage.array("project-images", 30), adminAuth, (req, res) => {
    let id = req.body.id;
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
    let deletedImagesId = req.body.deletedImagesId;
    let deletedImagesArray = deletedImagesId.split(",");
    let titleImagesArray = [];
    let idImagesArray = [];

    SecondaryImage.findAll({
        where: {
            projectId: id
        }
    }).then(secondaryImages => {
        ({secondaryImages: secondaryImages});
        secondaryImages.forEach((secondaryImage) => {
            idImagesArray.push(secondaryImage.id);
            titleImagesArray.push(secondaryImage.title);
        });

        let n = 0;
        for(i = 0; i < idImagesArray.length; i++) {
            if(idImagesArray[i] == deletedImagesArray[n]) {
                fs.unlink(`./public/uploads/${titleImagesArray[i]}`, (err) => {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Imagem apagada");
                    }
                });
                    n = n + 1;
                    console.log("RODOUI O IFFFFFFFFFFFFFFFFFFFF");
            }
        }
    }).then(() => {
        for(i = 0; i < deletedImagesArray.length ; i++) {
            SecondaryImages.destroy({
                where: {
                    id: deletedImagesArray[i]
                }
            });
        }
    });
    
    Project.update({title: title, slug: slugify(title), capeImage: capeImage, location: location, year: year, area: area, description: description},{
        where: {
            id: id
        }
    }).then(() => { 
        req.files.forEach((file) => {
            projectImages.push(file.filename);
            SecondaryImages.create({
                title: file.filename,
                projectId: id
            });
        });
    }).catch(err => {
        res.redirect("/");
    });
    res.redirect("/admin/projects");
});

module.exports = router;