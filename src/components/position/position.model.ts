//the same facility=.model.ts
import mongoose, { Document, Model, mongo} from 'mongoose';

import { IPosition } from './position.types';

interface PositionDocument extends IPosition, Document { };
interface PositionModel extends Model<PositionDocument> { };

const PositionSchema = new mongoose.Schema<PositionDocument, PositionModel> ( {
    name : {
        type : String,
        require : true
    },
    description : String,
})

PositionSchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Position = mongoose.model<PositionDocument, PositionModel>('Position', PositionSchema);
export default Position;

