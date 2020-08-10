import { PropertValidatorService } from "./property-validator.service";


import "reflect-metadata";

export function propertyDescription(isPropertyEssential?:boolean): any {

    isPropertyEssential = (isPropertyEssential === undefined) ? false : isPropertyEssential;


    return function (target : Object, key : string) {
        let type: string = Reflect.getMetadata("design:type", target, key).name;
        PropertValidatorService.getInstance().createPropertyDescription(target, key, type, isPropertyEssential)
    }
}