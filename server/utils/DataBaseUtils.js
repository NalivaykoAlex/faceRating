import mongoose from 'mongoose'

import '../models/Avatar'
import config from '../etc/config.json'

const Avatar = mongoose.model('Avatar')

export function setUpConnection() {
    mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`)
    console.log('mongodb start')
}


export function createAvatar (link, id) {
    const image = new Avatar({ link, id });

    return image.save()
}
