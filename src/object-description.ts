import { PropertyDescription } from "./property-description";

export class ObjectDescription {

    className: string;
    classConstructor: Function;
    propertyDescriptions: PropertyDescription[];

    constructor(
        type: Object
    ) {
        this.classConstructor = type.constructor
        this.className = type.constructor.name;
        this.propertyDescriptions = [];
    }


    /**
     * Finds a PropertyDescription for a propertyname. Returns undefined if nothing is found.
     * @param propertyName property to search for
     */

    public findPropertyDescriptionFor(propertyName: string) : PropertyDescription | undefined {
        return this.propertyDescriptions.find((propertyDescription) => {
            return propertyDescription.name === propertyName
        })
    }


}