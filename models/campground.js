var mongoose = require("mongoose");
const Comment = require('./comment');
var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    ratings: {
        type: Number,
        default: 0
    }
});


// campgroundSchema.pre('remove', async function() {
// 	await Comment.remove({
// 		_id: {
// 			$in: this.comments
// 		}
// 	});
// });
module.exports = mongoose.model("Campground", campgroundSchema);