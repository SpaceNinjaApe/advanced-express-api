import { ObjectDescription } from './object-description';
import { PropertyDescriptionError } from "./property-description.error";
import { PropertyDescriptionErrorType } from "./property-description-error-type.enum";
import { PropertyDescription } from './property-description';

export class PropertValidatorService {

    // Service is singelton
    static instance: PropertValidatorService;

    // Service is singelton
    static getInstance(): PropertValidatorService {

        if (PropertValidatorService.instance === undefined) {
            PropertValidatorService.instance = new PropertValidatorService();
        }

        return PropertValidatorService.instance;
    }

    objectDescriptions: ObjectDescription[];

    constructor() {
        this.objectDescriptions = [];
    }

    /**
     * Finds a Objectdescription for a given ClassName.
     * @param className ClassName to look up
     */
    public findObjectDescriptionFor(className: string): ObjectDescription | undefined {
        return this.objectDescriptions.find((objectDescription) => {
            return objectDescription.type.constructor.name === className
        })
    }

    /**
     * Creates a new PropertyDescription. If already exists prints a warning.
     * @param className Name of class to be described
     * @param propertyName Name of the property to be described
     * @param propertyType Type of the property
     * @param essential If set, the parameter will not only be typechecked but it will also be checked if its undefined.
     */
    public createPropertyDescription(
        type: Object,
        propertyName: string,
        propertyType: Object,
        essential?: boolean
    ) {
        // If one of the parameters is undefined or invalid throw an error.
        if (type === undefined
        || propertyName === undefined || propertyName === ""
        || propertyType === undefined|| propertyType === ""
        ) {
            throw new Error('createPropertyDescription() got invalid parameters');
        }

        this.createObjectDescription(type);
        if (propertyType) {
            this.createObjectDescription(propertyType);
        }
        // Find the matching object description
        let existingObjectDescription: ObjectDescription | undefined = this.findObjectDescriptionFor(type.constructor.name);
        if (existingObjectDescription) {
            // Find the matching property description
            let existingPropertyDescription: PropertyDescription | undefined = existingObjectDescription.findDescriptionFor(propertyName);
            let existingPropertyObjectDescription: ObjectDescription | undefined = this.findObjectDescriptionFor(propertyType.constructor.name);
            // If it already exists, don't add it to the records and print a warning.
            if (existingPropertyDescription) {
                console.warn(`Duplicate property description ${existingObjectDescription.type.constructor.name}.${propertyName} will be Ignored`);
            
            } else {
                if (existingPropertyObjectDescription === undefined) {
                    console.warn(`No Definition found for ${existingObjectDescription.type.constructor.name}.${propertyName}. It will be Ignored`);
                } else {
                    existingPropertyDescription = new PropertyDescription(propertyName, existingPropertyObjectDescription, essential);
                    existingObjectDescription.propertyDescriptions.push(existingPropertyDescription);
                }
            }
        }
    }

    /**
     * Creates an objectdescriptions, if it does not exists.
     * @param type objectType that should be described.
     */
    createObjectDescription(type: Object) {
        let existingObjectDescription: ObjectDescription | undefined;
        existingObjectDescription = this.findObjectDescriptionFor(type.constructor.name);
        if (existingObjectDescription === undefined) {
            existingObjectDescription = new ObjectDescription(type);
            this.objectDescriptions.push(existingObjectDescription);
        }
    }



    /**
     * Creates an instance of the expected type, fills the properties and validates them. Throws error if anonymous object
     * does not match the expected type. Returns the initilized Object.
     * @param obj Anonymous object.
     * @param expectedType Expected type of the anonymous object.
     */
    public createAndValidate<t>(obj: any, expectedType: Object): t {
        let initilized: any;
        let objectDescription: ObjectDescription | undefined = this.findObjectDescriptionFor(expectedType.constructor.name);
        if (objectDescription) {
            if (objectDescription && objectDescription.isComplex()) {
                initilized = Object.create(objectDescription.type.constructor.prototype);
            } else {
                initilized = obj;
            }
            if (objectDescription.isComplex()) {
                for (let attr in obj) {
                    if (objectDescription){
                        let propertyDescription: PropertyDescription | undefined = objectDescription.findDescriptionFor(attr);
                        if (propertyDescription) {
                            initilized[attr] = this.createAndValidate(obj[attr], propertyDescription.description.type)
                        } else {
                            initilized[attr] = obj[attr]
                        }
                    } else {
                        initilized[attr] = obj[attr]
                    }
                }
            }
            objectDescription.propertyDescriptions.forEach((propDesc) => {
                this.isValidProperty(initilized[propDesc.propertyName], propDesc);
            })
        } else {
            initilized = obj;
        }

        return initilized;

    }

    /**
     * Checks if a given property meets the given described requirements. Throws error if not. 
     * @param property Property to be checked (actual value)
     * @param propertyDescription Described requirements.
     */
    private isValidProperty(property: any, propertyDescription: PropertyDescription): boolean {
        /* Throw error if undefined but expected to be defined*/
        if (property === undefined && propertyDescription.essential === true) { 
            throw new PropertyDescriptionError(
                PropertyDescriptionErrorType.property_unexpected_undefined,
                `Expected ${propertyDescription.propertyName} to be defined but was undefined`
            )
        }


        return this.isValidObject(property, propertyDescription.description, propertyDescription.propertyName);
    
    }

    /**
     * Checks an given anonymous obj against the given description. Throws error if the definition does not match the object.
     * @param obj Anonymous Object
     * @param objDescription  Expected type
     * @param propertyName Name of the property this object will be stored in
     */
    private isValidObject(obj: any, objDescription: ObjectDescription, propertyName?: string): boolean {

        /* get string representation of obj, depending on complexitivity */
        let acutalType: string = (typeof obj === "object" ) ? obj.constructor.name : typeof obj;
        /* simple types difference Number-number String-string etc.*/
        if (acutalType.toLowerCase() !== objDescription.getTypeName().toLowerCase()) {
            if(propertyName) {
                throw new PropertyDescriptionError(
                    PropertyDescriptionErrorType.property_unexpected_type,
                    `Expected ${propertyName} to be type of ${objDescription.type.constructor.name} but was ${acutalType}`
                )
            } else {
                throw new PropertyDescriptionError(
                    PropertyDescriptionErrorType.property_unexpected_type,
                    `Expected ${objDescription.type.constructor.name} but got ${acutalType}`
                )
            }
            
        }

        return true;
    
    }


}