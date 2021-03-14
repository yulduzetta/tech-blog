const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// When withAuth() calls next(), it will call the next (anonymous) function.
// However, if withAuth() calls res.redirect(),
// there is no need for the next function to be called,
// because the response has already been sent.
router.get("/", withAuth, (req, res) => {
  Post.findAll({
    where: {
      // use the ID from the sesssion
      user_id: req.session.user_id,
    },
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
      // serialize data before passing to template
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      res.render("dashboard", { posts, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/edit/:id", withAuth, (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "content",
      "title",
      "created_at",
    ],
    include: [
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(400).json({
          message: "No post found with this id",
        });
        return;
      }
      // serialize data before passing to template
      const post = dbPostData.get({ plain: true });
      res.render("edit-post", { post, loggedIn: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/add", withAuth, (req, res) => {
  // check for a session and redirect to the homepage if one exists
  if (!req.session.loggedIn) {
    res.redirect("/login");
    return;
  }
  res.render("create-post", { loggedIn: true });
});

module.exports = router;
