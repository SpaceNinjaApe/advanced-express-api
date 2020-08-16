
import { Product } from './product.object';
import { propertyDescription } from '../src/property-validator/property-description.decorator';

export class OrderRequest {

    @propertyDescription(true)
    public product: Product;
    
    @propertyDescription(false)
    public amount: number;

}