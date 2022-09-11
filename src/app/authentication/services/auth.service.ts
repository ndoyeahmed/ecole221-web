import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UtilisateurModel } from 'src/app/shared/models/utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  SECRET = 'smartmaskosc2020';
  errCon = false;
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }


  async authenticationProcess(url: string, body: any) {
    await this.http.post<any>(url, body).toPromise()
      .then((data) => {
        this.setSession(data).then(x => {
          this.identity().subscribe((user: any) => {
            // if (user.passwordChange) {
              if (this.hasAuthority(['ADMIN'], user)) {
                this.storeUser(user)
                  .then(() => {
                    this.router.navigate(['/gestion-school/parametrages']);
                  });
              } else {
                this.storeUser(user)
                  .then(() => {
                    this.router.navigate(['/gestion-school/inscription']);
                  });
              }
             /*} else {
              this.router.navigate(['/login/reset-password']);
            } */
          }, (error: any) => console.log(error));
        });
      }).catch((error1) => this.errCon = true);
    return this.errCon;
  }

  async login(credentials: any) {
    return this.authenticationProcess('/api/login', {username: credentials.login, password: credentials.password});
  }

  async setSession(authResult: any) {

    localStorage.removeItem('id_token');
    localStorage.setItem('id_token', authResult.jwt);
  }

  async storeUser(user: any) {
    localStorage.removeItem('mdd_user');
    localStorage.setItem('mdd_user',user);
    // this.storage.store('mdd_user', this.convertText('encrypt', user));
  }

  token(): string {
    return localStorage.getItem('id_token');
  }

  /*public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }*/

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('mdd_user');
    this.router.navigate(['/login']);
  }

  public identity() {
   /* const result = this.storage.retrieve('mdd_user');
    if (result) {
      return result;
      // return this.convertText('decrypt', result);
    } else {
      return this.http.get<any>('/api/connected-user');
    }*/
    return this.http.get<any>('/api/connected-user');
  }

  // convertText(conversion: string, user: any) {
  //   if (conversion === 'encrypt') {
  //     return CryptoJS.AES.encrypt(JSON.stringify(user).trim(), this.SECRET.trim()).toString();
  //   } else {
  //     const bytes = CryptoJS.AES.decrypt(user, this.SECRET.trim());
  //     if (bytes.toString()) {
  //       return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  //     }
  //   }
  // }

  hasAuthority(authorities: string[], user: UtilisateurModel): boolean {
    for (const authority of authorities) {
      if (user?.profil?.libelle === authority) {
        return true;
      }
    }
    return false;
  }
}
