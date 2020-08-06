export class RequestAttributeDescription {

    name: string;
    type: string;
    essential: boolean;

    constructor(
        name: string,
        type: string,
        essential: boolean
    ) {
        this.name = name;
        this.type = type;
        this.essential = essential;
        
    }


}