import { PropertValidatorService } from "./property-validator.service";


import "reflect-metadata";

/**
 * Decorator used to describe properties of an object.
 * @param isPropertyEssential if true, validation will return false if this property is missing.
 */
export function propertyDescription(isPropertyEssential?:boolean): any {

    // if no value is given assume this property is not essential
    isPropertyEssential = (isPropertyEssential === undefined) ? false : isPropertyEssential;
    return function (target : Object, key : string) {
        let type = Reflect.getMetadata("design:type", target, key);
        PropertValidatorService.getInstance().createPropertyDescription(target, key, type.prototype, isPropertyEssential)
    }
}