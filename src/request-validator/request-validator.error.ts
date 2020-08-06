import { RequestValidatorErrorType } from './request-validator-error-type.enum';
export class RequestValidatorError extends Error {

    type: RequestValidatorErrorType;
    
    constructor(
        type: RequestValidatorErrorType,
        message: string
    ) {
        super(message);
        this.type = type;
    }



}