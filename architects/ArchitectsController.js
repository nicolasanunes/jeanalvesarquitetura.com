const express = require("express");
const router = express.Router();
const Architect = require("./Architect");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");
const uploadImage = require("../middlewares/uploadImage");

router.get("/admin/architects", adminAuth, (req, res) => {
    Architect.findAll().then(architects => {
        res.render("admin/architects/index", {architects: architects});
    });
});

router.get("/admin/architects/new", adminAuth, (req, res) => {
        res.render("admin/architects/new");
});

router.post("/architects/create", uploadImage.single("image"), adminAuth, (req, res) => {
    let name = req.body.name; // nome do campo que a informação será coletada no arquivo "new.ejs"
    let image = req.file.filename;
    let description = req.body.description;
    let address = req.body.address;
    let phoneNumber = req.body.phoneNumber;
    let instagramLink = req.body.instagramLink;
    let facebookLink = req.body.facebookLink;
    let twitterLink = req.body.twitterLink;
    let whatsappLink = req.body.whatsappLink;

    console.log(address);
    console.log(name);
    console.log(image);

    Architect.create({
        name: name,
        slug: slugify(name),
        image: image,
        description: description,
        address: address,
        phoneNumber: phoneNumber,
        instagramLink: instagramLink,
        facebookLink: facebookLink,
        twitterLink: twitterLink,
        whatsappLink: whatsappLink
    }).then(() => {
        res.redirect("/admin/projects");
    });
});

module.exports = router;