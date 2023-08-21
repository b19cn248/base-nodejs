export interface IProduct {
    name: string;
    price: number;
    description: string;
    available: boolean;
    rating: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    category: string;
}

export interface IProductDTO {
    id: string,
    name: string;
    price: number;
    description: string;
    available: boolean;
    rating: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    category: string;
}

