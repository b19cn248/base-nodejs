//write a controller like 'book.controller.ts' and import it in 'app.ts' file
import { Controller, Get, Route, Tags, Post, Body, Path, Put, Delete } from 'tsoa';

import { IProduct } from './product.types';
// import ProductService from './product.service';
import Product from './product.model';
import { failedResponse, instanceOfFailedResponseType, successResponse } from "../../utils/http";


@Route('products')
@Tags('Product')
export class ProductController extends Controller {

    /**
     * Get all products
     */
    @Get()
    public async getProducts(): Promise<IProduct[]> {
        try {
            const products = await Product.find();
            return products;
        }
        catch (err) {
            this.setStatus(500);
            return err;
        }
    }

    @Get('{id}')
    public async getProduct(@Path() id: string): Promise<any> {
        try {
            const product = await Product.findById(id);
            return successResponse(product);
        }
        catch (err) {
            this.setStatus(500);
            return err;
        }
    }

    @Post()
    public async createProduct(@Body() data: IProduct): Promise<any> {
        try {
            const product = await new Product(data).save();
            return successResponse(product);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Put('{id}')
    public async updateProduct(@Path() id: string, @Body() data: IProduct): Promise<any> {
        try {
            const product = await Product.findByIdAndUpdate(id, data, { new: true });
            return successResponse(product);
        }
        catch (err) {
            this.setStatus(500);
            return failedResponse('Execute service went wrong', 'ServiceException');
        }
    }

    @Delete('{id}')
    public async deleteProduct(@Path() id: string): Promise<any> {
        try {
            const product = await Product.findByIdAndDelete(id);
            return failedResponse('Product deleted successfully', 'ProductDeleted');
        }
        catch (err) {
            this.setStatus(500);
            return err;
        }
    }

}

