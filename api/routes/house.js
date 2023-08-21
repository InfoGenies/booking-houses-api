
// here we try to create ours router 
const express = require('express')
const multer =  require('multer')

const HouseController = require('../controller/house_controller')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()

const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
  
  const upload = multer({ storage });


/* const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      const uploadDir = path.join(__dirname, '../../', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  
    },
    filename: function(req, file, cb) {
        const date = new Date().toISOString();

       if (!file) {
            cb(new Error('File is not present in the request object'));
        } else if (!file.mimetype.match(/^image\/(png|jpeg)$/)) {
            cb(new Error('File is not an image file'));
        } else {
            cb(null, date + '-' + file.originalname);
        }
    }
    }
);
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

 */


router.post('/create_house',upload.array('picture', 10),HouseController.create_house)

 router.patch('/update_house/:houseId',upload.array('picture', 10),HouseController.update_house)

router.delete('/update_house/:houseId',checkAuth,HouseController.delete_house)

router.get('/house/:houseId',checkAuth,HouseController.get_house)

router.get('/fetch_house/user/:userId',checkAuth,HouseController.get_house_by_user_id)



router.post('/create_offer',upload.none(),HouseController.create_offer)

router.post('/create_rating',upload.none(),HouseController.create_rating)


router.post('/create_favorite',HouseController.create_favorite)

router.get('/fetch_offers', HouseController.get_offers);

router.get('/fetch_offers/house/:houseId', HouseController.getOffersByHouse);


router.get('/fetch_favorites', HouseController.get_favorites);

router.get('/fetch_rating/:houseId', HouseController.get_rating);

router.get('/fetch_favorites/:userId', HouseController.get_favorite);

router.delete('/favorites/:favId',HouseController.delete_favorites)





router.get('/offer/:offerId',HouseController.get_offer)


router.delete('/offers/:offerId',HouseController.delete_offer)

// By default, express does not parse form-data automatically
// To handle form-data , you'll need to add additional middleware(Multer) to parse the form-data

router.patch('/offers/:offerId',upload.none(),HouseController.update_offer)

router.patch('/municipality/:municipalityId',upload.none(),HouseController.update_municipality)

router.patch('/offers/status/:offerId',HouseController.update_offer_status)

router.post('/create_municipality',HouseController.create_municipality)

router.post('/create_city',upload.single('picture'),HouseController.create_city)

router.post('/create_picture',upload.single('picture'),HouseController.create_picture)

router.get('/city',HouseController.get_city)

router.get('/fetch_house',HouseController.get_houses)


router.delete('/deleteAllCity', HouseController.delete_all_city)

router.delete('/deleteCity/:cityId', HouseController.delete_city)


router.get('/municipality',HouseController.get_municipality)

router.get('/api/municipalities/:cityId',HouseController.get_municipality_by_city)

router.get('/picutre',HouseController.get_picture)

router.delete('/picture/:pictureId',HouseController.delete_picture)

router.delete('/municipality/:municipalityId',HouseController.delete_municipality)



router.get('/fetch_house/city/:cityId', HouseController.getHousesByCity);


/* router.get('/',HouseController.get_house)
 
router.get('/:houseId',HouseController.get_house_byID)


router.patch('/:houseId',HouseController.update_house)

router.delete('/:houseId',HouseController.delete_house_byID)

router.delete('/', HouseController.deleteAll); */

module.exports = router