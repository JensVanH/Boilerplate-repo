import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DbConnectionService } from 'src/app/services/db-connection.service';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ImageService } from 'src/app/services/image.service';
import { PropertiesService } from 'src/app/services/properties.service';
import { ListingModule } from '../listing.module';
import { DateRange, DefaultMatCalendarRangeStrategy, MAT_DATE_RANGE_SELECTION_STRATEGY, MatCalendar, MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { promise } from 'protractor';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './listingdetail.component.html',
  styleUrls: ['./listingdetail.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
  ],
})
export class ListingDetailComponent implements OnInit {

  @ViewChild('bookings') calendar: MatCalendar<Date>;

  listing: object;
  error: string;
  form:UntypedFormGroup;
  transactions = [];
  reviews = [];
  avgScore: number = 0;
  sellerScore: number = 0;
  sellerReviewAmount: number = 0;
  selectedTab = ""; // ["info", "reviews", "transactions"]
  loading = 0; // #asynchronous tasks running

  rating: number = 0; // selected rating for review
  selectedTransactionForReview: number = -1;
  reviewForm: UntypedFormGroup;

  loadedBookings: number[] = [0, 0]; // [month, year]
  bookings = [];
  selectedDateRange: DateRange<Date>;
  selectedDate: Date;

  map: mapboxgl.Map | undefined;
  coords: number[] = [];

  ngAfterViewChecked(){
    if (this.listing && !this.map && this.listing['location'] && document.getElementById('map') && this.coords.length > 0){
      this.map = new mapboxgl.Map({
        accessToken: environment.mapbox.accessToken,
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 13,
        center: this.coords
      });
      const marker = new mapboxgl.Marker()
        .setLngLat(this.coords)
        .addTo(this.map);
    }
  }

  // custom date selection for booking
  _onSelectedChange(date: Date): void {
    this.selectedDate = date;
    if (
      this.selectedDateRange &&
      this.selectedDateRange.start &&
      date > this.selectedDateRange.start &&
      !this.selectedDateRange.end
    ) {
      this.selectedDateRange = new DateRange(
        this.selectedDateRange.start,
        date
      );
    } else {
      this.selectedDateRange = new DateRange(date, null);
    }
  }

  // function to handle styling of dates in booking calendar
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highlight dates inside the month view.
    if (view === 'month') {
      // fetch bookings when not loaded
      if (this.loadedBookings[0] !== cellDate.getMonth() + 1 || this.loadedBookings[1] !== cellDate.getFullYear()){
        this.db.getListingBookings(this.listing['listingID'], cellDate.getMonth() + 1, cellDate.getFullYear()).then(r => {
            this.bookings = r['bookings'];
            // update calendar
            this.calendar.updateTodaysDate();
        });
        this.loadedBookings = [cellDate.getMonth() + 1, cellDate.getFullYear()];
      }
      // when date in cell occurs in existing booking change color
      let cellDateUTC = Date.UTC(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
      for (let i = 0; i < this.bookings.length; i++){
        let startDate = this.customToDate(this.bookings[i]['startDate']);
        let endDate = this.customToDate(this.bookings[i]['endDate']);
        if (cellDateUTC >= startDate && cellDateUTC <= endDate)
          return 'calendar-date-occupied';
      }
    }
    return '';
  };

  // string to Date without conflicting time zones
  private customToDate(date: string){
    let d: number[] = date.split("-").map(x => parseInt(x))
    return Date.UTC(d[0], d[1]-1, d[2]);
  }

  // to string fixing js tostring timezone bug
  private dateToYYYYMMDDformat(date: Date){
    const offset = date.getTimezoneOffset()
    let newDate = new Date(date.getTime() - (offset*60*1000))
    return newDate.toISOString().split('T')[0]
  }

  // bookings to array of strings for readability
  logBookings(bookings=this.bookings){
    return bookings.map(x => `(${x.startDate}) ${x.startTime} - ${x.endTime} (${x.endDate})`)
  }

  getTotalPrice(){
    return parseInt(this.listing['price']) * this.getTotalServiceAssets()
  }

  // calculate selected amount of assets of service
  private getTotalServiceAssets(){
    if (this.ps.properties['Time Unit']?.includes('Hour'))
      return parseInt(this.form.get('amountOfHours').value)
    else{
      if (this.selectedDateRange && this.selectedDateRange.start && this.selectedDateRange.end)
        return Math.round((this.selectedDateRange.end.valueOf() - this.selectedDateRange.start.valueOf()) / (1000 * 60 * 60 * 24));
      else
        return 0
    }
  }

  constructor(private route: ActivatedRoute,
    private db : DbConnectionService,
    private user: UserService,
    private router: Router,
    public image: ImageService,
    public ps: PropertiesService) {
      
      // initialize form field
      this.form = new UntypedFormGroup({
        numberOfAssets: new FormControl(1),
        address: new UntypedFormControl(),
        date: new UntypedFormControl(),
        startTime: new UntypedFormControl(),
        amountOfHours: new UntypedFormControl(1)
      });

      this.reviewForm = new UntypedFormGroup({
        comment: new UntypedFormControl('')
      });
    }

  ngOnInit(): void {
    
    this.ps.propertiesLoaded.subscribe((properties) => {
      if (properties) {
        this.ps.properties = properties;
      }
    });

    // get url query params
    this.route.params.subscribe(params => {
      this.error = "";
      // when detail-type is given in url
      if (params.type && ["info", "reviews", "transactions"].includes(params.type))
        this.selectedTab = params.type;
      // get listingdata
      this.db.getListing(params.id)
        .then(l => {
          this.db.getCategories().then(c => {
            let categories = [];
            Object.entries(c).forEach(([k, v]) => {
              let v2 = v.filter(x => l["categories"].includes(x));
              if (v2.length > 0)
                categories.push([k, v2])
            })
            this.listing = l;
            this.listing['categories'] = categories;
            this.loadReviews();
            // if listing if made by logged in user show transactions
            if (this.listing['userID'] === this.user.getId())
              this.loadTransactions();
            if (this.ps.properties['Review Of']?.includes('Of Listing')){
              this.db.getSellerRating(this.listing['userID']).then(r => {
                this.sellerScore = r['sellerScore'];
                this.sellerReviewAmount = r['reviewAmount'];
              })
            }

            if (this.listing['location']){
              this.db.geoLocate(this.listing['location']).then(r => {
                this.coords = r['features'][0]['center']
              })
            }
          })
        })
        .catch(err => this.error = err.error.message);
    })
  }

  // when type was given, scroll to given type when all data is loaded
  onFinishLoading() {
    this.loading -= 1;
    if (this.loading !== 0) return;
    if (this.selectedTab)
      setTimeout(() => document.getElementById(this.selectedTab).scrollIntoView(), 50); // give time for transactions table to build
    else
      this.selectedTab = 'info';
  }

  // get reviews
  loadReviews(){
    this.loading += 1;
    this.db.getListingReviews(this.listing['listingID']).then(r => {
      this.avgScore = r['score'];
      this.reviews = r['reviews'];
      this.onFinishLoading();
    }).catch(err => this.error = err.error.message)
  }

  // get transactions
  loadTransactions(){
    this.loading += 1;
    this.db.getListingTransactions(this.listing['listingID'], this.user.getLoginToken())
      .then(b => {
        // sort by transactionID
        b['transactions'].sort((a, b) => b['transactionID'] - a['transactionID'])
        this.transactions = b['transactions']
        this.transactions.forEach(t => {
          this.db.getUserRating(this.user.getLoginToken(), t['customerID']).then(r => {
            t['userRatingCount'] = r['reviewAmount']
            t['userRating'] = r['userRating']
          });
          
          // load bookings when applicable
          if (this.ps.properties['Listing Kind']?.includes('Service') && this.ps.properties['Frequency']?.includes('Recurring')){
            this.db.getTransactionBookings(this.user.getLoginToken(), t['transactionID']).then(r => {
              t['bookings'] = r['bookings']
            })
          }
        })
        this.onFinishLoading();
      }).catch(err => {
        this.error = err.error.message
      })
      
  }

  // delete listing
  cancelListing(id: number){
    this.db.cancelListing(id, this.user.getLoginToken()).then(_ => {
      this.listing['status'] = 'cancelled'
      // update transaction data
      this.loadTransactions();
    })
  }

  // create transaction
  createTransaction(){
    let values = { ...this.form.getRawValue() };

    // Determine correct asset count
    if (this.ps.properties['Listing Kind']?.includes('Service') && this.ps.properties['Frequency']?.includes('Recurring')) {
      values['numberOfAssets'] = this.getTotalServiceAssets();
    } else {
      values['numberOfAssets'] = parseInt(this.form.get('numberOfAssets')?.value, 10) || 1;
    }
    values['listingID'] = this.listing['listingID'];
    this.db.createTransaction(this.user.getLoginToken(), values).then(r => {

      // Create Booking after transaction has been created
      if (this.ps.properties['Listing Kind']?.includes('Service') && this.ps.properties['Frequency']?.includes('Recurring')){
        let fields = {'transactionID': r['transactionID']};
        if (this.ps.properties['Time Unit']?.includes('Day')){
          fields['startDate'] = this.dateToYYYYMMDDformat(this.selectedDateRange.start);
          fields['endDate'] = this.dateToYYYYMMDDformat(this.selectedDateRange.end);
        } else {
          fields['startDate'] = this.dateToYYYYMMDDformat(this.selectedDate);
          // calculate end date
          let endDate = new Date(this.selectedDate);
          endDate.setHours(values['startTime'].split(":")[0])
          endDate.setMinutes(values['startTime'].split(":")[1])
          endDate.setTime(endDate.getTime() + (values['amountOfHours']*60*60*1000))

          fields['endDate'] = this.dateToYYYYMMDDformat(endDate);
          fields['startTime'] = values['startTime'];
          fields['endTime'] = `${endDate.getHours()}:${endDate.getMinutes()}`
        }

        this.db.createBooking(this.user.getLoginToken(), fields).then(res => {
          this.transactionSuccess();
        }).catch(e => {
          this.db.cancelTransaction(r['transactionID'], this.user.getLoginToken())
          this.error = `Booking failed: ${e.error.message}`
        })
      } else {
        this.transactionSuccess();
      }
      
      
    })
  }

  // helper function for createTransaction()
  transactionSuccess(){
    //sold when only 1 quantity exists
      if (this.ps.properties['Quantity']?.includes('One') && !this.ps.properties['Frequency']?.includes('Recurring')) {
        this.db.soldListingStatus(this.listing['listingID'])
      }
      // go to transactions
      this.router.navigate(['/transactions'])
  }

  // cancel transaction
  cancelTransaction(transactionId: number){
    this.db.cancelTransaction(transactionId, this.user.getLoginToken()).then(r => {
      // update transaction data
      this.loadTransactions();
    }).catch(r => this.error = r.error.message)
  }

  // confirm transaction payment
  confirmPayment(transactionId: number){
    this.db.confirmPayment(transactionId, this.user.getLoginToken()).then(r => {
      // update transaction data
      this.loadTransactions();
    }).catch(r => this.error = r.error.message)
  }

  // open message page to owner of listing
  contactOwner(){
    this.router.navigateByUrl(`/messages?id=${this.listing['userID']}`)
  }

  // post review on selected User
  postReview(){
    let v = this.reviewForm.getRawValue();
    v['score'] = this.rating;
    this.db.postReview(this.user.getLoginToken(), this.selectedTransactionForReview, v).then(r => {
      this.resetReviewForm();
      this.loadTransactions();
    })
  }

  // clears input in review form
  resetReviewForm(){
    this.selectedTransactionForReview = -1;
    this.rating = 0;
    this.reviewForm.setValue({comment: ""})
  }

  // save booking info
  saveBookingInfo(booking){
    this.db.addBookingInfo(this.user.getLoginToken(), {bookingID: booking['bookingID'], info: booking['info']}).then(r => {
    })
  }
}
