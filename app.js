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
            blob.arrayBuffer().then((arrayBuffer) => {
                const buffer = Buffer.from(arrayBuffer);
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Disposition': 'attachment; filename=' + req.file.originalname,
                    'Content-Length': buffer.length
                });
                res.end(buffer);
                fs.unlinkSync(req.file.path);
                // console.log(`Temporary file ${req.file.path} deleted.`);
            });
        })
        .catch((error) => {
            console.error('Error removing background:', error);
            res.status(500).send('Error processing image');
            fs.unlinkSync(req.file.path);
            // console.log(`Temporary file ${req.file.path} deleted.`);
        });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
