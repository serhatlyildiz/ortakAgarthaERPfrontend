export interface ProductStatusHistoryModel {
    historyId: number;
    productStockId: number;
    productId: number;
    productDetailsId: number;
    status: boolean;
    changedBy: number;
    productCode: string;
    changedByFirstName: string;
    changedByLastName: string;
    email: string;
    changeDate: Date;
    operations: string;
    remarks?: string; // Nullable alan
}
