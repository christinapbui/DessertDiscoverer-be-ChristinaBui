var express = require("express");
var router = express.Router({mergeParams:true});
var { getAllDesserts, createDessert, getSingleDessert, updateDessert } = require("../controllers/dessertController") 

router.route("/")
.get(getAllDesserts)
.post(createDessert)

router.route("/:eid")
.get(getSingleDessert)
.patch(updateDessert)
// need a remove dessert option too


module.exports = router;