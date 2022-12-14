import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AdminService } from './services/admin.service';

@Injectable()
export class BearerInterceptor implements HttpInterceptor {

  corsOn:boolean = false;

  constructor(
    public adminService: AdminService,
    @Inject('BASE_URL') private readonly baseUrl: string
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (this.corsOn == true){
      if ((request.url.includes('authenticate') || request.url.includes('logout') || request.url.includes('create'))){
        return next.handle(request);
      }else{
        let token = this.adminService.getToken();
  
        const requestClone = request.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
          url: `${request.url}`,
        });
  
        return next
          .handle(requestClone)
          .pipe(tap(null, error => this.handleError(error)));
      }
    }else{
      return next.handle(request);
    }
    
  }

  handleError(err: HttpErrorResponse) {
		switch (err.status) {
			case 408:
				console.error(`Server was disconnected unexpectedly.`);
				break;
			default:
				console.log('Other error: ', err.message);
		}
	}
}
