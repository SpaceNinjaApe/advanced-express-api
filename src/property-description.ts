export class PropertyDescription {

    name: string;
    type: string;
    essential: boolean;

    constructor(
        name: string,
        type: string,
        essential?: boolean
    ) {
        this.name = name;
        this.type = type;
        this.essential = (essential === undefined) ? false : essential;
    }
}