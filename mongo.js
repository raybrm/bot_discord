const mongoose = require('mongoose')
const mongoPath  = process.env.MONGODB_URI

// connexion à la db
module.exports = async () => {
    await mongoose.connect(mongoPath, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    return mongoose
}