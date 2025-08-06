const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { log } = require("console");
require("dotenv").config(); // Load environment variables from .env file

app.use(express.json());
app.use(cors());

const URI = process.env.MONGODB_URI;
// Database Connection With MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Optional: exit the app if DB connection fails
  }
};

connectToMongoDB(); 


// API Creation

app.get("/", (req, res) => {
    res.send("Express App is Running");
});

//Image Storage Engine

const storage = multer.diskStorage({
    destination: './upload/Images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating upload endpoint for uploading the images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

// Schema for creating product

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },

})

const fetchAdmin = async (req,res,next)=>{
    const token = req.header('admin-auth-token');
    if(!token){
        res.status(401).send({errors:"Please authenticate using valid admin token"})
    }
    else{
        try {
            const data = jwt.verify(token,'admin_secret_ecom');
            req.admin = data.admin;
            next();
        } catch (error) {
            res.status(401).send({errors:"please authenticate using a valid admin token"});
        }
    }
}

app.post('/addproduct',fetchAdmin,async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name,
    })
})

//Creating API for removing product from the database
app.post('/removeproduct',fetchAdmin,async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//Creating endpoint to get all product available in database
app.get('/allproducts',async (req,res)=>{
    let products = await Product.find({});
    console.log("All Products Fetched");
    res.send(products);
})

// Schema creation for user model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Schema creation for admin model
const Admin = mongoose.model('Admin',{
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:'admin',
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating endpoint for registering the user
app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"existing user found with same e-mail address"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
       cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save(); // Save the user in the database

    const data = {         
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

// Creating endpoint for user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,error:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,error:"Wrong email id"});
    }
})

// Creating endpoint for admin login
app.post('/admin/login',async (req,res)=>{
    let admin = await Admin.findOne({email:req.body.email});
    if(admin){
        const passCompare = req.body.password === admin.password;
        if(passCompare){
            const data = {
                admin:{
                    id:admin.id,
                    username:admin.username,
                    role:admin.role
                }
            }
            const token = jwt.sign(data,'admin_secret_ecom');
            res.json({success:true,token,admin:data.admin});
        }
        else{
            res.json({success:false,error:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,error:"Admin not found"});
    }
})

// Creating endpoint for admin registration (you can remove this in production)
app.post('/admin/signup',async (req,res)=>{
    let check = await Admin.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:"Admin already exists with same email address"})
    }
    
    const admin = new Admin({
        username:req.body.username,
        email:req.body.email,
        password:req.body.password,
    })

    await admin.save();

    const data = {         
        admin:{
            id:admin.id,
            username:admin.username,
            role:admin.role
        }
    }

    const token = jwt.sign(data,'admin_secret_ecom');
    res.json({success:true,token,admin:data.admin})
})

// Endpoint to get all users (for admin dashboard)
app.get('/allusers',fetchAdmin,async (req,res)=>{
    let users = await Users.find({});
    console.log("All Users Fetched");
    res.send(users);
})

// Creating endpoint for new collection data
app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);// We will get recently added 8 products
    console.log("New Collection fetched");
    res.send(newcollection);
})

// Creating endpoint for popular in women category
app.get("/popularinwomen",async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);
    
})

// Creating middleware to fetch user
   const fetchUser = async (req,res,next)=>{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
        else{
            try {
                const data = jwt.verify(token,'secret_ecom'); //Passing salt for one layer encryption
                req.user = data.user;
                next(); //Using this our token will be decoded
            } catch (error) {
                res.status(401).send({errors:"please authenticate using a valid token"});
            }
        }
   }



// Creating endpoint for adding product in cart data
app.post('/addtocart',fetchUser,async (req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id}); //Complete object will be stored in the variable
    userData.cartData[req.body.itemId]+=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData}); // It will modify the database
    res.send("Added")
    
})

// Creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});//Complete object will be stored in the variable
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId]-=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData}); // It will modify the database
    res.send("Removed")
})

// Creating endpoint to get cart data
app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on port " + port);
    } else {
        console.log("Error: " + error); // Fix: Corrected string concatenation
    }
});

