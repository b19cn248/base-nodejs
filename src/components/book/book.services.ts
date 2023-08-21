// src/users/usersService.ts
import { IBook } from "./book.types";

// A post request should not contain an id.
export type BookCreationParams = Pick<IBook, "name" | "author" | "description">;

export class BooksService {
    public get(id: number, name?: string): IBook {
        return {
            name: name ?? "Jane Doe",
            author:  "Jane Doe",
            price: 0,
            status: "Happy",
            description:"Jane Doe",
        };
    }

    public create(bookCreationParams: BookCreationParams): IBook {
        return {
            status: "Happy",
            price: 0,
            ...bookCreationParams,
        };
    }
}
