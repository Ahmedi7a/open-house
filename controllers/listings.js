const Listing = require('../models/listing');

//index page
async function index(req, res) {
    const listings = await Listing.find().populate('owner')
    res.render('listings/index.ejs', { title: 'All Listings', listings: listings, })
}

//form page
function addListing(req, res) {
    try {
        res.render('listings/new.ejs', { title: 'Add Listing' })
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }

}

//post add
async function createListing(req, res) {
    try {
        req.body.owner = req.params.userId
        await Listing.create(req.body);
        console.log(req.body);
        res.redirect('/listings')

    } catch (err) {
        console.log(err)
        res.redirect('/');
    }

}

//show page
async function show(req, res) {
    try {
        const listing= await Listing.findById(req.params.listingId).populate('owner');
        res.render('listings/show.ejs', { title: 'Details', listing, })
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }

}

//delete
async function deleteListing(req,res){

    try {
        const listing= await Listing.findById(req.params.listingId).populate('owner');
        if(listing.owner.equals(req.params.userId)){
            await listing.deleteOne()
            res.redirect('/listings');
        }else{

        }
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
}







//========
module.exports = {
    index,
    addListing,
    createListing,
    show,
    deleteListing,
}