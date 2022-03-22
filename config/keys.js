/* module.exports = {
    MONGOURL : "mongodb+srv://pavan:pktest123@cluster0.e9nmm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    JWT_SECRET : "pubgbgminewstate"
}; */

if(process.env.NODE_ENV == "production"){
    module.exports = require("./prod")
}
else{
    module.exports = require('./dev')
}