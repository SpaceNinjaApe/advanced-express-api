import { propertyDescription } from "src/property-validator/property-description.decorator";

export class Product {

    @propertyDescription(true)
    name: string;

    @propertyDescription(true)
    cost: number | number[];
    
}