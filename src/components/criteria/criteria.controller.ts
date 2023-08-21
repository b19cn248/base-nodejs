import { Controller, Get, Post, Put, Delete, Route, Tags, Body, Security, Path } from "tsoa";
import {ICriteria} from './criteria.types';
import Criteria from './criteria.model';
import { successResponse, failedResponse } from "../../utils/http";

@Route("criteria")
@Tags("Criteria")
export class CriteriaController extends Controller {

    //* Create criteria
    @Post()
    public async createCriteria(@Body() data: ICriteria): Promise<any> {
        try{
            const result = await new Criteria(data).save();
            return successResponse(result);
        }
        catch (err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    //* Get all criteria
    @Get()
    public async getCriteria(): Promise<any> {
        try{
            const result = await Criteria.find();
            return successResponse(result);
        }
        catch (err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    //* Update criteria
    @Put("{id}")
    public async updateCriteria(@Body() data: ICriteria, @Path() id: string): Promise<any> {
        try{
            const result = await Criteria.findByIdAndUpdate(id, data)
            return successResponse(result);
        }
        catch (err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    //* Delete criteria
    /**
     * @param id
     * @returns
     * @memberof CriteriaController
     * @description
     * 1. Delete criteria
     * */
    @Delete("{id}")
    public async deleteCriteria(@Path() id: string): Promise<any> {
        try{
            const result = await Criteria.findByIdAndDelete(id);
            return successResponse(result);
        }
        catch (err){
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}