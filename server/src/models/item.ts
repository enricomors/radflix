import mongoose from 'mongoose'

export type ItemModel = mongoose.Document & {
    clTokenUri: string,
    olTokenUri: string,
    name: string,
    description: string,
    posterUrl: string,
    price: number,
    contentUrl: string,
};

const itemSchema = new mongoose.Schema({
    clTokenUri: {
        type: String,
        unique: true,
    },
    olTokenUri: {
        type: String,
        unique: true,
    },
    name: String,
    description: String,
    posterUrl: String,
    price: Number,
    contentUrl: String,
});

const Item = mongoose.model<ItemModel>('Item', itemSchema);

export default Item;