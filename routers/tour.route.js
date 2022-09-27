const tourController = require("../controller/tourController");

const router = require("express").Router();

router.route("/").get(tourController.getTours).post(tourController.createTour);
router.patch("/:id", tourController.updateTour);

router.get("/trending", tourController.getTrendingTours);

router.get("/cheapest", tourController.getCheapestTours);

router.get("/:id", tourController.getTour);

module.exports = router;
