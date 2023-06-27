
// here we try to create ours router 
const express = require('express')
const multer =  require('multer')

const HouseController = require('../controller/house_controller')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()


const path = require('path')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadDir = path.join(__dirname, '../../', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  
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

// router.put('/update_house/:houseId',upload.single('picture'),checkAuth,HouseController.update_house)

router.delete('/update_house/:houseId',checkAuth,HouseController.delete_house)

router.get('/update_house/:houseId',checkAuth,HouseController.get_house)


router.post('/create_offer',HouseController.create_offer)

router.get('/fetch_offers', HouseController.get_offers);


router.post('/create_municipality',HouseController.create_municipality)

router.post('/create_city',upload.single('picture'),HouseController.create_city)

router.post('/create_picture',upload.single('picture'),HouseController.create_picture)

router.get('/city',HouseController.get_city)

router.get('/fetch_house',HouseController.get_houses)


router.delete('/deleteAllCity', HouseController.delete_all_city)

router.get('/municipality',HouseController.get_municipality)

router.get('/picutre',HouseController.get_picture)

router.delete('/picture/:pictureId',HouseController.delete_picture)


router.get('/fetch_house/city/:cityId', HouseController.getHousesByCity);


/* router.get('/',HouseController.get_house)
 
router.get('/:houseId',HouseController.get_house_byID)


router.patch('/:houseId',HouseController.update_house)

router.delete('/:houseId',HouseController.delete_house_byID)

router.delete('/', HouseController.deleteAll); */

module.exports = router