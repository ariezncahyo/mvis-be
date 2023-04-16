const response = require('../../utils/response');
const helper = require("../../utils/helper");
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const multer = require('multer');
const dir = path.join(__dirname, "../../public/file")

const storage = () =>
    multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

let uploadImage = multer({
    storage: storage(),
    fileFilter: function (req, file, cb) {
        let ext = path.extname(file.originalname);
        if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
            return cb(new Error("Only image are allowed"));
        }

        cb(null, true);
    },
    limits: {
        fileSize: 1000000,
    },
}).single("image")

// API untuk upload file
module.exports.uploadFile = async (req, res) => {
    try {
        uploadImage(req, res, async (err) => {
            let image = null;
            let mimetype = req?.file?.mimetype;

            try {
                if (err) throw err;
                if (req.file) {
                    const rename = helper.slugify('image') + '-' + new Date().getTime() + path.extname(req.file.filename)
                    await sharp(dir + '/' + req.file.filename)
                        .resize(300, 300)
                        .jpeg({ quality: 100 })
                        .toFile(dir + '/300-' + rename
                        );
                    fs.renameSync(dir + '/' + req.file.filename, dir + '/' + rename)
                    image = rename;
                } else {
                    throw new Error('File required');
                }
    
                const result = {
                    url: `http://localhost:9000/file/${image}`,
                    filename: image,
                    mimetype: mimetype
                }
                return response.success('Successfully upload file', res,result, 201);
            } catch(err) {
                console.log(err);
                if (image) {
                    if (fs.existsSync(dir + '/' + image)) fs.unlinkSync(dir + '/' + image)
                    if (fs.existsSync(dir + '/300-' + image)) fs.unlinkSync(dir + '/300-' + image)
                }
                response.error(err.message || 'Failed upload file', res, err.code || 500);
            }
        });
    } catch(err) {
        console.log(err);
        response.error(err.message || 'Failed upload file', res, err.code || 500);
    }
}

