const Dessert = require("../models/dessert")
// const Tag = require("../models/tag")

const getAllDesserts = async (req, res) => { // NEED TO FINISH
    const page = parseInt(req.query.page) || 1; // .page is the param
    const PAGE_SIZE = 20;
}

const createDessert = async (req, res) => {
    const name = req.body.name
    const pictureUrl = req.body.pictureUrl
    const price = req.body.price
    const rating = req.body.rating
    const description = req.body.description
    const tags = req.body.tags
    const seller = req.body.seller

    console.log(req.body)

    const newDessert = await Dessert.create({
        name,
        pictureUrl,
        price,
        rating,
        description,
        tags,
        seller
    });
    console.log(newDessert)
    res.send(newDessert)

}

const updateDessert = async (req, res) => {
    try {
        const singleDessert = await Dessert.findOne({
            _id: req.params.did
        })

        if (!singleDessert)
            return res.status(404).json({
                status: "Fail",
                message: "No dessert found"
            })
        
        const fields = Object.keys(req.body);
        fields.map((field) => (singleDessert[field] = req.body[field]))
        await singleDessert.save()
        res.status(200).json({
            status: "Successfully updated your dessert",
            data: singleDessert
        })

    } catch (err) {
        res.status(500).json({
            status: "Error updating dessert",
            error: err.message
        })
    }
}


const getSingleDessert = async (req, res) => {
    const singleDessert = await Dessert.findById(req.params.did);
    res.send(singleDessert)
}


module.exports = {
    getAllDesserts,
    createDessert,
    updateDessert,
    getSingleDessert
}