import { Controller, Get, Post, Put, Delete, Route, Tags, Body, Security, Path } from "tsoa";
import { ISetOfQuestions } from './setOfQuestions.types';
import { successResponse, failedResponse } from "../../utils/http";

import SetOfQuestions from './setOfQuestions.model';

@Route("setOfQuestions")
@Tags("SetOfQuestions")
export class SetOfQuestionsController extends Controller {
    
    @Post()
    public async createSetOfQuestions(@Body() data: ISetOfQuestions): Promise<any> {
        try {
            const result = await new SetOfQuestions(data).save();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    //* Get all setOfQuestions
    @Get()
    public async getSetOfQuestions(): Promise<any> {
        try {
            const result = await SetOfQuestions.find();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return  failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    //* Update setOfQuestions
    @Put("{id}")
    public async updateSetOfQuestions(@Body() data: ISetOfQuestions, @Path() id: string): Promise<any> {
        try {
            const result = await SetOfQuestions.findByIdAndUpdate(id, data)
            return  successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return  failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    //* Delete setOfQuestions
    @Delete("{id}")
    public async deleteSetOfQuestions(@Path() id: string): Promise<any> {
        try {
            const result = await SetOfQuestions.findByIdAndDelete(id);
            return  successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return  failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

}



