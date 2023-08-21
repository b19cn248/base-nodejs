import mongoose, { Schema, Document } from 'mongoose';
import {IResult} from './result.types';

interface ResultDocument extends IResult, Document {};
interface ResultModel extends mongoose.Model<ResultDocument> {};

const resultSchema = new mongoose.Schema<ResultDocument, ResultModel>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    createdAt: Date,
});

resultSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Result = mongoose.model<ResultDocument, ResultModel>('Result', resultSchema);

export default Result;