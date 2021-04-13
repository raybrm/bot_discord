const mongoose = require('mongoose')
const mongoPath  = process.env.MONGODB_URI

// connexion à la db
module.exports = async () => {
    // attend que la connexion se fait avant de return mongoose 
    await mongoose.connect(mongoPath, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    return mongoose
}