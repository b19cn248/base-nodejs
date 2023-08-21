
import mongoose, { Document, Model, mongo} from 'mongoose';

import { ISetOfQuestions } from './setOfQuestions.types';

interface SetOfQuestionsDocument extends ISetOfQuestions, Document { };
interface SetOfQuestionsModel extends Model<SetOfQuestionsDocument> { };

const setOfQuestionsSchema = new mongoose.Schema<SetOfQuestionsDocument, SetOfQuestionsModel> ( {
    name : {
        type : String,
        require : true
    },
    description : String,
    criteriaId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Criteria'
    }
})

setOfQuestionsSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const SetOfQuestions = mongoose.model<SetOfQuestionsDocument, SetOfQuestionsModel>('SetOfQuestions', setOfQuestionsSchema);

export default SetOfQuestions;
