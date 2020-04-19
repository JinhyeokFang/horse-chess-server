import mongoose from 'mongoose';

import config from './config';

class DB {
    public initialize(): void {
        mongoose.connect(`mongodb://localhost/${config.db.name}`, {
            useNewUrlParser: true
        })
    }
}

export default new DB();