const multer = require("multer");

const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/uploads");
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + "_" + file.originalname);
        }
});

const uploadImage = multer({
    storage: storage,
    //limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('São permitidas apenas imagens .png, .jpg e .jpeg!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
});

module.exports = uploadImage;