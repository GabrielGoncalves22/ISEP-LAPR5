import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './authentication/auth.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getToken();

        if (token) {
            const cloned = req.clone({ headers: req.headers.set("Authorization", "Bearer " + token) });
            return next.handle(cloned);
        } else {
            return next.handle(req);
        }
    }
}