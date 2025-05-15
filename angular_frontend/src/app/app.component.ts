import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DbConnectionService } from './services/db-connection.service';
import { UserService } from './services/user.service';
import { CompanyService } from './services/company.service';
import { PropertiesService } from './services/properties.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Marketplace';
  notifications: object[] = [];
  unseenMessages: number = 0;
  timeToRefresh = 5000; // time in ms

  constructor(
    public user: UserService,
    private db: DbConnectionService,
    private router: Router,
    public companyService: CompanyService,
    private properties: PropertiesService){
      this.fetchNotifications();
      this.fetchMessageNotifications();

      // repeatedly check for notifications
      setInterval(() => {
        this.fetchNotifications();
        this.fetchMessageNotifications();
      }, this.timeToRefresh);  
      
  }

  ngOnInit() {
    this.title = this.companyService.companyName
  }

  changeCompany(c: string){
    this.companyService.companyName = c;
    this.properties.fetchProperties();
    this.title = this.companyService.companyName;
    let url = this.router.url;
    this.router.navigateByUrl('/tmp', {skipLocationChange: true}).then(() => {
      this.router.navigateByUrl(url);
    });
  }
  

  // turn notification into message
  getNotificationMessage(notification: object): string{
    let listingName = notification['Transaction'].Listing.name
    switch (notification['type']) {
      case 'new transaction':
        return `A new transaction was made on your ${listingName}`
      case 'cancellation':
        if (notification['Transaction'].customerID === this.user.getId())
          return `Your transaction on ${listingName} has been cancelled`
        else
          return `A transaction on your ${listingName} has been cancelled`
      case 'payment confirmation':
        return `Your payment on ${listingName} has been confirmed`
      case 'reviewable':
        return `You can review your recent transaction of ${listingName}`
      default:
        break;
    }
  }

  // onClick function
  clickedNotification(notification: object){
    // mar notification as viewed
    this.db.markNotificationAsViewed(notification['notificationID'], this.user.getLoginToken()).then(_ => {
      // navigate to page according to notification
      switch (notification['type']) {
        case 'new transaction':
          // go to detail page of listing
          this.router.navigate(['/listings/details', notification['transaction'].listingID, 'transactions'])
          break;
        case 'cancellation':
          if (notification['transaction'].customerID === this.user.getId())
            // go to my transactions
            this.router.navigate(['/listings'], {queryParams: { transactions: true }})
          else
            // go to detail page of listing
            this.router.navigate(['/listings/details', notification['transaction'].listingID, 'transactions'])
          break;
        case 'payment confirmation':
        case 'reviewable':
          // go to my transactions
          this.router.navigate(['/transactions'])
          break;
        default:
          break;
      }
    })
  }

  // get notifications and sort recent to last
  fetchNotifications() {
    if (this.user.isLoggedIn())
      this.db.getUserNotifications(this.user.getLoginToken()).then(r => this.notifications = r['notifications'].sort((a, b) => b['notificationID'] - a['notificationID']))
  }

  // get notifications of new messages
  fetchMessageNotifications(){
    if (this.user.isLoggedIn())
      this.db.getNewMessagesAmount(this.user.getLoginToken()).then(r => this.unseenMessages = r['messageAmount'])
  }

  getUnreadNotificationsAmount(): number{
    return this.notifications.filter(x => !x['viewed']).length;
  }

  // delete all notifications
  deleteNotifications(){
    this.db.deleteNotifications(this.user.getLoginToken()).then(r => {
      this.fetchNotifications();
    })
  }
}
