const express = require('express');
const multer = require('multer');
const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const app = express();
const os = require('os');
const upload = multer({ dest: os.tmpdir() });

const PORT = process.env.PORT || 3000;

app.post('/rg', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('没有文件上传');
    }
    const imagePath = `file://${req.file.path}`;
    removeBackground(imagePath)
        .then((blob) => {
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Disposition': 'attachment; filename=' + req.file.originalname
            });
            blob.stream().pipe(res);
        })
        .catch((error) => {
            console.error('Error removing background:', error);
            res.status(500).send('Error processing image');
        })
        .finally(() => {
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error(`Temporary file ${req.file.path} deletion failed.`);
                }
            });
        });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
