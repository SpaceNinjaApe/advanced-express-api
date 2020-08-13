import { PropertyDescription } from './property-description';

export class ObjectDescription {

    type: Object;
    propertyDescriptions: PropertyDescription[];

    constructor(
        type: Object
    ) {
        this.type = type;
        this.propertyDescriptions = [];
    }

    getTypeName(): string {
        return this.type.constructor.name;
    }

    /**
     * Finds a PropertyDescription for a propertyname. Returns undefined if nothing is found.
     * @param propertyName property to search for
     */
    public findDescriptionFor(propertyName: string) : PropertyDescription | undefined {
        return this.propertyDescriptions.find((propertyDescription) => {
            return propertyDescription.propertyName === propertyName
        })
    }

    /**
     *  Determine if the described object has own properties.
     */
    isComplex(): boolean {
        switch(this.type.constructor.name) {

            case "Number":
            case "String":
            case "Boolean":
            case "Undefined":
                return false;
            default:
                return true;
        }
    }


}