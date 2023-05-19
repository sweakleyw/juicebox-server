const express = require("express");
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require("../db");

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

tagsRouter.get("/", async (req, res) => {
  const tags = await getAllTags();

  res.send({
    tags,
  });
});

tagsRouter.get("/:tagName/posts", async (req, res, next) => {
  const { tagName } = req.params;

  try {
    const allPosts = await getPostsByTagName(tagName);
    const posts = allPosts.filter((post) => {
      if (post.active) {
        return true;
      }
      if (req.user && req.user.id === post.author.id) {
        return true;
      }
      return false;
    });
    res.send({ posts });
  } catch ({ name, message }) {
    throw { name, message };
  }
});

module.exports = tagsRouter;
