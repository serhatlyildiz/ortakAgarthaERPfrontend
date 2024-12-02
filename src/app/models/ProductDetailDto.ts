export interface ProductDetailDto {
    productId: number;
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
