import mongoose from 'mongoose';

class DB {
    public initialize(): void {
        mongoose.connect(`mongodb://localhost/dbdb`, {
            useNewUrlParser: true,
        }).catch(console.error);
    }
}

export default new DB();