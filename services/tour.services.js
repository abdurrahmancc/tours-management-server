const createError = require("http-errors");
const Tour = require("../models/Tour.schema");

exports.getToursServices = async (filters, queries) => {
  const tours = await Tour.find(filters)
    .skip(queries.skip)
    .limit(queries.limit)
    .select(queries.fields)
    .sort(queries.sortBy);
  return tours;
};

exports.getTourServices = async (id) => {
  const result = await Tour.updateOne(
    { _id: id },
    { $inc: { viewCount: 1 } },
    { runValidators: true }
  );
  if (!result.modifiedCount) {
    return { status: 400, message: "bad request" };
  }
  console.log(result);
  const tours = await Tour.findById({ _id: id });

  return tours;
};

exports.createTourServices = async (data) => {
  const tour = new Tour(data);
  if (tour.quantity == 0) {
    tour.status = "out-of-stock";
  }
  const result = await tour.save();
  return result;
};

exports.getTrendingTourService = async () => {
  const result = await Tour.find({}).sort({ viewCount: -1 }).limit(3);
  return result;
};

exports.getCheapestTourService = async () => {
  const result = await Tour.find({}).sort({ price: 1 }).limit(3);
  return result;
};

exports.updateTourServices = async (id, data, next) => {
  const isExist = await Tour.findById({ _id: id });
  if (!isExist) {
    next(createError(400, "bad request"));
  }
  const result = await Tour.updateOne({ _id: id }, data, { runValidators: true });
  return result;
};
