import Express, { Request, Response } from 'express';
import BodyParser from 'body-parser';
import { RestMethod } from './rest-method.enum';
import { RequestValidatorService } from '../request-validator/request-validator.service';
import { RequestValidatorError } from '../request-validator/request-validator.error';

export class RestHandlerService {

    /* Singelton Service */
    static instance: RestHandlerService;

    /* Singelton Service */
    static getInstance(): RestHandlerService {
        if (RestHandlerService.instance === undefined) {
            RestHandlerService.instance = new RestHandlerService();
        }
        return RestHandlerService.instance;
    }
    /* Express instance */
    private express: Express.Application;

    /* Permission hook should be set */
    private permissionHook: (req: Request, res: Response, neededPermission: any[]) => Promise<boolean>;
    
    constructor() {
        this.express = Express();
        this.express.use(BodyParser.json())
        this.express.listen(9000, 'localhost.org');

    }

    /**
     * Sets Permission hook that will check every call.
     * @param permissionHook Function that should return true if the request is allowed.
     */
    public setPermissionHook(permissionHook: (req: Request, res: Response, data?: any) => Promise<boolean>) {
        this.permissionHook = permissionHook;
    }

    /**
     * Gereates a Resthandler.
     * @param restMethod HTTP-Method of this Ressource
     * @param route Name of the route example: '/foo/bar' 
     * @param cb Callback to execute after a request is recieved on the route
     * @param neededPermission Array with the needed Permissions that are requiered. Will be checked by the permission hook
     * @param expectedDataType Expected type of the Request-Body. The data which will eventually be given to the callback will have this type.
     */
    public registerRestHandler(
        restMethod: RestMethod,
        route: string,
        cb: (req: Request, res: Response, data?: any) => any,
        neededPermission: any[],
        expectedDataType?: object
    ) {
        this.express[restMethod](
            route, 
            async (req,res) => {
                let data: any;
                if (restMethod !== RestMethod.GET && expectedDataType !== undefined) {
                    data = this.readDataIntoObject(req.body, expectedDataType);
                    try {
                        if (this.permissionHook && await this.permissionHook(req,res, neededPermission) || this.permissionHook === undefined && true) {
                            RequestValidatorService.getInstance().validateRequest(data);
                            cb(req,res,data);
                        } else {
                            res.send(401);
                        }
                    } catch (error) {
                        if (error instanceof RequestValidatorError) {
                            res.send(error.message);
                        } else {
                            res.send(200);
                            console.warn('Uncatched error from CB');
                        }
                    }
                } else {
                    cb(req,res);
                }
            }    
        )
    }

    private readDataIntoObject<t>(data: any, exptectedPrototype: Object): t {

        let tempObject:any = Object.create(exptectedPrototype);
    
        for(let key in data) {
            tempObject[key] = data[key];
        }
        return tempObject;
    }


}