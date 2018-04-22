const mongoose = require('mongoose');

const Schema = mongoose.Schema

const AvatarSchema = new Schema({
    link: { type: String },
    id: { type: String }
})

const Avatar = mongoose.model('Avatar', AvatarSchema)