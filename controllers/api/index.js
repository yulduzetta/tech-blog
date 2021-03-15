/*
    Serves as a means to collect all of the API routes and package them up for us.
    While this is a small file, we're keeping the API endpoints nice and 
    organized while allowing the API to be scalable. 
    At some point, we'll add more API endpoints and use this file to collect them and
    give them their prefixed name. 
    Remember how in user-routes.js we didn't use the word users in any routes? 
    That's because in this file we take those routes and implement them to 
    another router instance, prefixing them with the path /users at that time.
*/
const router = require("express").Router();

const userRoutes = require("./user-routes.js");
const postRoutes = require("./post-routes");
const commentRoutes = require("./comment-routes");
const sessionRoutes = require ('./session-routes')

router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);
router.use("/session", sessionRoutes)
module.exports = router;