import { requestAttribute } from '../src/request-validator/request-description.decorator';
export class OrderRequest {

    @requestAttribute(true)
    public product: string;
    
    @requestAttribute(false)
    public amount: number;

}