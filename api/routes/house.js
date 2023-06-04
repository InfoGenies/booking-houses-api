
// here we try to create ours router 
const express = require('express')
const HouseController = require('../controller/house_controller')
const checkAuth = require('../middleware/check-auth')
const router = express.Router()




router.post('/create_house',checkAuth,HouseController.create_house)

router.post('/create_municipality',HouseController.create_municipality)

router.post('/create_city',HouseController.create_city)
router.get('/city',HouseController.get_city)


/* router.get('/',HouseController.get_house)
 
router.get('/:houseId',HouseController.get_house_byID)


router.patch('/:houseId',HouseController.update_house)

router.delete('/:houseId',HouseController.delete_house_byID)

router.delete('/', HouseController.deleteAll); */

module.exports = router