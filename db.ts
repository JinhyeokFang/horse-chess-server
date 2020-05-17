import mongoose from 'mongoose';

import config from './config';

class DB {
    public initialize(): void {
        mongoose.connect(`mongodb://mongodb/dbdb`, {
            useNewUrlParser: true,
        }).catch(console.error);
    }
}

export default new DB();