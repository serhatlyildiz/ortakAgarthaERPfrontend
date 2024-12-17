export interface ProductStockAddDto {
    ProductDetailsId: number;
    ProductId: number;
    ProductStocksId: number;
    ProductColorId: number;
    ProductSize: string;
    Status: boolean;
    ProductCode: string;
    UnitsInStock: number;
    Images: string[];
  }