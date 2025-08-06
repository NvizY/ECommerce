const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
mongoose.connect("mongodb+srv://nviz1:394520@cluster0.or41adm.mongodb.net/EComm");

// Admin Schema
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
});

// Create admin user
const createAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({email: 'admin@ecommerce.com'});
        if (existingAdmin) {
            console.log('Admin already exists!');
            console.log('Email: admin@ecommerce.com');
            console.log('Password: admin123');
            return;
        }

        const admin = new Admin({
            username: 'admin',
            email: 'admin@ecommerce.com',
            password: 'admin123',
        });

        await admin.save();
        console.log('Admin created successfully!');
        console.log('Email: admin@ecommerce.com');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin(); 