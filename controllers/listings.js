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
        const listing = await Listing.findById(req.params.listingId).populate('owner');
        const userHasFavorited = listing.favoriteByUsers.some((user) => user.equals(req.session.user._id))
        res.render('listings/show.ejs', { title: 'Details', listing, userHasFavorited })
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }

}

//delete
async function deleteListing(req, res) {

    try {
        const listing = await Listing.findById(req.params.listingId).populate('owner');
        if (listing.owner.equals(req.params.userId)) {
            await listing.deleteOne()
            res.redirect('/listings');


        }
    }
    catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

//edit page
async function editListing(req, res) {
    try {
        const listing = await Listing.findById(req.params.listingId).populate('owner');
        console.log(listing)
        if (listing.owner.equals(req.params.userId)) {
            res.render('listings/edit.ejs', { title: 'Edit', listing })
        } else {
            res.send('you dont have permission');
        }



    }
    catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

async function updateListing(req, res) {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.listingId, req.body, { new: true })
        res.redirect(`/listings/${listing._id}`)

    }
    catch (err) {
        console.log(err);
        res.redirect('/');
    }
}
//============================================================================
//fav

//add fav
async function addFav(req, res) {
    console.log('in fave')
    try {
        const listing = await Listing.findByIdAndUpdate(
            req.params.listingId,
            {
                $push: {favoriteByUsers:req.params.userId} //used 
            },
            {new:true},
        );
        res.redirect(`/listings/${listing._id}`)
       
        console.log(listing)
    }
    catch (err) {
        console.log(err);
        res.redirect('/');
    }
}

//unfav
async function removeFav(req,res){
    try {
        const listing = await Listing.findByIdAndUpdate(
            req.params.listingId,
            {
                $pull: {favoriteByUsers:req.params.userId} //used 
            },
            {new:true},
        );
        res.redirect(`/listings/${listing._id}`)
       
        console.log(listing)
    }
    catch (err) {
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
    editListing,
    updateListing,
    addFav,
    removeFav,
}