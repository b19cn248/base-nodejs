import {Get, Put, Post, Delete, Route, Tags, Body, Path, Controller, Security} from "tsoa";
import Question from "./question.model";
import {IQuestion} from "./question.types";
import {successResponse, failedResponse} from "../../utils/http";

@Route("questions")
@Tags("Questions")
export class QuestionsController extends Controller {
    
        @Post()
        public async createQuestion(@Body() data: IQuestion,): Promise<any> {
            try {
                const result = await new Question({...data, createdAt: new Date(), updatedAt: new Date()}).save();
                return successResponse(result);
            }
            catch (err) {
                this.setStatus(500);
                return failedResponse('Execute service went wrong', 'ServiceException');
            }
        }
    
        @Get()
        public async getAllQuestions(): Promise<any> {
            try {
                const result = await Question.find();
                return successResponse(result);
            }
            catch (err) {
                this.setStatus(500);
                return failedResponse('Execute service went wrong', 'ServiceException');
            }
        }

        /**
         * Get question by setQuestionId
         * @param setQuestionId
         * @returns {Promise<any>}
         */
        @Get("{setQuestionId}")
        public async getQuestionBySetQuestionId(@Path() setQuestionId: string): Promise<any> {
            try {
                const result = await Question.find({setQuestionId: setQuestionId});
                return successResponse(result);
            }
            catch (err) {
                this.setStatus(500);
                return failedResponse('Execute service went wrong', 'ServiceException');
            }
        }


        @Put("{id}")
        public async updateQuestion(@Path() id: string, @Body() data: IQuestion): Promise<any> {
            try {
                const result = await Question.findByIdAndUpdate(id, {...data, updatedAt: new Date()});
                return successResponse(result);
            }
            catch (err) {
                this.setStatus(500);
                return failedResponse('Execute service went wrong', 'ServiceException');
            }
        }

        @Delete("{id}")
        public async deleteQuestion(@Path() id: string): Promise<any> {
            try {
                const result = await Question.findByIdAndDelete(id);
                return successResponse(result);
            }
            catch (err) {
                this.setStatus(500);
                return failedResponse('Execute service went wrong', 'ServiceException');
            }
        }
    }