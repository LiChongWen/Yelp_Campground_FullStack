var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    rating: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("Comment", commentSchema);