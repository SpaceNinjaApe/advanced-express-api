import { propertyDescription } from "src/property-validator/property-description.decorator";
import { Product } from './product.object';

export class OrderRequest {

    @propertyDescription(true)
    public product: Product;
    
    @propertyDescription(false)
    public amount: number;

}