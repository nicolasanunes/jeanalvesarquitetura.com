const express = require("express");
const router = express.Router();
const Architect = require("./Architect");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");
const uploadImage = require("../middlewares/uploadImage");
const fs = require("fs");

/* 
 * GET routes 
 */

router.get("/admin/architects", adminAuth, (req, res) => {
    Architect.findAll().then(architects => {
        res.render("admin/architects/index", {architects: architects});
    });
});

router.get("/admin/architects/new", adminAuth, (req, res) => {
        res.render("admin/architects/new");
});

router.get("/admin/architects/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id;

    if(id != undefined) {
        Architect.findByPk(id).then(architect => {
            res.render("admin/architects/edit", {architect: architect});
        });
    } else {
        res.redirect("/");
    }
}) 

/*
 * POST Routes 
*/

/* CREATE */

router.post("/architects/create", uploadImage.single("image"), adminAuth, (req, res) => {
    let image = req.file.filename; // nome do campo que a informação será coletada no arquivo "new.ejs"
    let name = req.body.name; 
    let role = req.body.role;
    let whatsappLink = req.body.whatsappLink;
    let instagramLink = req.body.instagramLink;
    let facebookLink = req.body.facebookLink;  
    let description = req.body.description;

    Architect.create({
        image: image,
        name: name,
        slug: slugify(name),
        role: role,
        whatsappLink: whatsappLink,
        instagramLink: instagramLink,
        facebookLink: facebookLink,
        description: description,
    }).then(() => {
        res.redirect("/admin/architects");
    });
});

/* DELETE */

router.post("/architects/delete", adminAuth, (req, res) => {
    let id = req.body.id;
    let image;

    if(id != undefined) {
        Architect.findByPk(id).then(architect => {
            image = architect.image;
            fs.unlink(`./public/uploads/${image}`, (err) => {
                if(err) {
                    console.log(err);
                } 
            });
        }).then(() => {
            Architect.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/architects");
            });
        });
    } else {
        res.redirect("/");
    }
});

/* UPDATE */

router.post("/architects/update", uploadImage.single("image"), adminAuth, (req, res) => {
    let id = req.body.id;
    let image = req.body.image;
    let actualImage = req.body.image;
    let name = req.body.name;
    let role = req.body.role;
    let whatsappLink = req.body.whatsappLink;
    let instagramLink = req.body.instagramLink;
    let facebookLink = req.body.facebookLink;
    let description = req.body.description;

    if(req.file != undefined) {
        image = req.file.filename;
    }

    if(image == actualImage) {
        Architect.update({
            name: name,
            slug: slugify(name),
            role: role,
            whatsappLink: whatsappLink,
            instagramLink: instagramLink,
            facebookLink: facebookLink,
            description: description,
        },{
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/architects");
        });
    } else {
        Architect.update({
            image: image,
            name: name,
            slug: slugify(name),
            role: role,
            whatsappLink: whatsappLink,
            instagramLink: instagramLink,
            facebookLink: facebookLink,
            description: description,
        },{
            where: {
                id: id
            }
        }).then(() => {
            fs.unlink(`./public/uploads/${actualImage}`, (err) => {
                if(err) {
                    console.log(err);
                } 
            });
        }).then(() => {
            res.redirect("/admin/architects");
        });
    }
});

module.exports = router;