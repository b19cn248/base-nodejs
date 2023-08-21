import { Get, Put, Post, Delete, Route, Tags, Body, Path, Controller, Security, Request } from "tsoa";
import Result from "./result.model";

import { IResult, IResultDTO } from "./result.types";
import { successResponse, failedResponse, instanceOfFailedResponseType } from "../../utils/http";
import User from "../user/user.model";
import { IUser } from "@components/user/user.types";

@Route("results")
@Tags("Results")
export class ResultsController extends Controller {

    @Security("jwt")
    @Post()
    public async createResult(@Body() data: IResultDTO, @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if (!userInfo) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            const dtoData: IResult = {
                total: data.total,
                userId: userInfo._id,
                createdAt: new Date()
            }
            const result = await new Result(dtoData).save();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }


    //get result by user jwt 
    @Security("jwt")
    @Get()
    public async getResult(@Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if (!userInfo) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            console.log(userInfo._id);
            const result = await Result.find({userId: userInfo._id});
            return successResponse(result);
            
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
  

    // @Put("{id}")
    // public async updateResult(@Path() id: string, @Body() data: IResult): Promise<any> {
    //     try {
    //         const result = await Result.findByIdAndUpdate(id, data,)
    //         return successResponse(result);
    //     }
    //     catch (err) {
    //         this.setStatus(500);
    //         return failedResponse('Execute service went wrong', 'ServiceException');
    //     }
    // }

    @Security("jwt")
    @Delete("{id}")
    public async deleteResult(@Path() id: string, @Request() request: any): Promise<any> {
        try {
            const token = request.headers.authorization.split(' ')[1];
            const userInfo = await User.getUserProfile(token);
            if (!userInfo) {
                this.setStatus(401);
                return failedResponse('Unauthorized', 'Unauthorized');
            }
            if(instanceOfFailedResponseType<IUser>(userInfo)){
                this.setStatus(400);
                return userInfo;
            }
            console.log(userInfo._id);
            const listResult = await Result.find({userId: userInfo._id});
            var check : boolean = false;
            for (let i = 0; i < listResult.length; i++) {
                if (listResult[i]._id == id) {
                    check = true;
                    break;
                }
            }
            if (!check) {
                this.setStatus(401);
                return failedResponse('Fail', 'Ko co quyen xoa');
            }
                
            const result = await Result.findByIdAndDelete(id);
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}
