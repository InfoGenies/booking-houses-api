const mongoose = require('mongoose')
const path = require('path')


const House = require('../model/houseModel')
const Municipality = require('../model/municipalityModel')
const Picture = require('../model/pictureModel')
const Offer = require('../model/offerModel')


const City = require('../model/cityModel')
const baseUrl = "https://house-booking-api.fly.dev"; 




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
            data: {
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

exports.create_offer = async (req, res) => {
  
    const { houseId, userId, status, pricePerDay, rated, startDate, endDate } = req.body;

    // Create a new offer instance
    const offer = new Offer({
      house: houseId,
      user: userId,
      status: status,
      price_per_day: pricePerDay,
      rated: rated,
      start_date: startDate,
      end_date: endDate
    });

    // Save the offer to the database
    await offer.save()
    .then(result => {
      console.log(result);
      res.status(201).json({ message: 'Offer created successfully', data : result  });
}
).catch(error => {
    console.error('Error creating offer:', error);
    res.status(500).json({ message: 'An error occurred while creating the offer' });
  }
  )
}

exports.get_house = (req, res, next) => {

  const userId = req.params.houseId; // Get the user ID from the request parameters

  House.findById(userId)
      .select('houseType title description rooms bathrooms kitchens bedrooms locationLatitude locationLongitude isAvailable stars numReviews createdAt owner municipality pictures')
.exec()
.then(doc => {
  console.log(doc)
  res.status(200).json({
    data: doc
  })
 
})
.catch(err =>{
  console.log(err)
  res.status(500).json({
      error: err
  })
})


}

exports.delete_house = (req, res, next) => {
  const id = req.params.houseId

  House.findByIdAndDelete(id)
  .exec()
  .then(result =>{
      res.status(200).json({
        data: 'house Deleted'
      })
  })
  .catch(err =>{
      res.status(200).json({error: err})
  })

}

exports.update_house = (req, res, next) => {
  const userId = req.params.userId; // Get the user ID from the request parameters

  // Check if the request contains a file upload
  if (req.file) {
    // If a file is uploaded, include the picture field in the update operations
    req.body.picture = req.file.path;
  }

  // Create an object with the updated user information
  const updateOps = {};

  for (const [key, value] of Object.entries(req.body)) {
    if (value !== null && value !== undefined) {
      updateOps[key] = value;
    }
  }

  // Update the user document by ID
  House.findByIdAndUpdate(userId, { $set: updateOps }, { new: true })
    .exec()
    .then(result => {
      if (!result) {
        return res.status(404).json({ message: 'House not found' , isUpdate: false });
      }

      res.status(200).json({ message: 'User updated successfully', user: result , isUpdate: true });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

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

exports.get_houses = (req, res, next) => {
    
  House.find()
      .select('houseType title description rooms bathrooms kitchens bedrooms locationLatitude locationLongitude isAvailable stars numReviews createdAt owner municipality pictures')
.exec()
.then(doc => {
  console.log(doc)
  const response = {
      count: doc.length,
      data:doc.map(doc=>{
          return {
              _id:doc._id,
              houseType: doc.houseType,
              title : doc.title ,
              description : doc.description,
              rooms : doc.rooms ,
              bathrooms: doc.bathrooms ,
              kitchens : doc.kitchens,
              bedrooms: doc.bedrooms ,
              locationLatitude : doc.locationLatitude,
              locationLongitude: doc.locationLongitude ,
              isAvailable : doc.isAvailable ,
              stars : doc.stars ,
              numReviews : doc.numReviews ,
              createdAt : doc.createdAt ,
              owner: doc.owner ,
              municipality : doc.municipality ,
              pictures : doc.pictures,
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

exports.get_offers = (req, res, next) => {
    
  Offer.find()
.select('status price_per_day rated start_date end_date created_at')
.exec()
.then(doc => {
  console.log(doc)
  const response = {
      count: doc.length,
      offers:doc.map(doc=>{
          return {
            id:doc._id,
            status: doc.status,
            price_per_day : doc.price_per_day,
            rated : doc.rated ,
            start_date : doc.start_date ,
            end_date : doc.end_date ,
            created_at : doc.created_at,
              request: {
                  Type:'GET',
                  url: `${baseUrl}/offers/${doc._id}`
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
      municipality:doc.map(doc=>{
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

// Get houses by city ID
exports.getHousesByCity = async (req, res) => {
  try {
    const { cityId } = req.params;

    // Find the municipality with the specified city ID
    const municipality = await Municipality.findOne({ city: cityId });

    if (!municipality) {
      return res.status(404).json({ error: 'House not found' });
    }

    // Find houses with the matching municipality ID
    const houses = await House.find({ municipality: municipality._id });

    res.json({
      data : houses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.delete_picture =async (req, res, next) =>{
  
  const pictureId = req.params.pictureId; // Assuming the picture ID is passed as a route parameter

   await Picture.findByIdAndRemove(pictureId)
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'picture deleted',
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