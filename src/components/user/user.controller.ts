
import jwt, { Secret } from 'jsonwebtoken';
import { Controller, Route, Tags, Post, Body, Get, Request, Security, Put } from "tsoa";
import { IUserRegister, IUserLogin, IUserResponse, IRefreshTokenReq, IUserDB, IAccessTokenReq, IUser, IUserProfile, IUserUpdateProfile, IUserUpdatePassword } from "./user.types";
import { failedResponse, instanceOfFailedResponseType, successResponse } from "../../utils/http";
import User from './user.model';
import Facility from '../facility/facility.model';
import Position from '../position/position.model';



@Route('users')
@Tags('Users')
export class UserController extends Controller {
    //Register
    @Post('register')
    public async register(@Body() input: IUserRegister): Promise<any> {
        try {
            const { email, password, confirmPassword, name, phone, address, positionId, facilityId } = input;
            if (password !== confirmPassword) {
                this.setStatus(400);
                return failedResponse('Xác nhận mật khẩu không trùng khớp', 'NotEqualConfirm');
            }
            //if Position not in database return failed
            if(positionId){
                const position = await Position.findById(positionId);
                if(!position){
                    this.setStatus(400);
                    return failedResponse('Position không tồn tại', 'PositionNotExist');
                }
            }
            //if facility not in database return failed
            if(facilityId){
                const facility = await Facility.findById(facilityId);
                if(!facility){
                    this.setStatus(400);
                    return failedResponse('Facility không tồn tại', 'FacilityNotExist');
                }
            }
            const user = await User.findOne({ email });
            if (user) {
                this.setStatus(400);
                return failedResponse('Email này đã được đăng kí', 'UniqueEmail');
            }
            const newUser = new User({ email, password, name, address, phone, positionId, facilityId, createdAt: new Date(), updatedAt: new Date() });
            await newUser.save();
            return successResponse(newUser);

        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }



    // login
    @Post('login')
    public async login(@Body() data: IUserLogin): Promise<any> {
        try {
            const { email, password, remember } = data;
            const user = await User.checkLogin(email, password);
            if (instanceOfFailedResponseType<string>(user)) {
                this.setStatus(400);
                return user;
            }
            user as IUserDB;
            if (!user) return;
            const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET as Secret, { expiresIn: '45m' });
            const refreshToken = jwt.sign({ email: user.email }, process.env.JWT_REFRESH_TOKEN as Secret, { expiresIn: '7d' });
            return successResponse({ accessToken, refreshToken });
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
        
    }

    // refresh token

    @Post('refreshtoken')
    public async refreshToken(@Body() data: IRefreshTokenReq): Promise<any> {
        try {
            const { refreshToken } = data;
            if (!refreshToken) {
                this.setStatus(400);
                return failedResponse('Refresh token không tồn tại', 'RefreshTokenNotFound');
            }
            console.log(refreshToken);
            jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN as Secret, (err, user) => {
                if (err) {
                    this.setStatus(400);
                    return failedResponse('Refresh token không hợp lệ', 'RefreshTokenInvalid');
                }

                const accessToken = jwt.sign({ email: "haha" }, process.env.JWT_SECRET as Secret, { expiresIn: '45m' });
                const refreshToken = jwt.sign({ email: "HAHA" }, process.env.JWT_REFRESH_TOKEN as Secret, { expiresIn: '7d' });
                return successResponse({ accessToken, refreshToken });
            })
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    // get user info
    @Post('getuserinfo')
    public async getUserInfo(@Body() data: IAccessTokenReq) : Promise<IUserProfile | any>{
        try {
            const { accessToken } = data;
            
            if(!accessToken){
                this.setStatus(400);
                return failedResponse('Access token không tồn tại', 'AccessTokenNotFound');
            }
            const userInfo = await User.getUserProfile(accessToken);
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            userInfo as IUserProfile;
            const result = {
                email: userInfo.email,
                name: userInfo.name,
                address: userInfo.address,
                positionId: userInfo.positionId,
                facilityId: userInfo.facilityId,
                createdAt: userInfo.createdAt,
                updatedAt: userInfo.updatedAt
            }
            return successResponse(result);
            
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    
    }

    //get profile user by token in header
    @Security('jwt')
    @Get('profile')
    public async getProfile(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }

            userInfo as IUserProfile;
            const result = {
                email: userInfo.email,
                name: userInfo.name,
                phone: userInfo.phone,
                address: userInfo.address,
                positionId: userInfo.positionId,
                facilityId: userInfo.facilityId,
                createdAt: userInfo.createdAt,
                updatedAt: userInfo.updatedAt
            }
            return successResponse(result);
        } catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    //update profile
    @Security('jwt')
    @Put('profile')
    public async updateProfile(@Request() request: any, @Body() data: IUserUpdateProfile): Promise<any> {

        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            userInfo as IUser;
            const { name, phone, address, facilityId, positionId } = data;
            const user = await User.findOne({
                email: userInfo.email
            });
            
            if(!user){
                this.setStatus(400);
                return failedResponse('User không tồn tại', 'UserNotExist');
            }
            console.log(user);
            if(!name || !phone || !address || !facilityId || !positionId){
                this.setStatus(400);
                return failedResponse('Các trường không được để trống', 'FieldEmpty');
            }
            //check facilityId not in database
            const facility = await Facility.findOne({
                id: facilityId
            });
            if(!facility){
                this.setStatus(400);
                return failedResponse('Facility không tồn tại', 'FacilityNotExist');
            }
            //check PositionId not in database
            const position = await Position.findOne({
                id: positionId
            });
            if(!position){
                this.setStatus(400);
                return failedResponse('Position không tồn tại', 'PositionNotExist');
            }
            
            user.name = name;
            user.phone = phone;
            user.address = address;
            user.facilityId = facilityId;
            user.positionId = positionId;
            user.updatedAt = new Date()
            user.save()
            return successResponse(user);
        } catch (error) {

            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

    //change password
    @Security('jwt')
    @Put('changepassword')
    public async changePassword(@Request() request: any, @Body() data: IUserUpdatePassword): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            userInfo as IUser;
            const { oldPassword, newPassword, confirmPassword } = data;
            const user = await User.findOne({
                email: userInfo.email
            });

            if(!user){
                this.setStatus(400);
                return failedResponse('User không tồn tại', 'UserNotExist');
            }
            if(!oldPassword || !newPassword){
                this.setStatus(400);
                return failedResponse('Các trường không được để trống', 'FieldEmpty');
            }
            if (newPassword != confirmPassword){
                this.setStatus(400);
                return failedResponse('Mật khẩu mới không khớp', 'PasswordNotMatch');   
            }
            user.password = newPassword;
            user.updatedAt = new Date()
            user.save();
            return successResponse(user);
        }
        catch (error) {
            this.setStatus(500);
            return failedResponse(`Caught error ${error}`, 'ServiceException');
        }
    }

                
            
        

}

