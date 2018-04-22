import express from 'express';
import multer from 'multer';
import imager from 'multer-imager';
import ejs from 'ejs';
import path from 'path';
import bodyParser from 'body-parser';

import { serverPort, apiPrefix } from './server/etc/config.json';

import * as db from './server/utils/DataBaseUtils';

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)    
  }
})

const upload = multer({ 
  storage: storage,
  limits:{fieldSize: 1000000},
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);   
  }
}).single('myImage');

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only')
  }
}

const app = express();

app.set('view engine', 'ejs');

// Set up connection of database
db.setUpConnection();

// Using bodyParser middleware
app.use(bodyParser.json());


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res, next) => res.render('index'));

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    console.log(res, 'REEES');
    console.log(req, 'REQ`');
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('index', {
          msg: 'File Uploaded!',
          file: `./uploads/${req.file.filename}`
        });
      db.createAvatar(`${apiPrefix}${serverPort}/uploads/${req.file.filename}`, Date.now());
      }
    }
  });
});

const server = app.listen(serverPort, function() {
    console.log(`Server is up and running on port ${serverPort}`);
});


