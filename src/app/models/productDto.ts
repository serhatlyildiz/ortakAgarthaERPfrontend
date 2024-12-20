export interface productDto{
    productId: number;
    categoryId: number;
    superCategoryId: number;
    categoryName: string;
    superCategoryName: string;
    productName: string;
    productDescription: string;
    unitPrice: number;
    status: boolean;
    productCode: string;
    totalStock?: number;
}