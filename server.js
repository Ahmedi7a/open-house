require('dotenv').config();
require('./config/database')
const express = require("express");
const methodOverride = require("method-override"); // new
const app = express();
const session = require('express-session');// for session
const MongoStore = require('connect-mongo');// to store session in mongo
const morgan = require('morgan');
const path = require("path");
const isSignedIn = require('./middelware/is-signed-in.js')
const passUserToView=require('./middelware/pass-user-to-veiw.js')

//models
const User = require("./models/user");
const Listing=require("./models/listing");


//middleware
app.use(morgan('dev'));
// need to put it to read the body in form
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); //css
//session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI,
            ttl: 7 * 24 * 60 * 60 // 1 week in seconds
        }),
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week in millesecond
            httpOnly: true,
            secure: false,
        }
    })
);

app.use(passUserToView);
//====================================================
//import controller
const authCotroller = require('./controllers/authentication.js');
const listingController= require('./controllers/listings.js');

//==================================================

//home page
app.get('/', authCotroller.home);

//signup page
app.get('/auth/sign-up', authCotroller.signUp)

//post sign up
app.post('/auth/sign-up', authCotroller.addUser)

//sign in page
app.get('/auth/sign-in', authCotroller.signInForm)

//sign in post
app.post('/auth/sign-in', authCotroller.signIn)

//sign out page and kill session
app.get('/auth/sign-out', authCotroller.signOut);

app.use(isSignedIn); // signed in to see after this
// //vip
// app.get('/vip-lounge', isSignedIn, authCotroller.welcome)
//=============================================================
//list route

//get index page
app.get('/listings', listingController.index);

//add page
app.get('/listings/new', listingController.addListing );

//post the add
app.post('/listings/:userId',listingController.createListing)

//view details
app.get('/listings/:listingId', listingController.show)

//delete
app.delete('/listings/:userId/:listingId',listingController.deleteListing)

//edit page
app.get('/listings/:userId/:listingId/edit', listingController.editListing)

//post
app.put('/listings/:userId/:listingId', listingController.updateListing)

//=============================================
app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000");
});