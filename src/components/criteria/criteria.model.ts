import mongoose, { Document, Model, mongo} from 'mongoose';

import { ICriteria } from './criteria.types';

interface CriteriaDocument extends ICriteria, Document { };
interface CriteriaModel extends Model<CriteriaDocument> { };

const criteriaSchema = new mongoose.Schema<CriteriaDocument, CriteriaModel> ( {
    name : {
        type : String,
        require : true
    },
    description : String,
})

criteriaSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Criteria = mongoose.model<CriteriaDocument, CriteriaModel>('Criteria', criteriaSchema);

export default Criteria;