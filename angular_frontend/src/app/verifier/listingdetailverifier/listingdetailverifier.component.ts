import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { PropertiesService } from 'src/app/services/properties.service';
import { ImageService } from 'src/app/services/image.service';

@Component({
  selector: 'app-listingdetailverifier',
  templateUrl: './listingdetailverifier.component.html',
  styleUrls: ['./listingdetailverifier.component.scss']
})
export class ListingdetailverifierComponent implements OnInit{
  listing: VerifierListing;
  error: string = '';
  loading: boolean = true;
  canAct: boolean = false; // whether the verifier can approve/reject

  constructor(
    private route: ActivatedRoute,
    private db: DbConnectionService,
    private user: UserService,
    private router: Router,
    public ps: PropertiesService,
    private image: ImageService,
  ) {}



  ngOnInit(): void {

    this.ps.propertiesLoaded.subscribe((properties) => {
      if (properties) {
        this.ps.properties = properties;
      }
    });

    this.route.params.subscribe(params => {
      const listingId = params['id'];
      const token = this.user.getLoginToken();

      this.db.getVerifierListing(listingId, token).then((l: VerifierListing) => {
        // First fetch all categories from backend
        this.db.getCategories().then(allCategories => {
          const formattedCategories = [];

          Object.entries(allCategories).forEach(([group, subcategories]: [string, string[]]) => {
            const matched = subcategories.filter(name => l.categories.includes(name));
            if (matched.length > 0) {
              formattedCategories.push([group, matched]);
            }
          });

          // Set listing and inject formatted categories
          this.listing = {
            ...l,
            groupedCategories: formattedCategories
          };

          this.canAct = l.status === 'pending' && this.user.getId() === l.verifierId;
          this.loading = false;
        });
      }).catch(err => {
        this.error = err.error?.message || "Listing not found or access denied";
        this.loading = false;
      });
    });
  }


  approveListing() {
    this.db.approveListing(this.listing.listingID, this.user.getLoginToken())
      .then(() => {
        this.listing.status = 'active';
      })
      .catch(err => {
        this.error = err.error?.message || "Failed to approve listing";
      });
  }

  rejectListing() {
    this.db.rejectListing(this.listing.listingID, this.user.getLoginToken())
      .then(() => {
        this.listing.status = 'rejected';
      })
      .catch(err => {
        this.error = err.error?.message || "Failed to reject listing";
      });
  }


}

  interface VerifierListing {
  listingID: number;
  name: string;
  description: string;
  availableAssets: number | null;
  date: string;
  price: number;
  picture?: string;
  location?: string;
  categories: string; // or string[] if you're splitting it
  status: 'pending' | 'active' | 'cancelled' | 'rejected';
  file?: string;
  link?: string;
  userID: number;
  userName: string;
  groupedCategories: [string, string[]][];
  creatorFirstName: string;
  creatorLastName: string; 

  // Only present if external verification is enabled
  verifierId?: number;
  verifierFirstName?: string;
  verifierLastName?: string;
  verifierEmail?: string;
  verifierOrganization?: number;
  verifierOrganizationName?: string;

}



