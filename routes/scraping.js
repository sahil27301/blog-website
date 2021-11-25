const router = require('express').Router();

router.get('/scraping', async(req, res) => {
    res.render("scraping/scraping");
});

module.exports = router;