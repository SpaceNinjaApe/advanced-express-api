import { RequestDescription } from './request-description.object';
import { RequestAttributeDescription } from './request-attribute-description';
import { RequestValidatorErrorType } from './request-validator-error-type.enum';
import { RequestValidatorError } from './request-validator.error';

export class RequestValidatorService {

    /* Singelton */
    static instance: RequestValidatorService;

    /* Singelton */
    static getInstance(): RequestValidatorService {
        if(!RequestValidatorService.instance) {
            RequestValidatorService.instance = new RequestValidatorService();
        }
        return RequestValidatorService.instance;
    }

    // List of known descriptions
    private requestDescriptions: RequestDescription[];

    constructor() {
        this.requestDescriptions = [];
    }

    /**
     * Searches for an RequestDescription matching the given classname. Returns undefined if it is unknown.
     * @param className The classname for the RequestDescription
     */
    getDescriptionFor(className: string): RequestDescription | undefined {
        return this.requestDescriptions.find((requestDescription) => {
            return requestDescription.className === className
        })
    }


    /**
     * Registers a new description, prevents duplicates
     * @param className The name of the class
     * @param attributeName  The name of the attribute to describe
     * @param attributeType The type of the attribute
     * @param essential If essential true the Attribute can be undefined.
     */
    registerDescription(className: string, attributeName: string, attributeType: string, essential: boolean): void {
        // Search for an existing record
        let existingDescription: RequestDescription | undefined  = this.getDescriptionFor(className);

        // If no description can be found register a new one and add it to the records
        if (!existingDescription) {
            existingDescription = new RequestDescription(className);
            this.requestDescriptions.push(existingDescription);
        }
        
        // Create new attribute description
        let newAttributeDescription: RequestAttributeDescription = new RequestAttributeDescription(attributeName, attributeType, essential);

        // Add new attribute description to the record
        existingDescription.registerNewAttributeDescription(newAttributeDescription);
    }

    validateRequest<t extends Object>(requestObject: t) {
        if (requestObject !== undefined) {
            let description: RequestDescription | undefined = this.getDescriptionFor(requestObject.constructor.name);

            if (description) {

                description.attributes.forEach((attributeDescription) => {
                    if (attributeDescription.essential && (requestObject as any)[attributeDescription.name] === undefined) {
                        throw new RequestValidatorError(RequestValidatorErrorType.attributeUndefined, `Parameter ${attributeDescription.name} expected`);
                    }
                
                    if (attributeDescription.type !== typeof (requestObject as any)[attributeDescription.name] && (requestObject as any)[attributeDescription.name] !== undefined) {
                        throw new RequestValidatorError(RequestValidatorErrorType.attributeWrongType,  `Parameter ${attributeDescription.name} expected to be ${attributeDescription.type}`);
                    }
                })

            }
        } else {
            throw new RequestValidatorError(RequestValidatorErrorType.undefinedRequest, RequestValidatorErrorType.undefinedRequest);
        }
    }
}