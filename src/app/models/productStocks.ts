export interface ProductStocks{
    productStocksId:number;
    productId:number;
    productColorId:number;
    productSize:string;
    unitsInStock:number;
    images: string[];
    status: boolean;
}