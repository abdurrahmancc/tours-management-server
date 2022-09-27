const createError = require("http-errors");
const {
  getToursServices,
  createTourServices,
  getTourServices,
  getTrendingTourService,
  getCheapestTourService,
  updateTourServices,
} = require("../services/tour.services");

exports.getTours = async (req, res, next) => {
  try {
    console.log(req.query);
    let filters = { ...req.query };
    const excludeFields = ["sort", "page", "limit"];
    excludeFields.forEach((field) => delete filters[field]);

    let filtersSting = JSON.stringify(filters);
    filtersSting = filtersSting.replace(/\b(gt|gte|lt|lte|eq)\b/g, (match) => `$${match}`);

    filters = JSON.parse(filtersSting);

    const queries = {};
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
    }

    if (req.query.page) {
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * Number(limit);
      queries.skip = skip;
      queries.limit = parseInt(limit);
    }
    const products = await getToursServices(filters, queries);
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    next(createError(400, error.message));
  }
};

exports.getTour = async (req, res, next) => {
  const id = req.params.id;
  try {
    const tours = await getTourServices(id);
    res.status(200).json({
      status: "success",
      data: tours,
    });
  } catch (error) {
    next(createError(error.message));
  }
};

exports.getTrendingTours = async (req, res, next) => {
  try {
    const result = await getTrendingTourService();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(createError(400, error.message));
  }
};
exports.getCheapestTours = async (req, res, next) => {
  try {
    const result = await getCheapestTourService();
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(createError(400, error.message));
  }
};

exports.createTour = async (req, res, next) => {
  try {
    const result = await createTourServices(req.body);
    res.status(200).json({
      status: "success",
      message: "Data inserted successfully!",
      data: result,
    });
  } catch (error) {
    next(createError(400, error.message));
  }
};

exports.updateTour = async (req, res, next) => {
  try {
    const result = await updateTourServices(req.params.id, req.body, next);
    res.status(200).json({
      status: "success",
      message: "Data updated successfully!",
      data: result,
    });
  } catch (error) {
    next(createError(400, error.message));
  }
};
