import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from '../services/db-connection.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';
import { PropertyAccessChain } from 'typescript';
import { CompanyService } from '../services/company.service';
import { Platform } from '@angular/cdk/platform';
import { PropertiesService } from '../services/properties.service';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

/**
 *  Component is used to display listings
 */
@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {

  activeListings: boolean = true; // show only active listings
  hasCancelled: boolean = false;
  selected: Date | null; // calendar value
  listings = [];
  categories = [];
  transactions: boolean = false; // true ->  display transactionInfo; false -> display listingInfo
  // @Input() properties: any;
  // @Input() testMessage = '';
  isMobile: boolean;
  loading: boolean = true;
  
  isExternalVerification: boolean = false;

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
    let selectedCategories = this.categories.map(x => [x[0], x[1].filter(y => y.selected).map(y => y.name)]);
    return this.listings
      .filter(l => selectedCategories.every(x => x[1].length === 0 || x[1].some(y => (l.categories).includes(y)))) // categories
      .filter(u => Object.values(u).join("").toString().toLowerCase().indexOf(this.searchTerm.toString().toLowerCase()) > -1 // filter matching search terms
        && (!this.selected || this.selected.getTime() === new Date(u.date).setHours(0, 0, 0, 0))) // when date is selected filter on date
      .sort(this.transactions ? (a, b) => 1 : this.sortCols[this.sortCol].sortFunc) // only listings need to be sorted clientside
  }

  map: mapboxgl.Map | undefined;

  constructor(
    private db: DbConnectionService,
    private user: UserService,
    private route: ActivatedRoute,
    public image: ImageService,
    public router: Router,
    private platform: Platform,
    public ps: PropertiesService
  ) {
    this.form = new UntypedFormGroup({
      comment: new UntypedFormControl('')
    });
  }

  ngOnInit(): void {
    this.loading = true;

    this.ps.propertiesLoaded.subscribe((properties) => {
      if (properties) {
        this.ps.properties = properties;
        this.isExternalVerification = this.ps.properties['Listing Verification Mechanism']?.includes('External Verification');
      }
    });

    this.isMobile = this.platform.ANDROID || this.platform.IOS;
    
    // get categories
    this.db.getCategories().then(r => {
      this.categories = Object.entries(r).map(([k, v]) => [k, v.map((x => {
        return { name: x, selected: false }
        
      }))])
    })

    
    
    this.db.getActiveListings().then(l => {
      console.log("Listings fetched:", l); // 👈 Add this
      this.listings = l['listings']
      this.hasCancelled = false;
      this.loading = false;

      if (this.ps.properties['Listing Type']?.includes('Offline Service'))
        this.renderMap();
    })
  }

  async renderMap(){
    this.map = undefined;
    let coords = [];
    for (const l of this.listings){
      if (l['location']){
        let r = await this.db.geoLocate(l['location'])
        let c = r['features'][0]['center']
        if (!this.map){
          this.map = new mapboxgl.Map({
            accessToken: environment.mapbox.accessToken,
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            zoom: 13,
            center: c
          });
        }
        coords.push(c)
        // add markers
        let m = new mapboxgl.Marker().setLngLat(c).addTo(this.map)
        // add click event
        m.getElement().addEventListener('click', () => {
          // navigate to listing
          this.router.navigateByUrl(`/listings/details/${l['listingID']}`)
        });
      }
    }

    // fit all markers on map
    const bounds = new mapboxgl.LngLatBounds(coords[0],coords[0]);
    for (const coord of coords)
      bounds.extend(coord);
    this.map.fitBounds(bounds, {
      padding: 50
    });
  }

  formatCategories(categories: string): string {
    return categories.replace(/;/g, ', ');
  }


}
