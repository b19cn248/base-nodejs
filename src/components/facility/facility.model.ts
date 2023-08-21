import mongoose, { Document, Model, mongo} from 'mongoose';
import { IFacility } from './facility.types';

interface FacilityDocument extends IFacility, Document { };
interface FacilityModel extends Model<FacilityDocument> { };

const facilitySchema = new mongoose.Schema<FacilityDocument, FacilityModel> ( {
    name : {
        type : String,
        require : true
    },
    address : String,
    description : String,
})

facilitySchema.set('toJSON', {
    virtuals : true,
    versionKey : false,
    transform: function ( doc, ret ) { delete ret._id }
});

const Facility = mongoose.model<FacilityDocument, FacilityModel>('Facility', facilitySchema);

export default Facility;