import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { DbConnectionService } from '../services/db-connection.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  cookieName: string = 'user'
  user: User
  profilePic: string;
  public storeCookie: boolean = false;

  constructor(private cookieService: CookieService,
    private db: DbConnectionService) {
    // search for user in cookies
    let u = this.cookieService.get(this.cookieName);
    if (u){
      this.user = JSON.parse(u);
      this.fetchProfilePicture();
    }

  }

  fetchProfilePicture(){
    if (this.isLoggedIn())
        this.db.getProfilePicture(this.getId()).then(r => {
          this.profilePic = r["profilePicture"]
        })
  }

  isLoggedIn(): boolean{
    return typeof this.user !== "undefined";
  }

  setUser(user: User): void{
    // store user in cookies
    if (this.storeCookie)
      this.cookieService.set(this.cookieName, JSON.stringify(user), 1);
    this.user = user;
    this.fetchProfilePicture();
  }

  logOut(): void{
    // delete user cookie
    this.cookieService.delete(this.cookieName)
    this.user = undefined;
    this.profilePic = undefined;
  }

  getLoginToken(): string {
    return this.user ? this.user.accessToken : ""
  }

  getId(): number {
    return this.user ? this.user.id : -1
  }

  getUserName(): string {
    return this.user ? this.user.userName : ""
  }

  // calculates password strength [1-4]
  passwordStrength(password: string): number{
    return [
      password.split("").reduce((t, x) => t || isNaN(+x) && x === x.toUpperCase(), false), // contains uppercase letter
      password.split("").reduce((t, x) => t || !isNaN(+x), false), // contains number
      password.length >= 8, // long enough
    ].reduce((acc, x) => x ? acc + 1 : acc, 1)
  }

  getProfilePicture(): string{
    return this.profilePic ? this.profilePic : "/assets/userPlaceholder.png";
  }

  getRole(): string {
    return this.user?.role;
  }

  isVerifier(): boolean {
    return this.getRole() === 'verifier';
  }

}



// locally stored userdata
export interface User {
  id: number,
  userName: string,
  accessToken: string
  role: 'user' | 'verifier'; // match backend
}
