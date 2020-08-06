import { OrderRequest } from "./example/order.object";
import { RestMethod } from "./src/rest-handler/rest-method.enum";
import { RestHandlerService } from './src/rest-handler/res-handler.service';
import { Response, Request } from "express";

RestHandlerService.getInstance().setPermissionHook(
    (req,res,data) => {
        return new Promise<boolean>((resolve) => {
            // do some permission checking here
            resolve(false)
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