const express = require("express");
const app = express();
const mongoose  = require("mongoose");
const { MONGOURL } = require("./config/keys");
const path = require("path");
const PORT = process.env.PORT || 5000;

require("dotenv").config()
require("./models/user");
require("./models/post");
require('./models/otp');

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(express.static(path.resolve(__dirname, "./client/build")));
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});


  mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

mongoose.connection.on("connected", () => {
    console.log("Connected to MONGODB")
});
mongoose.connection.on("error", (err) => {
    console.log(" NOT Connected to MONGODB", err)
}); 

if(process.env.NODE_ENV == "production"){
  app.use(express.static('client/build'))
  app.get("*", (req,res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(PORT, () => {
    console.log("server is running");
});