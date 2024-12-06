export interface ProductDetailDto {
    productDetailsId: number;
    productId: number;
    colorId: number;
    productStocksId: number;
    superCategoryId: number;
    categoryId: number;
    productName: string;
    superCategoryName: string;
    categoryName: string;
    productDescription: string;
    unitPrice: number;
    unitsInStock: number;
    colorName: string;
    productSize: string;
    images: string[];
    status: boolean;
  }

