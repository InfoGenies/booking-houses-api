const mongoose = require('mongoose')
const path = require('path')


const House = require('../model/houseModel')
const Municipality = require('../model/municipalityModel')
const Picture = require('../model/pictureModel')

const City = require('../model/cityModel')
const baseUrl = "https://lazy-cyan-skunk-wig.cyclic.app"; 




exports.create_house = (req, res, next) => {

    const house = new House({
        _id: new mongoose.Types.ObjectId(),
        houseType: req.body.houseType,
        title: req.body.title,
        description: req.body.description,
        rooms : req.body.rooms,
        bathrooms: req.body.bathrooms,
        kitchens: req.body.kitchens,
        bedrooms: req.body.bedrooms,
        locationLatitude:req.body.locationLatitude,
        locationLongitude: req.body.locationLongitude,
        isAvailable: req.body.isAvailable,
        stars : req.body.stars,
        numReviews: req.body.numReviews,
        createdAt: req.body.createdAt,
        owner : req.body.userId,
        municipality: req.body.municipalityId,
        pictures: req.body.picturesId 
      });
      house
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Created house successfully",
            createdHouse: {
                name: result.title,
                price: result.description,
                id: result._id,
                request: {
                    type: 'GET',
                    url: `${baseUrl}/houses/${result._id}`
                }
            }
          });

}
)
   
}

exports.create_municipality = (req, res, next) => {

    const municipality = new Municipality({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        city: req.body.cityId,
       
      });

      municipality
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Created Municipality successfully",
            createdMunicipality: result
          });

}
)
   
}

exports.create_city = (req, res, next) => {

    const city = new City({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        picture: req.file.path
      });

      city
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Created City successfully",
            createdCity: result
          });

}
)
   
}

exports.create_picture = (req, res, next) => {

  const picture = new Picture({
      _id: new mongoose.Types.ObjectId(),
      picture: req.file.path,
      isUrl: req.body.isUrl
    });

    picture
      .save()
      .then(result => {
        console.log(result);
        res.status(201).json({
          message: "Created Picture successfully",
          createdPicture: result
        });

}
)
 
}


exports.get_city = (req, res, next) => {
    
    City.find()
.select('name picture')
.exec()
.then(doc => {
    console.log(doc)
    const response = {
        count: doc.length,
        cities:doc.map(doc=>{
            return {
                name: doc.name,
                picture: `${baseUrl}/tmp/${path.basename(doc.picture)}`,
                id:doc._id,
                request: {
                    Type:'GET',
                    url: `${baseUrl}/houses/city/${doc._id}`
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
exports.delete_all_city =(req, res, next) => {
  City.deleteMany({})
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'All City deleted',
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

exports.get_municipality = (req, res, next) => {
    
  Municipality.find()
.select('name city')
.exec()
.then(doc => {
  console.log(doc)
  const response = {
      count: doc.length,
      cities:doc.map(doc=>{
          return {
              name: doc.name,
              city: doc.city,
              id:doc._id,
              request: {
                  Type:'GET',
                  url: `${baseUrl}/houses/city/${doc._id}`
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
exports.get_picture = (req, res, next) => {
    
  Picture.find()
.select('picture isUrl')
.exec()
.then(doc => {
  console.log(doc)
  const response = {
      count: doc.length,
      cities:doc.map(doc=>{
          return {
              isUrl: doc.isUrl,
              picture: `${baseUrl}/tmp/${path.basename(doc.picture)}`,
              id:doc._id,
              request: {
                  Type:'GET',
                  url: `${baseUrl}/houses/city/${doc._id}`
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

/*
exports.get_product_byID =  (req, res, next) => {
    const id = req.params.productId
    Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc=>{
        console.log(doc)
        // check if the product is not null 
        if(doc)
        {res.status(200).json(doc)
        }else{

            res.status(404).json({
                message:"Invalide ID Of This Product"
            })
        }
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json({error: err})
    })

    
}
exports.update_product =  async (req, res, next) => {


    try{
        const productId = req.params.productId
    const updates = {}
     // add only the properties to update to the `updates` object
     if (req.body.name) updates.name = req.body.name;
     if (req.body.price) updates.price = req.body.price;

      // find the product by ID
    const product = await Product.findById(productId);

     // update the product with the new information
     product.set(updates);

      // save the updated product to the database
    const updatedProduct = await product.save();
        // send the updated product as the response
    res.status(200).json(updatedProduct)

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Failed to update product' });
    }

}
exports.delete_product_byID =  (req, res, next) => {
    const id = req.params.productId

    Product.findByIdAndDelete(id)
    .exec()
    .then(result =>{
        res.status(200).json(result)
    })
    .catch(err =>{
        res.status(200).json({error: err})
    })

}
exports.deleteAll =(req, res, next) => {
    Product.deleteMany({})
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'All products deleted',
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
*/

  /*
  exports.create_product = (req, res, next) => {

    const product = new Product({
        id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
      });
      product
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result.id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + result.id
                }
            }
          });

}
)
   
}

   */