export interface ProductDetailDto {
    productStockId: number;
    productId: number;
    categoryId: number;
    superCategoryId: number;
    colorId: number;
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

