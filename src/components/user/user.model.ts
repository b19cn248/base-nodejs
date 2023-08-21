import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { failedResponse, FailedResponseType } from './../../utils/http';
import mongoose, { Document, Model} from "mongoose";

import { IUser, IUserProfile, IUserResponse } from "./user.types";

export interface UserDocument extends IUser, Document { };
export interface UserProfileDocument extends IUserProfile, Document { };
interface UserModel extends Model<UserDocument> {
    checkLogin: (email: string, password: string) => UserDocument | undefined | FailedResponseType<string>
    generateAccessToken: (user: any, remember?: boolean) => string
    generateRefreshToken: (user: any) => string
    getUserProfile: (token: string) =>  any
    updateProfile: (token : string) => any
    getResetPasswordToken: (email: string) => any
}

const userSchema = new mongoose.Schema<UserDocument, UserModel>({
    email : String, 
    password : String,
    name: String,
    phone: String,
    address: String,
    facilityId: String,
    positionId: String,
    createdAt: Date,
    updatedAt: Date
});


userSchema.pre<UserDocument>('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});


userSchema.methods.toJSON = function (): Omit<IUserResponse, 'accessToken'> {
    const user = this;
    return {
        id: user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        facilityId : user.facilityId,
        positionId : user.positionId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    }
};

userSchema.statics.generateAccessToken = function (user: UserDocument, remember = false): string {
    const { id } = user;
    return jwt.sign({ id }, process.env.JWT_SECRET ?? '', { expiresIn: remember ? '3d' : '2h' });
};

userSchema.statics.generateRefreshToken = function (user: UserDocument): string {
    const { id } = user;
    return jwt.sign({ id }, process.env.JWT_REFRESH_TOKEN ?? '', { expiresIn: '4d' });
};

userSchema.statics.checkLogin = async function (email: string, password: string): Promise<UserDocument | undefined | FailedResponseType<string>> {
    const user = await User.findOne({ email });

    if (!user) {
        return failedResponse('Sai tài khoản hoặc mật khẩu', 'WrongCredentials');
    }

    const isValidPassword = await bcrypt.compare(password, user?.password);

    if (!isValidPassword) {
        return failedResponse('Sai tài khoản hoặc mật khẩu', 'WrongCredentials');
    }
    return user;
};

userSchema.statics.getUserProfile = async function (token: string): Promise<any> {
    const { email } = jwt.verify(token, process.env.JWT_SECRET ?? '') as { email: string };
    const userProfile = await User.findOne({ email })  ;
    

    if (!userProfile) {
        return failedResponse('Không tìm thấy tài khoản', 'UserNotFound');
    }

    return userProfile
}

//update profile
userSchema.statics.updateProfile = async function (token: string): Promise<any> {
    const { email } = jwt.verify(token, process.env.JWT_SECRET ?? '') as { email: string };
    const userProfile = await User.findOne({ email })
    if (!userProfile) {
        return failedResponse('Không tìm thấy tài khoản', 'UserNotFound');
    }
    return userProfile
}

//generate and hash password token
// userSchema.statics.getResetPasswordToken = async function (email: string): Promise<any> {
//     const user = await User.findOne({ email});
//     if (!user) {
//         return failedResponse('Không tìm thấy tài khoản', 'UserNotFound');
//     }
//     const resetToken = ;
//     await user.save({ validateBeforeSave: false });
//     return resetToken;
// }


const User =  mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;