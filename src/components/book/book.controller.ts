// // src/users/usersController.ts
// import { Controller, Route, Tags, Post, Body, Get, Path, Security, } from "tsoa";
// import { IBook } from "./book.types";
// import { BookCreationParams, BooksService } from "./book.services";
// import Book from "./book.model";
// import { failedResponse, instanceOfFailedResponseType, successResponse } from "../../utils/http";

// @Route("books")
// @Tags("Books")
// export class BooksController extends Controller {
//     @Get("{id}")
//     public async getBook(@Path() id: string): Promise<any> {
//         try {
//             const result = await Book.findById(id);
//             return successResponse(result);
//         }
//         catch (err) {
//             this.setStatus(500);
//             return failedResponse('Execute service went wrong', 'ServiceException');
//         }
//     }

//     @Security('jwt')
//     @Post()
//     public async createBook(@Body() data: IBook,): Promise<any> {
//         try {
//             const result = await new Book(data).save();
//             return successResponse(result);
//         }
//         catch (err) {
//             this.setStatus(500);
//             return failedResponse('Execute service went wrong', 'ServiceException');
//         }
//     }

//     @Security('jwt')
//     @Get()
//     public async getAllBooks(): Promise<any> {
//         try {
//             const result = await Book.find();
//             return successResponse(result);
//         }
//         catch (err) {
//             this.setStatus(500);
//             return failedResponse('Execute service went wrong', 'ServiceException');
//         }
//     }

// }