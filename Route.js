const express = require("express");
const filterPosts = require("./middleware/openai");
const router = express.Router();

router.use(filterPosts);
router.get("/search", (req, res) => {
    
});
module.exports = router;
