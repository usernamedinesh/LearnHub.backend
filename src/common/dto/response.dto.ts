//src/common/dto/response.dto.ts

export class ResponseDto<T> {
  status: string;
  data: T;
  message: string;
  error?: any;

  constructor(status: string, data: T, message?: string, error?: any) {
    this.status = status;
    this.data = data;
    this.message = message;
    this.error = error;
  }
}
