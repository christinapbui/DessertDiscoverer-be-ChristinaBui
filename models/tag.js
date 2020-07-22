const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
	tag: {
		type: String,
		unique: true,
		trim: true,
		lowercase: true,
	},
});

tagSchema.statics.convertToObject = async function (tags) {
    console.log("Tag schema", tags)
	let newTag = tags.map(async (el) => {
		let uniqueTag = await this.findOne({ tag: el.toLowerCase().trim() });
		if (uniqueTag) return uniqueTag;
		uniqueTag = await this.create({ tag: el.toLowerCase().trim() });
		return uniqueTag;
	});
	let result = await Promise.all(newTag);
	return result;
};

module.exports = mongoose.model("Tag", tagSchema);
