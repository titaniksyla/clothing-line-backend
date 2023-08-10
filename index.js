//Clothing line backend 

const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
require('dotenv').config();

// app.post('/invoiceData', (req, res) => {
//   const nameData = req.body.name;
//   try{
//     fs.writeFileSync('./testfile.txt', `Dear ${nameData} you owe us $600`);
//     res.send('file created successfully!');
//   }
//   catch(error){
//     console.log(error);
//   }
// })

// app.get('/readfiletest', (req, res) => {
//   try {
//     const data = fs.readFileSync('./data.txt','utf-8');
//     res.send(data);
//   } catch (error) {
//     console.log(error);
//   }
// })

// app.get('/writefiletest', (req, res) => {
//   const fileContent = 'blablablabalbalblalblddddda';
//   try {
//     fs.writeFileSync('./testfile.txt', fileContent);
//     res.send('file created successfully!');
//   } catch (error) {
//     console.log(error);
//   }
// })

console.log(process.env.DATABASE_USERNAME);

const {Sequelize , DataTypes} = require('sequelize');
const { log } = require('console');

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql'
  }
)

const User = sequelize.define('User', {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
},{
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
})

const Product = sequelize.define('Product',{
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  collection_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  product_name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  product_description: {
      type: DataTypes.STRING,
      allowNull: false
  },
  product_image: {
      type: DataTypes.STRING,
      allowNull: false
  },
  product_color: {
      type: DataTypes.STRING,
      allowNull: false
  },
  product_size: {
      type: DataTypes.STRING,
      allowNull: false
  },
  qty_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  price: {
      type: DataTypes.FLOAT,
      allowNull: false
  },
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
}
)

const Seller = sequelize.define('Seller',{
  user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  location: {
      type: DataTypes.STRING,
      allowNull: true
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true
  },
  working_start: {
      type: DataTypes.TIME,
      allowNull: true
  },
  working_end: {
    type: DataTypes.TIME,
    allowNull: true
  },
  shipping: {
      type: DataTypes.BOOLEAN,
      allowNull: true
  }
}, {
  tableName: 'sellers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
}
)

const Brand = sequelize.define('Brand',{
  brand_name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  brand_rating: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  brand_image_url:{
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'brands',
  timestamps: false,
}
)

const Category = sequelize.define('Category',{
  category_name: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  tableName: 'categories',
  timestamps: false,
}
)

const Collection = sequelize.define('Collection',{
  collection_name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  collection_img: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'collections',
  timestamps: false,
}
)

const Cart = sequelize.define('Cart', {
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
  ,product_name:{
    type: DataTypes.STRING,
    allowNull: false
  },product_image:{
    type: DataTypes.STRING,
    allowNull: false
  },product_quantity:{
    type: DataTypes.STRING,
    allowNull: false
  },product_price:{
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'cart_products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

try{
  sequelize.authenticate();
  console.log('Connection has been estabilished successfully');
}catch(error){
  console.log('Unable to connect to the database:',error);
}

app.use(cors())
app.use(express.json())

// app.get('/', (req, res) => {
//   res.send(`<h1>Clothing line home</h1>`);
// });

// app.get('/clothes', (req, res) => {
//   res.send(clothes);
// });

app.post('/register',async (req, res) => {
  console.log(req.body);

  try{
    if(req.body.role == 'user'){
        const createdUser = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role_id: 1
      })
      res.status(200).send({
        message: 'user created successfully!',
        role: createdUser.role_id,
        user_id: createdUser.id
      })
    }
    else if(req.body.role == 'seller'){
      const createdUser = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role_id: 2
      })
     
      res.status(200).send({
        message: 'seller created successfully!',
        role: createdUser.role_id,
        user_id: createdUser.id
      })

      let userId = createdUser.id;

      const createdSeller = await Seller.create({
        user_id: userId
      })
    }

  }catch(error){
    console.log(error);
  }

});

app.post('/product', async (req, res) => {
  try{
    const createdProduct = await Product.create({
      user_id: req.body.userId,
      brand_id: req.body.brandId,
      category_id: req.body.categoryId,
      collection_id: req.body.collectionId,
      product_name: req.body.product_name,
      product_description: req.body.product_description,
      product_image: req.body.product_image,
      product_color: req.body.product_color,
      product_size: req.body.product_size,
      qty_in_stock: req.body.qty_in_stock,
      price: req.body.price,
    })
    res.status(200).send({
      message: 'Product entered successfully',
    });
  }catch(error){
    console.log(error);
  }
})

app.post('/cartproducts', async (req,res) => {
  try {
    const createCartItem = await Cart.create({
      user_id: req.body.userId,
      product_id: req.body.productId,
      product_name: req.body.productName,
      product_image: req.body.productImage,
      product_quantity: req.body.productQuantity,
      product_price: req.body.productPrice,
    })
    res.status(200).send(createCartItem);
  } catch(error){
    console.log(error);
    res.status(400).send({error})
  }
})

app.get('/cartproducts/:userId', async (req,res) => {
  try {
    const findAllCartProducts = await Cart.findAll({ where: {
      user_id: req.params.userId
    }
    })
    res.status(200).send({
      findAllCartProducts: findAllCartProducts
    });
  } catch(error){
    console.log(error);
    res.status(400).send({error})
  }
})

app.delete('/cartproduct/:cartProductId', async (req,res) => {
  try {
    const findProductToDelete = await Cart.destroy({ where: {
      id: req.params.cartProductId
    }
    })
    res.status(200).send({
      message: 'you deleted a product',
      findProductToDelete: findProductToDelete
    });
  } catch(error){
    console.log(error);
    res.status(400).send({error})
  }
})


app.get('/myproducts/:userId', async (req, res) => {
  try {
    const allMyProducts = await Product.findAll({where: {
      user_id: req.params.userId
    }})
    res.status(200).send(
      {
      myProducts: allMyProducts
      });
  } catch (error) {
    console.log(error);
  }
})

app.get('/myproducts' , async (req, res) => {
  try{
    const productToShow = await Product.findOne({
      id: req.body.productId
    })
    res.status(200).send({
      productToShow: productToShow
    })
  }catch(error){
    console.log(error);
  }
})

app.get('/product', async (req, res) => {
  try{
    const allTheProducts = await Product.findAll(); 
    const allTheBrands = await Brand.findAll();
    const allTheCategories = await Category.findAll();
    const allTheCollections = await Collection.findAll();
    res.status(200).send({
      allProducts: allTheProducts,
      allBrands: allTheBrands,
      allCategories: allTheCategories,
      allCollections: allTheCollections
    });
  }catch(error){
    console.log(error);
  }
})

app.get('/product/:productId', async (req,res) => {
  try{
    const productToShow = await Product.findOne( {where:
      {   
        id: req.params.productId
      }
    })

    console.log(productToShow);
    res.status(200).send({
      product: productToShow
    });
  }catch(error){
    console.log(error);
  }
})

app.put('/editproduct/:productId', async (req,res) => {
  try{
    const productToUpdate = await Product.findOne({ where: 
    {
      id: req.params.productId
    }})

    productToUpdate.update({
      category_id: req.body.categoryId,
      brand_id: req.body.brandId,
      collection_id: req.body.collectionId,
      product_name: req.body.product_name,
      product_description: req.body.product_description,
      product_image: req.body.product_image,
      product_color: req.body.product_color,
      product_size: req.body.product_size,
      qty_in_stock: req.body.qty_in_stock,
      price: req.body.price
    })
    res.status(200).send(productToUpdate);
  }catch(error){
    console.log(error);
  }

})

app.get('/brands', async (req,res) => {
  try{
    const allTheBrands = await Brand.findAll()
    console.log(allTheBrands);
    res.status(200).send({
      allBrands: allTheBrands
    });
  }catch(error){
    console.log(error);
  }
})

app.get('/brand/:brandId', async (req,res) => {
  try{
    const brandToShow = await Brand.findOne( {where:
      {   
        id: req.params.brandId
      }
    })

    console.log(brandToShow);
    res.status(200).send({
      brand: brandToShow
    });
  }catch(error){
    console.log(error);
  }
})

app.get('/collection/:collectionId', async (req,res) => {
  try{
    const collectionToShow = await Collection.findOne( {where:
      {   
        id: req.params.collectionId
      }
    })

    const collectionProducts = await Product.findAll( {
      where:{
        collection_id: req.params.collectionId
      }
    })

    console.log(collectionToShow,collectionProducts);
    res.status(200).send({
      collection: collectionToShow,
      collectionProducts:collectionProducts
    });
  }catch(error){
    console.log(error);
  }
})


app.post('/login', async (req,res) => {
  const userToLogin = await User.findOne( {where: 
    {
      email: req.body.email
    }
  });
  if(userToLogin.password === req.body.password){
    console.log('Keni dhene fjalkalimin e duhur');
    res.status(200).send({
      message: 'Keni dhene fjalkalimin e duhur',
      role: userToLogin.role_id,
      user_id: userToLogin.id
    })
  }
  else{
    console.log('provoni perseri');
    res.status(200).send('Provoni perseri')
  }
})

app.post('/myprofile', async(req, res) => {
  try {
      const userToFind = await User.findOne({
          where: 
          {id: req.body.user_id}
      });
  
      res.status(200).send(userToFind);
  } catch (error) {
      console.log(error);
  }    
  
})

app.post('/sellerprofile', async (req,res) => {
  try {
    const sellerToFind =  await Seller.findOne({
      where: {
        user_id: req.body.user_id
      }
    })
    res.status(200).send(sellerToFind);
  } catch (error) {
    console.log(error);
  }
})

app.put('/myprofile', async(req, res) => {
  try{
      const userToFind = await User.findOne({
          where: 
          {id: req.body.user_id}
      });
      
      userToFind.update({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          username: req.body.username
      })

      res.status(200).send(userToFind);
  } catch(error) {
      console.log(error);
  }
});

app.put('/sellerprofile', async(req, res) => {
    try{
        const sellerToFind = await Seller.findOne({
          where:{
            user_id: req.body.user_id
          }
        })

        sellerToFind.update({
          location: req.body.location,
          website: req.body.website,
          working_start: req.body.working_start,
          working_end: req.body.working_end,
          shipping: req.body.shipping
        })
  
        res.status(200).send(sellerToFind);
    } catch(error) {
        console.log(error);
    }
  }
)

app.listen(process.env.BACKEND_PORT, () => {
  console.log(`Running right now on port ${process.env.BACKEND_PORT}`);
});

