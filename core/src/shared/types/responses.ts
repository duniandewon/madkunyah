export type ServiceResponse<T = null> = 
  | SuccessResponse<T> 
  | FailureResponse<T>;

interface SuccessResponse<T> {
  success: true;
  message: string;
  responseObject: T;
  statusCode: number;
}

interface FailureResponse<T> {
  success: false;
  message: string;
  statusCode: number;
}
