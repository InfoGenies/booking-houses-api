
// here we try to create ours router 
const express = require('express')
const multer =  require('multer')

const HouseController = require('../controller/house_controller')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()


const path = require('path')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // we use this line path.join to specify the real path automaticly
      
        let tempraryImageDirectory;

if (process.env.DEV && process.env.DEV === 'Yes') {
    tempraryImageDirectory = path.join(__dirname, `../../tmp/`);
  } else {
    tempraryImageDirectory = '/tmp/';
  }
  
        cb(null, tempraryImageDirectory);
    },
    filename: function(req, file, cb) {
        const date = new Date().toISOString().replace(/:/g, '-');

        cb(null, date + '-' + file.originalname);
    }
});
const filterFile = (req, file, cb)=>{
    if(file.mimetype === "image/png" || file.mimetype === "image/jpeg" ){
        // we give the permesion to store file(image that is png)
        cb(null,true)  
    }else{
        cb(null,false); 
    }
}

const upload =  multer({storage : storage , limits: {
    // we make this to prevent store a big size file(image)
    fileSize: 1024*1024*5 // 1 MB in bytes
  },
  fileFilter : filterFile
})




router.post('/create_house',checkAuth,HouseController.create_house)

router.post('/create_municipality',HouseController.create_municipality)

router.post('/create_city',upload.single('picture'),HouseController.create_city)

router.post('/create_picture',upload.single('picture'),HouseController.create_picture)

router.get('/city',HouseController.get_city)

router.delete('/deleteAllCity', HouseController.delete_all_city)

router.get('/municipality',HouseController.get_municipality)


/* router.get('/',HouseController.get_house)
 
router.get('/:houseId',HouseController.get_house_byID)


router.patch('/:houseId',HouseController.update_house)

router.delete('/:houseId',HouseController.delete_house_byID)

router.delete('/', HouseController.deleteAll); */

module.exports = router