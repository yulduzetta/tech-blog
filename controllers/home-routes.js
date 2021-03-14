// This file contains all of the user-facing routes, such as the homepage and login page.

const sequelize = require("sequelize");
const { User, Post, Comment } = require("../models");

const router = require("express").Router();

router.get("/", (req, res) => {
  Post.findAll({
    attributes: ["id", "content", "title", "created_at"],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      // You didn't need to serialize data before when you built API routes,
      // because the res.json() method automatically does that for you.
      // This will loop over and map each Sequelize object into a serialized version of itself,
      // saving the results in a new posts array.
      const posts = dbPostData.map((post) => post.get({ plain: true }));

      // you can NOT use res.sendFile() here b/c sendFile() would only be used with static HTML files.
      res.render("homepage", { posts, loggedIn: req.session.loggedIn });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Our login page doesn't need any variables,
// so we don't need to pass a second argument to the render() method.
router.get("/login", (req, res) => {
  // check for a session and redirect to the homepage if one exists
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  // check for a session and redirect to the homepage if one exists
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});

router.get("/", (req, res) => {
  console.log(req.session);

  // other logic...
});

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: { id: req.params.id },
    attributes: ["id", "content", "title", "created_at"],
    include: [
      {
        model: Comment,
        attributes: [
          "id",
          "comment_text",
          "post_id",
          "user_id",
          "user_id",
          "created_at",
        ],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }
      // serialize the data
      const post = dbPostData.get({ plain: true });

      // pass data to template
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
