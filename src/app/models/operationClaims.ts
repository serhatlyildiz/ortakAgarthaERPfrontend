export interface OperationClaim {
    id: number;
    name: string;
  }
  
  export interface OperationClaimsResponse {
    data: OperationClaim[];
    success: boolean;
    message: string;
  }