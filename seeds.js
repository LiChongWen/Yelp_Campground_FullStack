var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seeds = [
    {
        name: "Cloud's Rest", 
        price: "9.7",
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        location: "Yosemite National Park, California, USA",
        lat : 37.8651011, 
        lng : -119.5383294,
        createdAt: "2019-05-21T21:47:57.539Z",
        author:{
            id : "588c2e092403d111454fff76",
            username: "Jack"
        }
    },
    {
        name: "Desert Mesa", 
        price: "2.7",
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        location: "Yosemite National Park, California, USA",
        lat : 37.8651011, 
        lng : -119.5383294,
        createdAt: "2019-05-21T21:47:57.539Z",
        author:{
            id : "588c2e092403d111454fff71",
            username: "Jill"
        }
    },
    {
        name: "Canyon Floor", 
        price: "5.8",
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
        location: "Yosemite National Park, California, USA",
        lat : 37.8651011, 
        lng : -119.5383294,
        createdAt: "2019-05-21T21:47:57.539Z",
        author:{
            id : "588c2e092403d111454fff77",
            username: "Jane"
        }
    }
];

async function seedDB(){
    try{
        await Campground.deleteMany({});
        console.log("Campground removed");
        await Comment.deleteMany({});
        console.log("Comment removed");
        for (const seed of seeds) {
            //add a few campgrounds
            let campground = await Campground.create(seed);
            console.log("Campground created");
            //create few comments
            let comment = await Comment.create({
                text: "This is a great place, wish there was internet",
                createdAt: "2019-05-21T21:47:57.539Z",
                author:{
                    id : "588c2e092403d111454fff76",
                    username: "Jack"
                }
            });
            console.log("Comment created");
            campground.comments.push(comment);
            campground.save();
            console.log("Comment added to the campground");
        }
    }catch(err){
        console.log(err);
    }
}

module.exports = seedDB;