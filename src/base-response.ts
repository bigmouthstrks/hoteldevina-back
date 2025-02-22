import { APIError } from './api-error';
export class BaseResponse {
    message: string;
    data?: any;
    error?: APIError;

    constructor(message: string, data?: any, error?: APIError) {
        this.message = message;
        this.data = data;
        this.error = error;

        if (error) {
            this.log(error);
        }
    }

    log(error: APIError): void {
        if (error.code) {
            console.log('Error code: ', error.code);
        }
        if (error.message) {
            console.log('Error message: ', error.message);
        }
    }
}
