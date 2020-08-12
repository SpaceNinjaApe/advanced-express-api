import { PropertyDescriptionErrorType } from "./property-description-error-type.enum";

export class PropertyDescriptionError extends Error {

    type: PropertyDescriptionErrorType;

    constructor(
        type: PropertyDescriptionErrorType,
        message?: string
    ) {
        super();
        this.type = type;
        if (type === PropertyDescriptionErrorType.object_undefined) {
            this.message = 'Object was not expected to be undefined'
        }
         
        if (message) {
            this.message = message;
        };
    }

}