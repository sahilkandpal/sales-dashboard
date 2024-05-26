require("dotenv").config();
const express = require("express");
const app = express();
const salesRouter = require("./app/routes/sales.routes");
const connectDb = require("./app/utils/db");
const errorHandler = require("./app/middlewares/errorhandler");

app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({message: "Welcome to sales dashboard"});
})

app.use("/api/sales", salesRouter);

app.use(errorHandler);

app.use(function(req, res, next) {
    res.status(404).json({
      message: "Unable to find the requested resource",
    });
});  

const PORT = 8000;

connectDb().then(()=>{
    app.listen(PORT, () => {
        console.log("server is running on port 8000");
    })
})
