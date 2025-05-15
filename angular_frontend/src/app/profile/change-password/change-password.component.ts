import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  form: UntypedFormGroup;
  error: string = ""

  constructor(private db: DbConnectionService,
    private user: UserService,
    private route: Router) {
    // redirect to login page when not logged in
    if (!user.isLoggedIn())
      this.route.navigateByUrl("/login")
    // initialize form fields
    this.form = new UntypedFormGroup({
      oldPassword: new UntypedFormControl(),
      newPassword: new UntypedFormControl(),
      repeatPassword: new UntypedFormControl()
    });
  }

  ngOnInit(): void {
  }

  // onSubmit function
  changePassword(){
    // collect form values
    let v = this.form.getRawValue();
    this.db.changePassword(v.oldPassword, v.newPassword, this.user.getLoginToken())
      .then(_ => {
        // go to profile page
        this.route.navigateByUrl('/profile')
      }).catch(r => this.error = r.error.message);
  }
}
