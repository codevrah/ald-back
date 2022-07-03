import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Observable} from "rxjs";
import * as geoip from "geoip-lite"

@Injectable()
export class CubaOnlyGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const country = geoip.lookup(request.ip).country;
        return country == "CU";
    }
}