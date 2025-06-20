import { Body, Injectable, NestMiddleware, Res } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`${req.method} ${req.originalUrl}`);
        next();
    }

}

@Injectable()
export class createSession implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.cookie('userName', req.body.username, {
            httpOnly: true
        })
        next();
    }
}

@Injectable()
export class terminateSession implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.clearCookie("userName")
        next();
    }
}

