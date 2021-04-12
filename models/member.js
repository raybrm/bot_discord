const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}

const memberSchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    xp: {
        type: Number,
        default: 0,
    }, 
    level: {
        type: Number,
        default: 1,
    }
})

// memberSchema.set('toJSON', {
//     transform: (document, returnedObject) => {
//         returnedObject.id = returnedObject._id.toString()
//         delete returnedObject._id
//         delete returnedObject.__v
//     }
// })

module.exports = mongoose.model('Member', memberSchema)