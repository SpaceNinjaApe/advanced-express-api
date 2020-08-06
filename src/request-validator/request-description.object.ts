import { RequestAttributeDescription } from './request-attribute-description';

export class RequestDescription {

    public className: string;
    private _attributes: RequestAttributeDescription[];

    get attributes(): RequestAttributeDescription[] {
        return this._attributes
    }

    constructor(
        className: string
    ) {
        this.className = className;
        this._attributes = [];
    }

    /**
     * Gets a description for a attributename
     * @param attributeName attributename to search for
     */
    getAttributeDescriptionFor(attributeName: string): RequestAttributeDescription |undefined{
        return this._attributes.find((attributeDescription) => {
            return attributeName === attributeDescription.name
        })
    }

    /**
     * Registers a new attributedescription for this requestdescription. If there is a duplicate already it will print a warning to console.
     * @param newAttributeDescription Description to add to the record.
     */
    registerNewAttributeDescription(newAttributeDescription: RequestAttributeDescription) {
        let existing: RequestAttributeDescription | undefined = this._attributes.find((attributeDescription) => {
            return attributeDescription.name === newAttributeDescription.name;
        })
        if (!existing) {
            this._attributes.push(newAttributeDescription);
        } else {
            console.warn(`Redundand requestdescription detected ${this.className}.${existing.name}`);
        }

    }



}