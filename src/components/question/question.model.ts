import mongoose, { Schema, Document } from 'mongoose';
import { IQuestion } from './question.types';

interface QuestionDocument extends IQuestion, Document { };
interface QuestionModel extends mongoose.Model<QuestionDocument> { };

const questionSchema = new mongoose.Schema<QuestionDocument, QuestionModel>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: Date,
    updatedAt: Date,
    setQuestionId: {
        type: Schema.Types.ObjectId,
        ref: 'SetQuestion',
        required: true,
    },
});

questionSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
});

const Question = mongoose.model<QuestionDocument, QuestionModel>('Question', questionSchema);

export default Question;