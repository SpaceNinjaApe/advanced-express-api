import { OrderRequest } from "example/order.object";
import { RestMethod } from "src/rest-handler/rest-method.enum";
import { RestHandlerService } from 'src/rest-handler/res-handler.service';
import { Response, Request } from "express";
import { PropertValidatorService } from 'src/property-validator/property-validator.service';
RestHandlerService.getInstance().setPermissionHook(
    (req,res,data) => {
        return new Promise<boolean>((resolve) => {
            // do some permission checking here
            resolve(true)
        })
    }
)

RestHandlerService.getInstance().registerRestHandler(
    RestMethod.POST,
    '/test',
    (req: Request, res: Response, data: OrderRequest) => {
        console.log("Recieved Order", data);
        res.sendStatus(200);
    },
    [], // no permission needed
    OrderRequest.prototype
)

let test: any = "string";

console.log(test instanceof String === false);


// PropertValidatorService.getInstance().objectDescriptions.forEach((objdesc) => {
//     console.log(objdesc.getTypeName())
//     objdesc.propertyDescriptions.forEach((propDesc) => {
//         console.log("=", propDesc.propertyName, propDesc.description.getTypeName())
//     })
// })