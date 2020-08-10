import { ObjectDescription } from "./object-description";
import { PropertyDescription } from "./property-description";
import { PropertyDescriptionError } from "./property-description.error";
import { PropertyDescriptionErrorType } from "./property-description-error-type.enum";

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
            return objectDescription.className === className
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
        propertyType: string,
        essential?: boolean
    ) {
        // If one of the parameters is undefined or invalid throw an error.
        if (type === undefined
        || propertyName === undefined || propertyName === ""
        || propertyType === undefined|| propertyType === ""
        ) {
            throw new Error('createPropertyDescription() got invalid parameters');
        }

        // Find the matching object description
        let existingObjectDescription: ObjectDescription | undefined = this.findObjectDescriptionFor(type.constructor.name);

        // If nothing was found, create a new description and add it to the records.
        if (existingObjectDescription === undefined) {
            existingObjectDescription = new ObjectDescription(type);
            this.objectDescriptions.push(existingObjectDescription);
        }

        // Find the matching property description
        let existingPropertyDescription: PropertyDescription | undefined = existingObjectDescription.findPropertyDescriptionFor(propertyName);

        // If it already exists, don't add it to the records and print a warning.
        if (existingPropertyDescription) {
            console.warn(`Duplicate property description: ${type.constructor.name}.${propertyName} will not be validated`);
        } else {
            existingPropertyDescription = new PropertyDescription(propertyName, propertyType, essential);
            existingObjectDescription.propertyDescriptions.push(existingPropertyDescription);
        }
    }


    /**
     * Creates a instance of the expectedType out with all the attributes of the Anonymous object
     * @param obj Anonymous Object
     * @param expectedType The prototype of the expected Object.
     */

    public createExpectedTypeFromAnonymousObject(obj: any, expectedType: Object): any {
        let temp: any = Object.create(expectedType);
        let objectDescription: ObjectDescription | undefined = this.findObjectDescriptionFor(expectedType.constructor.name);

        let attrWasSet: boolean;

        // go for every attr in the anonymous Object
        for(let attr in obj) {
            attrWasSet = false;

            if (objectDescription) {
                let propertyDescription: PropertyDescription | undefined = objectDescription.findPropertyDescriptionFor((attr));

                if (propertyDescription) {
                    /* check if this attr is a complex Object we know about */
                    let complexPropertyDescription: ObjectDescription | undefined = this.findObjectDescriptionFor(propertyDescription.type);
                    if (complexPropertyDescription) {
                        /* if we know about this type we can initilize it aswell */
                        temp[attr] = this.createExpectedTypeFromAnonymousObject(obj[attr], complexPropertyDescription.classConstructor.prototype);
                        attrWasSet = true;
                    }
                }
            }
            /* if object was not a complex one, or we simply dont know what it might be just set the attribute */
            if (!attrWasSet) {
                temp[attr] = obj[attr]
            }
        }
        /* temp is now initilized if we know about this kind of type */
        return temp;
    }

    /**
     * 
     * @param obj 
     * @param expectedType 
     */
    public createAndValidate<t>(obj: any, expectedType: Object): t {

        if (obj === undefined) {
            throw new PropertyDescriptionError(PropertyDescriptionErrorType.object_undefined)
        }
        
        let temp: t = this.createExpectedTypeFromAnonymousObject(obj, expectedType);
        let objectDescription: ObjectDescription | undefined = this.findObjectDescriptionFor(expectedType.constructor.name)

        if (!objectDescription) {
            console.warn(`No objectdescription found for ${expectedType.constructor.name}. No validation!`)
        } else {
            objectDescription.propertyDescriptions.forEach((propertyDescription) => {
                this.isValid((temp as any)[propertyDescription.name], propertyDescription)
            })
        }
        return temp;

    }

    /**
     * Checks if a given property meets the given described requirements. Throws error if not. 
     * @param property Property to be checked (actual value)
     * @param propertyDescription Described requirements.
     */
    private isValid(property: any, propertyDescription: PropertyDescription): boolean {

        /* Throw error if undefined but expected to be defined*/
        if (property === undefined && propertyDescription.essential === false) {
            throw new PropertyDescriptionError(
                PropertyDescriptionErrorType.property_unexpected_undefined,
                `Expected ${propertyDescription.name} to be defined but was undefined`
            )
        }

        /* get string representation of property, depending on complexitivity */
        let acutalType: string = (typeof property === "object" ) ? property.constructor.name : typeof property;
        
        /* simple types difference Number-number String-string etc.*/
        acutalType = acutalType.toLowerCase();
        propertyDescription.type = propertyDescription.type.toLowerCase();
        
        if (acutalType !== propertyDescription.type) {
            throw new PropertyDescriptionError(
                PropertyDescriptionErrorType.property_unexpected_type,
                `Expected ${propertyDescription.name} to be type of ${propertyDescription.type} but was ${acutalType}`
            )
        }

        let isComplexObject: ObjectDescription | undefined =  this.findObjectDescriptionFor(propertyDescription.type); 

        /* If property is a complex object we know about, check those attributes of that complex attribute aswell */
        if (isComplexObject) {
            isComplexObject.propertyDescriptions.forEach((propertyDescription2) => {
                this.isValid((property as any)[propertyDescription2.name], propertyDescription2)
            })
        }
        return true;
    
    }


}