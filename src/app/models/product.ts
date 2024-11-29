export interface Product{
    productId:number;
    categoryId:number;
    productName:string;
    productDescription:string;
    images: string[];
    unitPrice:number;
    IsActive: boolean;
}