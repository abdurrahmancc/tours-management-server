const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const colors = require("colors");

const app = require("./app");
const tour = require("./routers/tour.route");
const { notFounderHandler, errorHandler } = require("./middlewares/errorHandler");

// database connection
mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => {
    console.log("database connection is successful".red.bold);
  });

// server
const port = process.env.PORT || 8080;

//routers
app.use("/api/v1/tours", tour);
app.use("/api/v1/tour", tour);

//
app.use(notFounderHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`app is running on port ${port}`.yellow.bold);
});

/*--------- If no error is handled express -----------*/
process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});
