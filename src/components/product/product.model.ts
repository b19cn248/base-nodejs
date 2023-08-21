import mongoose, { Document, Model, mongo} from 'mongoose';
import { IProduct } from './product.types';


interface ProductDocument extends IProduct, Document { };
interface ProductModel extends Model<ProductDocument> { };

const productSchema = new mongoose.Schema <ProductDocument, ProductModel>({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    available: {
        type: Boolean,
        required: true,
    },
    rating: Number,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
    },
});

productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Product = mongoose.model<ProductDocument, ProductModel>('Product', productSchema);

export default Product;