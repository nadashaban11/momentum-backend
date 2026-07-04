import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type Payload = {
    id: string; 
    username: string;
    email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('SECRET')!,
        });
    }

    validate(payload: Payload) {
        return{
            id: payload.id,
            username: payload.username,
            email: payload.email,
        };
    }
    
}