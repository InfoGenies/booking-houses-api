const express = require('express')
const UserController  = require('../controller/user_controller')
// this function *Router* give us the ability to handele different Routing with endpoint 
const router = express.Router()
const multer =  require('multer')
const checkAuth = require('../middleware/check-auth')



const fs = require('fs')
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

// create the registratin route 
router.post('/signUp',UserController.signUp)

router.post('/signIn', UserController.signIn)
// deleting the user by id 
router.delete('/:userId',UserController.delete_user_byID)

// DELETE route to delete all user
router.delete('/', UserController.deleteAll);

router.get('/', UserController.get_users)
  
  // fetching by id 
router.get('/:userId',checkAuth,UserController.fetch_byID)

router.put('/:userId',upload.single('picture'), UserController.updateUser);


// this line means that if u want to use this function(router) in other file(class) u should export it  
module.exports = router