 //Like facility controller, Position controller also has the same structure.
 import { Controller, Route, Tags, Post, Body, Get, Path, Security, Put, Delete, } from "tsoa";
import Position from "./position.model";
import { IPosition } from "./position.types";
import { successResponse, failedResponse } from "../../utils/http";

@Route("positions")
@Tags("Positions")
export class PositionsController extends Controller {

    @Post()
    public async createPosition(@Body() data: IPosition,): Promise<any> {
        try {
            const result = await new Position(data).save();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Get()
    public async getAllPositions(): Promise<any> {
        try {
            const result = await Position.find();
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Put("{id}")
    public async updatePosition(@Path() id: string, @Body() data: IPosition): Promise<any> {
        try {
            const result = await Position.findByIdAndUpdate(id, data,
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
    public async deletePosition(@Path() id: string): Promise<any> {
        try {
            const result = await Position.findByIdAndDelete(id);
            return successResponse(result);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }
}
