const mongoose = require('mongoose')
const User = require('../model/userModel')
const bcypt = require('bcrypt')
const jwt = require('jsonwebtoken');


exports.signUp =  (req, res) => {

   User.find({email:req.body.email}).then(users=>{
    if(users.length>=1){
     return res.status(409).json({
        message: 'Mail exist'
      })
    }else{
      bcypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            res.status(500).json({
                error : err
            })
        }else{
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
                picture: req.file.path,
                username: req.body.username,
                phone: req.body.phone,
                language: req.body.language,
                aboutMe: req.body.aboutMe,
                userType: req.body.userType,
                dateJoined: req.body.dateJoined,
            })
            user.save()
    .then(result =>{
      console.log(result)
        res.status(201).json({ message: 'User created successfully' });
    })
    .catch(err =>{
        res.status(500).json({ error: err});
    }
    )
            
        }
        
              })  
    }

   })
   .catch(err =>{

   }
    )



  
     
  }
exports.get_users = (req, res, next) => {
  User.find()
  .select('_id email password picture username phone language aboutMe userType  dateJoined')
  .exec()
  .then(doc => {
      console.log(doc)
      const response = {
          count: doc.length,
          users:doc.map(doc=>{
              return {
                  password: doc.password,
                  picture : doc.picture ,
                  email: doc.email,
                  _id: doc._id,
                  username : doc.username,
                  phone : doc.phone,
                  language : doc.language,
                  aboutMe : doc.aboutMe ,
                  userType : doc.userType,
                  dateJoined : doc.dateJoined,
                  request: {
                      Type:'GET',
                      url: 'http://127.0.0.1:3000/login/'+doc._id
                  }
              }
          })
      }
      res.status(200).json(response)
  })
  .catch(err =>{
      console.log(err)
      res.status(500).json({
          error: err
      })
  })
    
  
  }
exports.signIn = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id },process.env.JWT_KEY, { expiresIn: '1h' });
    res.status(200).json({
       message : 'Authenification Succfully',
      token : token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}  

exports.delete_user_byID = (req, res, next) => {
  const id = req.params.userId

  User.findByIdAndDelete(id)
  .exec()
  .then(result =>{
      res.status(200).json({
        message: 'User Deleted'
      })
  })
  .catch(err =>{
      res.status(200).json({error: err})
  })

}
exports.deleteAll = (req, res, next) => {
  User.deleteMany({})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'All user deleted',
        result: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
}
exports.fetch_byID = (req, res, next) => {
  const id = req.params.userId
  console.log('the user id is '+id)
  User.findById(id)
  .select('_id email password username phone language aboutMe userType  dateJoined')
  .exec()
  .then(doc=>{
      console.log(doc)
      // check if the user is not null 
      if(doc)
      {res.status(200).json(doc)
      }else{

          res.status(404).json({
              message:"Invalide ID Of This User"
          })
      }
  })
  .catch(err =>{
      console.log(err)
      res.status(500).json({error: err})
  })

}