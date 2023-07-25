const mongoose = require('mongoose')
const path = require('path')


const House = require('../model/houseModel')
const Municipality = require('../model/municipalityModel')
const Picture = require('../model/pictureModel')
const Offer = require('../model/offerModel')
const Favorite = require('../model/favoriteModel')
const Rating = require('../model/ratingModel')




const City = require('../model/cityModel')
const favorite = require('../model/favoriteModel')
const { error } = require('console')
const baseUrl = "https://house-booking-api.fly.dev"; 




exports.create_house = (req, res, next) => {
  const {
    houseType,
    title,
    description,
    rooms,
    bathrooms,
    kitchens,
    bedrooms,
    locationLatitude,
    locationLongitude,
    isAvailable,
    stars,
    numReviews,
    createdAt,
    userId,
    municipalityId,
    picturesId
  } = req.body;

  const house = new House({
    _id: new mongoose.Types.ObjectId(),
    houseType: houseType,
    title: title,
    description: description,
    rooms: rooms,
    bathrooms: bathrooms,
    kitchens: kitchens,
    bedrooms: bedrooms,
    locationLatitude: locationLatitude,
    locationLongitude: locationLongitude,
    isAvailable: isAvailable,
    stars: stars,
    numReviews: numReviews,
    createdAt: createdAt,
    owner: userId,
    municipality: municipalityId,
    pictures: picturesId.map(pictureId => mongoose.Types.ObjectId.createFromHexString(pictureId))
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
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({
        error: error.message
      });
    });
}
exports.create_offer = async (req, res) => {
  
    const { houseId, userId, status, pricePerDay, rated, startDate, endDate } = req.body;

    // Create a new offer instance
    const offer = new Offer({
      _id: new mongoose.Types.ObjectId(),
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
    res.status(500).json({ message: 'An error occurred while creating the offer }' });
  }
  )
}


exports.create_rating = async (req, res) => {
  
  const { offerId, stars,comment , createdat } = req.body;

  // Create a new offer instance
  const rating = new Rating({
    _id: new mongoose.Types.ObjectId(),
    offer: offerId,
    stars: stars,
    comment: comment,
    created_at: createdat
  });

  // Save the offer to the database
  await rating.save()
  .then(result => {
    console.log(result);
    res.status(201).json({ message: 'Rating created successfully', data : result  });
}
).catch(error => {
  console.error('Error creating rating:', error);
  res.status(500).json({ message: 'An error occurred while creating the rating }' });
}
)
}



exports.create_favorite = async (req, res) => {
  
  const { offerId, userId, createdAt } = req.body;

  // Create a new offer instance
  const favorite = new Favorite({
    _id: new mongoose.Types.ObjectId(),
    offer: offerId,
    user: userId,
    created_at: createdAt
  });

  // Save the offer to the database
  await favorite.save()
  .then(result => {
    console.log(result);
    res.status(201).json({ message: 'favorite created successfully', data : result  });
}
).catch(error => {
  console.error('Error creating favorite:', error);
  res.status(500).json({ message: 'An error occurred while creating the favorite }' });
}
)
}

exports.delete_offer = (req, res, next) => {
  const id = req.params.offerId

  Offer.findByIdAndDelete(id)
  .exec()
  .then(result =>{
      res.status(200).json({
        data: 'offer Deleted'
      })
  })
  .catch(err =>{
      res.status(200).json({error: err})
  })

}


exports.delete_favorites = (req, res, next) => {
  const id = req.params.favId

  Favorite.findByIdAndDelete(id)
  .exec()
  .then(result =>{
      res.status(200).json({
        data: 'favorite Deleted'
      })
  })
  .catch(err =>{
      res.status(200).json({error: err})
  })

}


// Update offer
exports.update_offer = async (req, res) => {
  const id = req.params.offerId;

  const updateOps = {};

  for (const [key, value] of Object.entries(req.body)) {
    if (value !== null && value !== undefined) {
      updateOps[key] = value;
    }
  }

  try {
    const result = await Offer.findByIdAndUpdate(id, { $set: updateOps }, { new: true }).exec();

    if (!result) {
      return res.status(404).json({ error: 'Offer not found', isUpdate: false });
    }
    console.log(updateOps)
    res.status(200).json({ message: 'Offer updated successfully', offer: result, isUpdate: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};


// Update offer
exports.update_municipality = async (req, res) => {
  const id = req.params.municipalityId;

  const updateOps = {};

  for (const [key, value] of Object.entries(req.body)) {
    if (value !== null && value !== undefined) {
      updateOps[key] = value;
    }
  }

  try {
    const result = await Municipality.findByIdAndUpdate(id, { $set: updateOps }, { new: true }).exec();

    if (!result) {
      return res.status(404).json({ error: 'Municipality not found', isUpdate: false });
    }
    console.log(updateOps)
    res.status(200).json({ message: 'Municipality updated successfully', offer: result, isUpdate: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};


exports.update_offer_status = async (req, res) => {
  const id  = req.params.offerId;
  const  status  = req.body.status;

  console.log(id) ; 

  console.log(status) ; 

  try {
    const result = await Offer.findByIdAndUpdate(id, {status}, { new: true }).exec();
    console.log(result) ; 

    if (!result) {
      return res.status(404).json({ error: 'Offer not found', isUpdate: false });
    }
    
    res.status(200).json({ message: 'Offer status updated successfully', offer: result, isUpdate: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};


exports.get_house = (req, res, next) => {

   // Get the user ID from the request parameters
  const houseId = req.params.houseId;

  House.findById(houseId)
      .select('houseType title description rooms bathrooms kitchens bedrooms locationLatitude locationLongitude isAvailable stars numReviews createdAt owner municipality pictures')
      .populate('owner', '_id email password picture username phone language aboutMe userType dateJoined')

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
  // Get the user ID from the request parameters
  const houseId = req.params.houseId; 
  

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
  House.findByIdAndUpdate(houseId, { $set: updateOps }, { new: true })
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
    isUrl: req.body.isUrl,
  })

  picture
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created Picture successfully",
        createdPicture: result,
      })
    })
    .catch((error) => {
      console.error(error)
      res.status(500).json({ error: "Failed to create picture" })
    })
}

exports.get_houses = (req, res, next) => {
    
  House.find()
      .select('houseType title description rooms bathrooms kitchens bedrooms locationLatitude locationLongitude isAvailable stars numReviews createdAt owner municipality pictures')
      .populate('owner', '_id email password picture username phone language aboutMe userType dateJoined')
      .populate('municipality','_id name city')
      .populate('municipality.city','name picture')
      .populate('pictures','picture isUrl')
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

/* exports.get_offers = (req, res, next) => {
    
  Offer.find()
.select('house user status price_per_day rated start_date end_date created_at')
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
            house : doc.house,
            user : doc.user,
              request: {
                  Type:'GET',
                  url: `${baseUrl}/houses/offer/${doc._id}`
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
 */


exports.get_offers = (req, res, next) => {
  Offer.find()
    .select('house user status price_per_day rated start_date end_date created_at')
    .populate({
      path: 'house',
      select: '_id houseType title description rooms bathrooms kitchens bedrooms locationLatitude locationLongitude isAvailable stars numReviews createdAt',
      populate: [
        {
          path: 'owner',
          select: '_id email password picture username phone language aboutMe userType dateJoined',
        },
        {
          path: 'municipality',
          select: '_id name city',
          populate: {
            path: 'city',
            select: '_id name picture',
          },
        },
        {
          path: 'pictures',
          select: '_id picture isUrl',
        },
      ]
    })
    .populate({
      path: 'user',
      select: '_id email password picture username phone language aboutMe userType dateJoined'
    })
    .exec()
    .then((doc) => {
      console.log(doc);
      const response = {
        count: doc.length,
        offers: doc.map((doc) => {
          return {
            _id: doc._id,
            status: doc.status,
            price_per_day: doc.price_per_day,
            rated: doc.rated,
            start_date: doc.start_date,
            end_date: doc.end_date,
            created_at: doc.created_at,
            house: doc.house,
            user: doc.user,
            request: {
              Type: 'GET',
              url: `${baseUrl}/houses/offer/${doc._id}`
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.get_favorites = (req, res, next) => {
  Favorite.find()
    .select('_id offer user created_at')
    .populate({
      path: 'offer',
      select: 'status price_per_day rated start_date end_date created_at',
      populate: 
        {
          path: 'house',
          select: '_id email password picture username phone language aboutMe userType dateJoined municipality', // Include 'municipality' in the 'house' population
          populate:[ 
            {
            path: 'municipality',
            select: '_id name city',
            populate: {
              path: 'city',
              select: '_id name picture',
            },
          },
          {
          path: 'pictures',
          select: '_id picture isUrl',
        },
        ],
        },
        
      
    })
    .populate({
      path: 'user',
      select: '_id email password picture username phone language aboutMe userType dateJoined'
    })
    .exec()
    .then((doc) => {
      console.log(doc); // Check the output in the console to see if the data is being populated correctly.
      // Rest of the code...
      
      const response = {
        count: doc.length,
        favorite: doc.map((doc) => {
          return {
            id: doc._id,
            offer: doc.offer,
            user: doc.user,
            created_at: doc.created_at,
            request: {
              Type: 'GET',
              url: `${baseUrl}/houses/favorite/${doc._id}`
            }
          };
        })
      }
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};


exports.get_favorite = async (req, res, next) =>{
  const userId = req.params.userId;

  
   await Favorite.find({ user: userId })
   .select('_id offer user created_at')
   .populate({
     path: 'offer',
     select: 'status price_per_day rated start_date end_date created_at',
     populate: 
       [
        {
          path: 'house',
          select: '_id houseType title description rooms bathrooms kitchens bedrooms locationLatitude locationLongitude isAvailable stars numReviews createdAt ', // Include 'municipality' in the 'house' population
          populate:[ 
            {
            path: 'municipality',
            select: '_id name city',
            populate: {
              path: 'city',
              select: '_id name picture',
            },
          },
          {
           path: 'owner',
           select: '_id email password picture username phone language aboutMe userType dateJoined',
         },
          {
          path: 'pictures',
          select: '_id picture isUrl',
        },
        ],
        },
        {
          path: 'user',
          select: '_id email password picture username phone language aboutMe userType dateJoined',
        }
       ],
       
       
     
   })
   .populate({
     path: 'user',
     select: '_id email password picture username phone language aboutMe userType dateJoined'
   })
   .exec()
   .then(doc =>{
    
    console.log(doc); // Check the output in the console to see if the data is being populated correctly.

    const response = {
      count: doc.length,
      favorite: doc.map((doc) => {
        return {
          id: doc._id,
          offer: doc.offer,
          user: doc.user,
          created_at: doc.created_at,
          request: {
            Type: 'GET',
            url: `${baseUrl}/houses/favorite/${doc._id}`
          }
        };
      })
    }
    res.status(200).json(response);
    }).catch(error =>{
      console.error('Error while getting favorites:', error.message);
      return res.status(500).json({ error: 'Internal server error' });
    })
    
  
}




exports.get_offer = (req, res, next) => {
  const offerId = req.params.offerId;  

  Offer.findById(offerId)
.select('house user status price_per_day rated start_date end_date created_at')
.exec()
.then(doc => {
  console.log(doc)
  res.status(200).json({data: doc})
})
.catch(err =>{
  console.log(err)
  res.status(500).json({
      error: err
  })
})


}

exports.get_rating = async (req, res, next) => {
  const houseId = req.params.houseId;  

    const offer = await Offer.findOne({ house: houseId }).exec();
    if (!offer) {
      console.log('No offer found for house with ID ' + houseId);
      return null;
    }

     Rating.find({offer: offer._id })
    .exec()
    .then(doc=>{
      console.log(doc)

      const response = {
        count: doc.length,
        results: doc.map((doc) => {
          return {
            id: doc._id,
            offer: doc.offer,
            stars:doc.stars,
            comment:doc.comment,
            created_at: doc.created_at,
            request: {
              Type: 'GET',
              url: `${baseUrl}/houses/favorite/${doc._id}`
            }
          };
        })
      }
      
      res.status(200).json(response)

    }).catch(err =>{
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

          const pictureUrl = doc.picture ? `${baseUrl}/app/uploads/${path.basename(doc.picture)}` : null;

            return {
                name: doc.name,
                picture: pictureUrl,
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
      pictures:doc.map(doc=>{
        const pictureUrl = doc.picture ? `${baseUrl}/uploads/${path.basename(doc.picture)}` : null;

          return {
              isUrl: doc.isUrl,
              picture: pictureUrl,
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

exports.delete_municipality =async (req, res, next) =>{
  
  // Assuming the municipality ID is passed as a route parameter
  const municipalityId = req.params.municipalityId; 

   await Municipality.findByIdAndRemove(municipalityId)
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Municipality deleted',
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

exports.delete_city =async (req, res, next) =>{
  
  // Assuming the municipality ID is passed as a route parameter
  const cityId = req.params.cityId; 

   await City.findByIdAndRemove(cityId)
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'City deleted',
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