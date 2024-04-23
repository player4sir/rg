// server.js
const express = require('express');
const multer = require('multer');
const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });

const processedDir = path.join(__dirname, 'processed');

if (!fs.existsSync(processedDir)){
    fs.mkdirSync(processedDir, { recursive: true });
}

app.use(express.static('public'));

app.post('/remove-background', upload.single('image'), (req, res) => {
  const imagePath = req.file.path;
  removeBackground(imagePath)
    .then((blob) => {
      // 将 Blob 转换为 Buffer
      blob.arrayBuffer().then((arrayBuffer) => {
        const buffer = Buffer.from(arrayBuffer);
        const outputPath = `processed/${req.file.originalname}`;
        // 使用 Buffer 写入文件
        fs.writeFileSync(outputPath, buffer);
        res.sendFile(outputPath, { root: __dirname });
      });
    })
    .catch((error) => {
      console.error('Error removing background:', error);
      res.status(500).send('Error processing image');
    });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
