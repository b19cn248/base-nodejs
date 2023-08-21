import mongoose, { Document, Model, mongo} from 'mongoose';
import { IBook } from './book.types';


interface BookDocument extends IBook, Document { };
interface BookModel extends Model<BookDocument> { };

const bookSchema = new mongoose.Schema<BookDocument, BookModel> ( {
    name : {
        type : String,
        require : true
    },
    author : String,
    price : Number,
    description : String,
    status : String
})

bookSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Book = mongoose.model<BookDocument, BookModel>('Book', bookSchema);

export default Book;