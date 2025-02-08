export class BaseResponse {
    message: string;
    data?: any;
    error?: Error;

    constructor(message: string, data?: any, error?: Error) {
        this.message = message;
        this.data = data;
        this.error = error;
    }
}