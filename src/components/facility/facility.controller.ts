import { Controller, Route, Tags, Post, Body, Get, Path, Security, Put, Delete, } from "tsoa";
import Facility from "./facility.model";
import { IFacility } from "./facility.types";
import { successResponse, failedResponse } from "../../utils/http";

@Route("facilities")
@Tags("Facilities")
export class FacilitiesController extends Controller {
    // @Security('jwt')
    @Post()
    public async createFacility(@Body() data: IFacility,): Promise<any> {
        try {
            const result = await new Facility(data).save();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Get()
    public async getAllFacilities(): Promise<any> {
        try {
            const result = await Facility.find();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Put("{id}")
    public async updateFacility(@Path() id: string, @Body() data: IFacility): Promise<any> {
        try {
            const result = await Facility.findByIdAndUpdate(id, data,
                {
                    new: true,
                    runValidators: true
                });
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Delete("{id}")
    public async deleteFacility(@Path() id: string): Promise<any> {
        try {
            const result = await Facility.findByIdAndDelete(id);
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }


}