export class APIError extends Error {
    message: string;
    code: Number = 0;

    constructor(message: string, code: Number = 0) {
        super(message);
        this.message = message;
        this.code = code;
    }
}
