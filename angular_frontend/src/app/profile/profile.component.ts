import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';
import { PropertiesService } from '../services/properties.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  error: string;
  form: UntypedFormGroup;

  fileName: string;
  imgSrc: string;
  imgError: string;
  properties = {};
  organizationName: string = '';


  constructor(public user: UserService,
    private route: Router,
    private db: DbConnectionService,
    private image: ImageService,
    public ps: PropertiesService) {
      // redirect to login page when not logged in
      if (!user.isLoggedIn())
        this.route.navigateByUrl("/login")
      // initialize form fields
      this.form = new UntypedFormGroup({
        firstName: new UntypedFormControl(),
        lastName: new UntypedFormControl(),
        organisation: new UntypedFormControl(),
        email: new UntypedFormControl(),
        userName: new UntypedFormControl(),
        gender: new UntypedFormControl(),
        address: new UntypedFormControl(),
        birthDate: new UntypedFormControl(),
        phoneNumber: new UntypedFormControl(),
        role: new UntypedFormControl(),
        organizationName: new UntypedFormControl(),
        organizationID: new UntypedFormControl(),

      });
    }

  ngOnInit(): void {

    // get user data
    this.db.getUserData(this.user.getId(), this.user.getLoginToken())
      .then(user => {
        Object.keys(user).forEach(x => {
          console.log("Check X: ", x)
          if (x === 'profilePicture')
            this.imgSrc = user[x]
          else
            // fill out form with userdata
            this.form.get(x).setValue(user[x])
        })
      })
    .catch(r => this.error = r.error.message);


    this.ps.propertiesLoaded.subscribe((properties) => {
      if (properties) {
        this.ps.properties = properties;
      }
    });



  }

  // onSubmit function
  updateProfile(){
    // collect new userdata
    let v = this.form.getRawValue()
    // add profile picture
    v['profilePicture'] = this.imgSrc;
    // send new userdata to db
    this.db.postUserData(this.user.getId(), this.user.getLoginToken(), v)
      .then(_ =>{
        // update userdata locally
        this.user.setUser({
          id: this.user.getId(),
          userName: v.userName,
          accessToken: this.user.getLoginToken(),
          role: this.user.user?.role || 'user'
        })
        this.route.navigateByUrl("/")
      })
    .catch(err => this.error = err.error.message)
  }

  // select file
  fileSelected(ev){
    // no files selected
    if (ev.target.files.length === 0)
      return;
    // reset variables
    this.imgError = undefined;
    this.imgSrc = undefined;
    let f: File = <File>ev.target.files[0];
    this.fileName = f.name;
    // convert image to standard format
    this.image.convertFileToJpegBase64(f, (c) => {
      this.imgSrc = c;
    }, (err) => {
      this.imgError = err;
    }, 300, 300)
  }
}
