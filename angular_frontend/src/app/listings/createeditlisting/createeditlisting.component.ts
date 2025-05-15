import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { ImageService } from 'src/app/services/image.service';
import { UserService } from 'src/app/services/user.service';
import { CompanyService } from 'src/app/services/company.service';
import { PropertiesService } from 'src/app/services/properties.service';

@Component({
  selector: 'app-form',
  templateUrl: './createeditlisting.component.html',
  styleUrls: ['./createeditlisting.component.scss']
})
export class CreateEditListingComponent implements OnInit {

  fileName: string;
  imgSrc: string;
  imgError: string;

  form: UntypedFormGroup;
  error: string;
  listingId: number = -1;
  categories = [];
  properties = {};

  // New properties for External Verification
  isExternalVerification: boolean = false;
  organizations: any[] = [];
  verifiers: any[] = [];

  constructor(
    private user: UserService,
    private route: ActivatedRoute,
    private db: DbConnectionService,
    private router: Router,
    private image: ImageService,
    private companyService: CompanyService,
    public ps: PropertiesService
  ) {

    // redirect to login page when not logged in
    if (!this.user.isLoggedIn())
      this.router.navigateByUrl("/login");
    // initialize form fields
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(),
      description: new UntypedFormControl(),
      availableAssets: new UntypedFormControl(),
      date: new UntypedFormControl(),
      price: new UntypedFormControl(),
      location: new UntypedFormControl(),
      link: new UntypedFormControl(),
      organizationID: new UntypedFormControl(),
      verifierId: new UntypedFormControl(),
    });
  }

  ngOnInit(): void {
    this.checkExternalVerification();

    this.ps.propertiesLoaded.subscribe((properties) => {
      if (properties) {
        this.ps.properties = properties;
      }
    });
    console.log("This function gets performed");
    // get url query params
    this.route.queryParamMap.subscribe(qMap => {
    // when query has 'edit' parameter, edit listing data
      let lId = qMap['params'].edit;
      if (lId) {
        this.db.getListing(lId).then(l => {
          // update listingID
          this.listingId = l['listingID'];

          // fill out form with listingdata
          this.form.patchValue({
            name: l['name'],
            description: l['description'],
            availableAssets: l['availableAssets'],
            date: l['date'],
            price: l['price'],
            location: l['location'],
            organizationID: l['verifierOrganization'],       
          });

          // populate the verifiers
          this.fetchVerifiersEdit(l['verifierOrganization']);

          this.form.patchValue({    
                     verifierId: l['verifierId'],  
                    });
    

          if (l['picture']) {
            this.imgSrc = l['picture'];
            this.imgError = "";
          }
          this.getCategories(l['categories']);
        });
      } else {
        this.getCategories();
      }
    });

    this.form.get('verifierId').valueChanges.subscribe(value => {
      console.log("Verifier ID changed to:", value);
    });

    this.form.get('organizationID').valueChanges.subscribe(value => {
      console.log("Organization ID changed to:", value);
    });

  }

  // Check if External Verification is enabled and fetch organizations
  checkExternalVerification() {
    this.db.getTaxonomy().then(taxonomy => {
      const verification = taxonomy['taxonomy'].find(item => item.dimensionValue === 'External Verification');
      this.isExternalVerification = verification?.selected === 1;

      if (this.isExternalVerification) {
        this.db.getOrganizations().then((orgs: any[]) => {
          this.organizations = orgs;
        }).catch(err => {
          console.error("Error fetching organizations:", err);
        });
      }
    }).catch(err => {
      console.error("Error fetching taxonomy:", err);
    });
  }
  // Fetch verifiers when an organization is selected
  fetchVerifiers(orgID: number) {
      this.db.getVerifiersByOrganization(orgID).then((response: any) => {
        console.log("Verifiers fetched:", response); // <-- Check the response
        this.verifiers = response.verifiers;
        if (this.verifiers && this.verifiers.length > 0) {
          // Automatically select the first verifier
          const firstVerifierId = this.verifiers[0].userID;
          this.form.patchValue({ verifierId: firstVerifierId });
          console.log("Auto-selected verifierId:", firstVerifierId);
        } else {
          // If no verifiers found, clear the field
          this.form.patchValue({ verifierId: null });
          console.log("No verifiers available, clearing verifierId");
        }
      }).catch(err => {
        console.error("Error fetching verifiers:", err);
      });

  }

  // Fetch verifiers when a listing is being edited
  fetchVerifiersEdit(orgID: number) {
      this.db.getVerifiersByOrganization(orgID).then((response: any) => {
        console.log("Verifiers fetched:", response); // <-- Check the response
        this.verifiers = response.verifiers;
      }).catch(err => {
        console.error("Error fetching verifiers:", err);
      });

  }

  onOrganizationChange(event: any) {
  const selectedOrgId = event.target.value;
  console.log("Organization change event detected, ID:", selectedOrgId); // <-- Log selected ID
  this.fetchVerifiers(selectedOrgId);
}


  // Handle image selection and conversion
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
    }, 572, 360);
  }

  // Submit the form, include verifier if external verification is enabled
  createListing() {
    let values = { ...this.form.getRawValue() };
    console.log("Values:", values);
    // add selected categories to values
    values['categories'] = this.categories
      .map(x => x[1])
      .reduce((acc, val) => acc.concat(val), [])
      .filter(x => x.selected)
      .map(x => x.name);
    values['picture'] = this.imgSrc;
    values['file'] = this.imgSrc;

    if (this.isExternalVerification && !values.verifierId) {
      this.error = "Please select a verifier.";
      return;
    }

    if (this.listingId < 0) {
      this.db.createListing(this.user.getLoginToken(), values, this.companyService.companyName)
        .then(r => {
          this.router.navigateByUrl(`/listings/details/${r['listingID']}`);
        })
        .catch(err => this.error = err.error.message);
    } else {
      console.log("Submitting form values:", values);

      this.db.postListing(this.listingId, this.user.getLoginToken(), values)
        .then(r => {
          this.router.navigateByUrl(`/listings/details/${this.listingId}`);
        })
        .catch(err => this.error = err.error.message);
    }
  }

  // Fetch categories
  getCategories(selected = []) {
    this.db.getCategories().then(r => {
      this.categories = Object.entries(r).map(([k, v]) => [k, v.map((x => {
        return { name: x, selected: selected.includes(x) };
      }))]);
    });
  }
}

