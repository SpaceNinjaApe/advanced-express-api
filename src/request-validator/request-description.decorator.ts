import "reflect-metadata";
import { RequestValidatorService } from './request-validator.service';

/**
 * Decorator Factory for the request validation. If this object will be checked in the service a given, anonymous object will be type checked.
 * @param isAttributeEsentialsets Sets if this attribute should be set at all times. If so, a check will not just check the type but throw an error if undefined.
 */
export function requestAttribute (isAttributeEsential?: boolean): PropertyDecorator {
    let essential: boolean;

    if (isAttributeEsential === undefined) {
        essential = false;
    }  else {
        essential = isAttributeEsential;
    }
    
    return function (target: Object, propertyKey: string | symbol) {
        let type: string = Reflect.getMetadata("design:type", target, propertyKey).name;
        RequestValidatorService.getInstance().registerDescription(target.constructor.name, propertyKey as string, type.toLowerCase(), essential)
    }
}