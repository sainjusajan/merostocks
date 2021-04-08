import { AuthService } from './auth.service';

export function appInitializer(authService: AuthService) {
  return () =>
    new Promise((resolve, reject) => {
      console.log('refresh token on app start up');
      authService.refreshToken().toPromise().then(x => resolve(x)).catch(error => {
        reject(error);
      });

    });
}
