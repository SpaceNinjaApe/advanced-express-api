import { ObjectDescription } from './object-description';
export class PropertyDescription {

    propertyName: string;
    description: ObjectDescription;
    essential: boolean;

    constructor(
        propertyName: string,
        description: ObjectDescription,
        essential?: boolean
    ) {
        this.propertyName = propertyName;
        this.description = description;
        this.essential = (essential === undefined) ? false : essential;
    }
}