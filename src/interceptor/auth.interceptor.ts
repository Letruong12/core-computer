import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpErrorResponse, HttpClient
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/api-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    private isRefreshing = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    constructor(private auth: AuthService, private http: HttpClient, private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.auth.token;
        let authReq = req;

        if (token) {
                authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
            }

            return next.handle(authReq).pipe(
            catchError(error => {
                if (error instanceof HttpErrorResponse && error.status === 401) {
                    return this.handle401Error(authReq, next);
                }
                if (error instanceof HttpErrorResponse && error.status === 403) {
                    this.auth.logout();
                    this.router.navigate(['/login']);
                }
                return throwError(() => error);
            })
        );
    }

    private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.auth.refreshToken().pipe(
                switchMap((res: any) => {
                const newToken = this.auth.token;
                this.isRefreshing = false;
                this.refreshTokenSubject.next(newToken);

                const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
                return next.handle(newReq);
                }),
                catchError(err => {
                this.isRefreshing = false;
                this.auth.logout();
                this.router.navigate(['/login']);
                return throwError(() => err);
                })
            );

            } else {
            // 🔥 Queue request: đợi refresh token xong mới retry
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    const newReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
                    return next.handle(newReq);
                })
            );
        }
    }
}
