import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from '../../../services/db-connection.service';
import { ImageService } from '../../../services/image.service';
import { UserService } from '../../../services/user.service';
import { Platform } from '@angular/cdk/platform';
import { PropertiesService } from 'src/app/services/properties.service';

@Component({
  selector: 'app-mylistingsverifier',
  templateUrl: './mylistingsverifier.component.html',
  styleUrls: ['./mylistingsverifier.component.scss']
})
export class MylistingsverifierComponent {

  selected: Date | null; // calendar value
  listings = [];
  categories = [];
  transactions: boolean = false; // true ->  display transactionInfo; false -> display listingInfo
  // @Input() properties: any;
  // @Input() testMessage = '';
  properties = {}
  isMobile: boolean;

  // searchbar + sorting
  searchTerm: string = ""; // searchbar value
  sortCol: number = 4; // sort dropdown index value
  sortCols = [ // sort dropdown values + sort functions
    {
      name: 'Name: A -> Z',
      sortFunc: (a, b) => (a.name ? a.name : "").localeCompare(b.name ? b.name : "")
    }, {
      name: 'Name: Z -> A',
      sortFunc: (a, b) => -(a.name ? a.name : "").localeCompare(b.name ? b.name : "")
    }, {
      name: 'Available assets: Low -> High',
      sortFunc: (a, b) => a.availableAssets - b.availableAssets
    }, {
      name: 'Available assets: High -> Low',
      sortFunc: (a, b) => b.availableAssets - a.availableAssets
    }, {
      name: 'Date: Recent -> Oldest',
      sortFunc: (a, b) => -(a.date ? a.date : "").localeCompare(b.date ? b.date : "")
    }, {
      name: 'Date: Oldest -> Recent',
      sortFunc: (a, b) => (a.date ? a.date : "").localeCompare(b.date ? b.date : "")
    }, {
      name: 'Price: Low -> High',
      sortFunc: (a, b) => a.price - b.price
    }, {
      name: 'Price: High -> Low',
      sortFunc: (a, b) => b.price - a.price
    }, {
      name: 'Rating: Best -> Worst',
      sortFunc: (a, b) => b.avgScore - a.avgScore
    }, {
      name: 'Rating: Worst -> Best',
      sortFunc: (a, b) => a.avgScore - b.avgScore
    }];

  // review
  form: UntypedFormGroup;
  rating: number = 0; // selected rating for review
  hoverRating: number = 0; // rating shown when hovering

  // pages
  pageLimitOption = [10, 20, 50]
  pageLimitIndex = 1; // selected pageLimit index
  currentPage = 1;

  // lambda function that calculates last page
  maxPage = (listings) => Math.ceil(listings.length / this.pageLimitOption[this.pageLimitIndex])

  // function that filters by category and searchTerm and sorts entries using searchCols
  filteredListings = () => {
    let selectedCategories = this.categories.map(x => x[1]).reduce((acc, val) => acc.concat(val), []).filter(x => x.selected).map(x => x.name);
    return this.listings
      .filter(l => selectedCategories.every(x => (l.categories).includes(x))) // categories
      .filter(u => Object.values(u).join("").toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1 // filter matching search terms
        && (!this.selected || this.selected.getTime() === new Date(u.date).setHours(0, 0, 0, 0))) // when date is selected filter on date
      .sort(this.transactions ? (a, b) => 1 : this.sortCols[this.sortCol].sortFunc) // only listings need to be sorted clientside
  }

  

  constructor(
    private db: DbConnectionService,
    private user: UserService,
    private route: ActivatedRoute,
    public image: ImageService,
    public router: Router,
    private platform: Platform,
    public ps: PropertiesService,
  ) {
    this.form = new UntypedFormGroup({
      comment: new UntypedFormControl('')
    });
  }

  ngOnInit(): void {

    this.isMobile = this.platform.ANDROID || this.platform.IOS;

    this.ps.propertiesLoaded.subscribe((properties) => {
      if (properties) {
        this.ps.properties = properties;
      }
    });


    // get categories
    this.db.getCategories().then(r => {
      this.categories = Object.entries(r).map(([k, v]) => [k, v.map((x => {
        return { name: x, selected: false }

      }))])
    })

    this.db.getAllListingsForVerifier(this.user.getLoginToken()).then((res: any) => {
      this.listings = (res.listings || []).map(listing => ({
        ...listing,
        userName: listing.User?.userName || 'Unknown' // safely map nested userName
      }));
    });

  }

  formatCategories(categories: string): string {
    return categories.replace(/;/g, ', ');
  }
  
}

