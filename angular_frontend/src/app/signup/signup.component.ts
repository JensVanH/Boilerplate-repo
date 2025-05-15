import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { PropertiesService } from '../services/properties.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  form: UntypedFormGroup;
  error: string = "";

  fileName: string;
  imgSrc: string;
  imgError: string;
  properties = {};

  // New properties for External Verification
  isExternalVerification: boolean = false;
  isVerifier: boolean = false;
  organizations: any[] = [];
  selectedOrganization: any;

  constructor(
    private db: DbConnectionService,
    private route: Router,
    private image: ImageService,
    public ps: PropertiesService,
    private user: UserService
  ) {
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
      password: new UntypedFormControl(),
      repeatPassword: new UntypedFormControl(),
      role: new UntypedFormControl('user'), // Default is user
      organizationID: new UntypedFormControl()
    });
  }

  ngOnInit(): void {
    this.checkExternalVerification();
    this.ps.propertiesLoaded.subscribe((properties) => {
      if (properties) {
        this.ps.properties = properties;
      }
    });

  }

  // ==========================
  // Check if External Verification is enabled
  // ==========================
  checkExternalVerification() {
    this.db.getTaxonomy().then(taxonomy => {
      console.log("Taxonomy fetched:", taxonomy); // <-- Add this
      const verification = taxonomy['taxonomy'].find(item => item.dimensionValue === 'External Verification');
      console.log("Found Verification Mechanism:", verification); // <-- Add this
      this.isExternalVerification = verification?.selected === 1;
      console.log("Is External Verification Enabled?", this.isExternalVerification); // <-- Add this

      if (this.isExternalVerification) {
        // Fetch organizations only if External Verification is enabled
        this.db.getOrganizations().then((orgs: any[]) => {
          console.log("Organizations fetched:", orgs); // <-- Add this
          this.organizations = orgs;
        }).catch(err => {
          console.error("Error fetching organizations:", err);
        });
      }
    }).catch(err => {
      console.error("Error fetching taxonomy:", err);
    });
  }

  // ==========================
  // Toggle Role Logic
  // ==========================
  toggleRole(role: string) {
    if (role === 'verifier' && !this.isExternalVerification) {
      alert("External Verification is not enabled. You cannot sign up as a Verifier.");
      return;
    }

    this.form.get('role').setValue(role);
    this.isVerifier = role === 'verifier';

    if (this.isVerifier) {
      this.form.get('organizationID').setValidators([control => control.value ? null : { required: true }]);
    } else {
      this.form.get('organizationID').clearValidators();
      this.form.get('organizationID').setValue(null); // Clear selection if not verifier
    }

    this.form.get('organizationID').updateValueAndValidity();
  }

  // ==========================
  // onSubmit function
  // ==========================
  signUp() {
    // collect form values
    let v = this.form.getRawValue();
    delete v.repeatPassword; // only used for client-side verification
    // add profile picture
    v['profilePicture'] = this.imgSrc;

    // send data
    const signUpMethod = v.role === 'verifier' ? this.db.signUpVerifier(v) : this.db.signUp(v);

    signUpMethod
      .then(_ => {
        this.route.navigateByUrl('/login');
      })
      .catch(r => this.error = r.error.message);
  }

  // ==========================
  // select file
  // ==========================
  fileSelected(ev) {
    // no files selected
    if (ev.target.files.length === 0) return;
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
    }, 300, 300);
  }
}

