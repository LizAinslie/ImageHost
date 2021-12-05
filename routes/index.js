const express = require('express');
const router = express.Router();
const { generate: rng } = require('randomstring');
const mime = require('mime-types');
const path = require('path');
const fs = require('fs');

const uploadsFolder = path.join(__dirname, '..', 'uploads');

const credentials = (process.env.CDN_CREDS || '')
    .split('|')
    .filter(x => x.trim() !== '')
    .map(x => {
      const [folder, secret] = x.split(':');
      return { folder, secret };
    })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/upload', (req, res) => {
  const cred = credentials.filter(x => x.secret === req.header('x-lizzy-auth'))[0];
  if (!cred) return res.status(403).json({ error: 'forbidden' });
  
  let file = req.files?.file;
  if (Array.isArray(file)) file = file[0];
  if (!file) return res.status(400).json({ error: 'no file attached' });

  const ext = mime.extension(file.mimetype);
  if (!ext) return res.json({ error: 'invalid mimetype' });

  const pathName = `${cred.folder}/${rng(7)}.${ext}`;
  const fullPath = `i/${pathName}`;

  try {
    fs.mkdirSync(path.join(uploadsFolder, cred.folder));
  } catch (_) {}

  file.mv(path.join(uploadsFolder, pathName)).then(() => {
    res.json({ message: 'uploaded', file: pathName });
  });
})

module.exports = router;
