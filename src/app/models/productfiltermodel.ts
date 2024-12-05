export interface ProductFilterModel {
  productName: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  minStock: number | null;
  maxStock: number | null;
  colorName: string | null;
  productSize: string | null;
  superCategoryName: string | null;
  categoryName: string | null;
  status: boolean | null;
}
