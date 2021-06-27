import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {map} from 'rxjs/operators';

type NewType = Observable<boolean | UrlTree>;

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const userLoggedIn = this.authService.isLoggedIn();
    if (userLoggedIn) {
      return true
    } else {
      return this.router.navigate(['login'], {
        queryParams: {returnUrl: state.url},
      });
    }
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): NewType | Promise<boolean | UrlTree> | boolean | UrlTree {
    const userLoggedIn = this.authService.isLoggedIn();
    if (userLoggedIn) {
      return true;
    } else {
      return this.router.navigate(['/auth']);
    }
    // return true;
  }

}
