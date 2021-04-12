import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { map, tap, delay, finalize, switchMap } from 'rxjs/operators';
import { IUserId, IApplicationUser, INIT_APPLICATION_USER } from '../models/application-user';
import { environment } from 'src/environments/environment';

interface LoginResult {
  access: string;
  refresh: string;
}
interface UserDetailResult {
  id: number | null;
  password: string | null;
  last_login: string | null;
  is_superuser: true | null;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_staff: boolean | null;
  is_active: boolean | null;
  date_joined: string | null;
  groups: any;
  user_permissions: any;
}


interface RefreshResult {
  access: string;
  refresh: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  public readonly apiUrl = `${environment.apiUrl}/api`;
  public timer: Subscription = new Subscription();
  // tslint:disable-next-line: variable-name
  public _user = new BehaviorSubject<IApplicationUser>(INIT_APPLICATION_USER);
  public user$: Observable<IApplicationUser> = this._user.asObservable();

  public storageEventListener(event: StorageEvent) {
    if (event.storageArea === localStorage) {
      if (event.key === 'logout-event') {
        this.stopTokenTimer();
        this._user.next(INIT_APPLICATION_USER);
      }
      if (event.key === 'login-event') {
        this.stopTokenTimer();
        const accToken = localStorage.getItem('access_token');
        if (accToken) {
          this.updateUserState(accToken);
        }
      }
    }
  }
  updateUserState(token: string) {
    const userId = this.getUserIdFromToken(token);
    this.http.get<UserDetailResult>(`${this.apiUrl}/users/${userId}/`).subscribe(x => {
      const usr: IApplicationUser = {
        id: x.id,
        is_superuser: x.is_superuser,
        username: x.username,
        first_name: x.first_name,
        last_name: x.last_name,
        email: x.email,
        is_staff: x.is_staff,
        is_active: x.is_active,
      };
      this._user.next(usr);
    }, (err) => console.log(err));
  }
  constructor(private router: Router, private http: HttpClient) {
    window.addEventListener('storage', this.storageEventListener.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageEventListener.bind(this));
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

  login(username: string, password: string) {
    return this.http
      .post<LoginResult>(`${this.apiUrl}/login/`, { username, password })
      .pipe(
        map((x) => {
          this.setLocalStorage(x);
          this.startTokenTimer();
          this.updateUserState(x.access);
          return x;
        })
      );
  }

  logout() {
    this.clearLocalStorage();
    this._user.next(INIT_APPLICATION_USER);
    this.stopTokenTimer();
    this.router.navigate(['login']);
    // this.http
    //   .post<unknown>(`${this.apiUrl}/logout`, {})
    //   .pipe(
    //     finalize(() => {
    //     })
    //   )
    //   .subscribe();
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.clearLocalStorage();
      return of(null);
    }
    return this.http
      .post<RefreshResult>(`${this.apiUrl}/token/refresh/`, { refresh: refreshToken })
      .pipe(
        map((x) => {
          this.updateUserState(x.access);
          this.setLocalStorage(x);
          this.startTokenTimer();
          return x;
        })
      );
  }

  setLocalStorage(x: any) {
    localStorage.setItem('access_token', x.access);
    if (x.refresh) {
      localStorage.setItem('refresh_token', x.refresh);
    }
    localStorage.setItem('login-event', 'login' + Math.random());
  }

  clearLocalStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.setItem('logout-event', 'logout' + Math.random());
  }

  getTokenRemainingTime() {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return 0;
    }
    const jwtToken = JSON.parse(atob(accessToken.split('.')[1]));
    const expires = new Date(jwtToken.exp * 1000);
    return expires.getTime() - Date.now();
  }

  getUserIdFromToken(token: string) {
    const jwtToken = JSON.parse(atob(token.split('.')[1]));
    return jwtToken.user_id;
  }

  public startTokenTimer() {
    const timeout = this.getTokenRemainingTime();
    this.timer = of(true)
      .pipe(
        delay(timeout),
        switchMap(() => this.refreshToken())
      )
      .subscribe();
  }

  public stopTokenTimer() {
    this.timer?.unsubscribe();
  }
}
