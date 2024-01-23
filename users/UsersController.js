const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");
const adminAuth = require("../middlewares/adminAuth");

/* 
 * GET routes 
 */

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users/index", {users: users});
    });
});

router.get("/admin/users/new", adminAuth, (req, res) => {
    res.render("admin/users/new");
});

router.get("/admin/users/edit/:id", adminAuth, (req, res) => {
    let id = req.params.id;

    if(id != undefined) {
        User.findByPk(id).then(user => {
            res.render("admin/users/edit", {user: user});
        });
    } else {
        res.redirect("/");
    }
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/login");
});

/* 
 * POST routes 
 */

/* CREATE */

router.post("/users/create", adminAuth, (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    
    User.findOne({where: {email: email}}).then(user => {
        if(user == undefined) {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(password, salt);
            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/admin/users");
            }).catch((err) => {
                res.redirect("/");
            });
        } else {
            res.redirect("/");
        }
    });
    // res.json({email, password}); // para testar se os dados estão sendo coletados
});

/* DELETE */

router.post("/users/delete", adminAuth, (req, res) => {
    let id = req.body.id;

    if(id != undefined) {
        User.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/users");
        });
    } else {
        res.redirect("/")
    }
});

/* UPDATE */

router.post("/users/update", adminAuth, (req, res) => {
    let id = req.body.id;
    let password = req.body.password;
    
    User.findByPk(id).then(() => {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);
        User.update({
            password: hash
        },{
            where: {
                id: id
            }
        }).then(() => {
            res.redirect("/admin/users");
        }).catch((err) => {
            res.redirect("/");
        });
    });
});

/* AUTHENTICATE */

router.post("/authenticate", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({where: {email: email}}).then(user => {
        if(user != undefined) { // se existe um usuário com este e-mail
            let correct = bcrypt.compareSync(password, user.password);
            if(correct) {
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                // res.json(req.session.user); // testar se a sessão iniciou
                res.redirect("/admin/projects");
            } else {
                res.redirect("login");
            }
        } else {
            res.redirect("/login");
        }
    });
});

module.exports = router;