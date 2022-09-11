import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/authentication/services/auth.service';

const url = environment.url;

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private auth: AuthService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Redirect to the api server (In production)
    if (request.url.startsWith('/api')) {
      request = request.clone({
        url: url + request.url
      });
    }
    // Adding a token to the request (JWT Token)
    if (this.auth.token()) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.token()}`
        }
      });
    }
    return next.handle(request);
  }
}
