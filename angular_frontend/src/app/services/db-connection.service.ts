import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { query } from '@angular/animations';
import { environment } from 'src/environments/environment';
import { CompanyService } from './company.service';


@Injectable({
  providedIn: 'root'
})
export class DbConnectionService {

  // backend connection settings
  url = environment.baseUrlApi;
  

  constructor(private http: HttpClient,
              private companyService: CompanyService) {
  }

  // create HTTP header with webtoken
  getTokenHeader(token: string){
    return new HttpHeaders().set('x-access-token', token);
  }

  /**
   * sign user in
   * @param login
   * @param password
   * @returns http response promise
   */
  signIn(login: string, password: string){
    return this.http.post(`${this.url}/api/auth/signin`, {'login': login, 'password': password}).toPromise();
  }

  /**
   * sign user up (creates user)
   * @param fields (not required)
   *  @field firstName
   *  @field lastName
   *  @field password
   *  @field email
   *  @field gender
   *  @field address
   *  @field birthDate
   *  @field phoneNumber
   * @returns http response promise
   */
  signUp(fields: Object){
    return this.http.post(`${this.url}/api/auth/signup`, fields).toPromise();
  }

  /**
   * get userdata
   * @param id userID
   * @param userToken webtoken
   * @returns http response promise
   */
  getUserData(id: number, userToken: string){
    return this.http.get(`${this.url}/api/userdata?id=${id}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * update userdata
   * @param id userID
   * @param userToken webtoken
   * @param fields (not required)
   *  @field firstName
   *  @field lastName
   *  @field email
   *  @field gender
   *  @field address
   *  @field birthDate
   *  @field phoneNumber
   * @returns http response promise
   */
  postUserData(id: number, userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/userdata?id=${id}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get profile picture
   * @param userID userID
   * @returns http response promise
   */
  getProfilePicture(userID: number){
    return this.http.get(`${this.url}/api/userPicture?id=${userID}`).toPromise();
  }

  /**
   * change password
   * @param oldPassword
   * @param newPassword
   * @param userToken webtoken
   * @returns http response promise
   */
  changePassword(oldPassword: string, newPassword: string, userToken: string){
    return this.http.post(`${this.url}/api/user/changePassword`, {oldPassword: oldPassword, newPassword: newPassword}, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all listings
   * @returns http response promise
   */
  getAllListings() {
    const params = { company: this.companyService.companyName }; // Add the company name as a query parameter
    return this.http.get(`${this.url}/api/listings`, { params }).toPromise();
  }

  getActiveListings() {
    const params = { company: this.companyService.companyName }; // Add the company name as a query parameter
    return this.http.get(`${this.url}/api/activeListings`, { params }).toPromise();
  }

  /**
   * get all listings made by given user
   * @param userId userID
   * @returns http response promise
   */
  getUserListings(userId: number){
    const params = { company: this.companyService.companyName };
    return this.http.get(`${this.url}/api/listings/user?id=${userId}`, { params }).toPromise();
  }

  /**
   * create listing
   * @param userToken webtoken
   * @param fields (not required)
   *  @field name
   *  @field description
   *  @field availableAssets
   *  @field date
   *  @field price
   *  @field picture: image in base64 format
   *  @field location
   * @returns http response promise
   */
  createListing(userToken: string, fields: Object, companyName: string){
    const data = { ...fields, companyName };
    return this.http.post(`${this.url}/api/listing/create`, data,  {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get listingdata
   * @param id listingID
   * @returns http response promise
   */
  getListing(id: number){
    return this.http.get(`${this.url}/api/listing?id=${id}`).toPromise();
  }

  getTransaction(id: number){
    return this.http.get(`${this.url}/api/transaction?transactionID=${id}`).toPromise();
  }

  /**
   * update listingdata
   * @param id listingID
   * @param userToken webtoken
   * @param fields (not required)
   *  @field name
   *  @field description
   *  @field availableAssets
   *  @field date
   *  @field price
   *  @field picture: image in base64 format
   *  @field location
   * @returns http response promise
   */
  postListing(id: number,  userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/listing?id=${id}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * cancel listing
   * @param id listingID
   * @param userToken webtoken
   * @returns http response promise
   */
  cancelListing(id: number,  userToken: string){
    return this.http.get(`${this.url}/api/listing/cancel?id=${id}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  soldListingStatus(listingID) {
    return this.http.get(`${this.url}/api/listing/soldStatus?id=${listingID}`).toPromise();
  }

  /**
   * get all transactions on a given listing
   * @param listingID listingID
   * @param userToken webtoken
   * @returns http response promise
   */
  getListingTransactions(listingID: number, userToken: string){
    return this.http.get(`${this.url}/api/transactions/listing?id=${listingID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all transactions made by given user
   * @param userToken webtoken
   * @returns http response promise
   */
  getUserTransactions(userToken: string){
    const params = { company: this.companyService.companyName };
    return this.http.get(`${this.url}/api/transactions/user`, {params, headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * create transaction
   * @param userToken webtoken
   * @param fields
   *  @field listingID
   *  @field numberOfAssets
   * @returns http response promise
   */
  createTransaction(userToken: string, fields: Object){
    return this.http.post(`${this.url}/api/transaction/create`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * cancels transaction (doesn't delete)
   * @param transactionID transactionID
   * @param userToken webtoken
   * @returns http response promise
   */
  cancelTransaction(transactionID: number, userToken: string){
    return this.http.get(`${this.url}/api/transaction/cancel?id=${transactionID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * confirm payment of transaction
   * @param transactionID transactionID
   * @param userToken webtoken
   * @returns http response promise
   */
  confirmPayment(transactionID: number, userToken: string){
    return this.http.get(`${this.url}/api/transaction/confirmPayment?id=${transactionID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  // get all categories
  getCategories(){
    const params = {company: this.companyService.companyName}
    return this.http.get(`${this.url}/api/categories`, {params} ).toPromise();
  }

  /**
   * delete category
   * @param name category name
   * @returns http response promise
   */
  deleteCategory(name: string){
    return this.http.post(`${this.url}/api/category/delete`, {name: name}).toPromise();
  }

  /**
   * delete categories with type
   * @param type category type
   * @returns http response promise
   */
  deleteCategoryType(type: string){
    return this.http.post(`${this.url}/api/category/deleteType`, {type: type}).toPromise();
  }

  /**
   * create category
   * @param fields
   *  @field name (required)
   *  @field type
   *  @field company
   * @returns http response promise
   */
  createCategory(fields: any){
    fields.company = this.companyService.companyName
    return this.http.post(`${this.url}/api/category/create`, fields).toPromise();
  }

  createCompany (fields){
      return this.http.post(`${this.url}/api/company/create`, fields).toPromise();
   }

  /**
   * // get all notifications from user
   * @param userToken web token
   * @returns http response promise
   */
  getUserNotifications(userToken: string){
    return this.http.get(`${this.url}/api/notifications`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * mark notification as viewed
   * @param notificationID notificationID
   * @param userToken web token
   * @returns http response promise
   */
  markNotificationAsViewed(notificationID: number, userToken: string){
    return this.http.get(`${this.url}/api/notification/markViewed?id=${notificationID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * delete notifications from user
   * @param userToken web token
   * @returns http response promise
   */
  deleteNotifications(userToken: string){
    return this.http.delete(`${this.url}/api/notification`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * post a review
   * @param transactionID transactionID
   * @param fields
   *  @field comment
   *  @field score [1-5]
   * @returns http response promise
   */
  postReview(userToken: string, transactionID: number, fields: object){
    return this.http.post(`${this.url}/api/review?id=${transactionID}`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get all reviews on listing
   * @param ListingID listingID
   * @returns http response promise
   */
  getListingReviews(listingID: number){
    return this.http.get(`${this.url}/api/reviews/listing?id=${listingID}`).toPromise();
  }

  /**
   * get all reviews on user
   * @param userID userID
   * @returns http response promise
   */
  getUserReviews(userID: number){
    return this.http.get(`${this.url}/api/reviews/user?id=${userID}`).toPromise();
  }

  /**
   * get booking
   * @param userToken web token
   * @param bookingID bookingID
   * @returns http response promise
   */
  getBooking(userToken: string, bookingID: number){
    return this.http.get(`${this.url}/api/booking?id=${bookingID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get bookings on transaction
   * @param userToken web token
   * @param transactionID transactionID
   * @returns http response promise
   */
  getTransactionBookings(userToken: string, transactionID: number){
    return this.http.get(`${this.url}/api/transaction/bookings?id=${transactionID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get bookings of month on listing 
   * @param listingID listingID
   * @param month month
   * @param year year
   * @returns http response promise
   */
  getListingBookings(listingID: number, month: number, year: number){
    return this.http.get(`${this.url}/api/listing/bookings?id=${listingID}&month=${month}&year=${year}`).toPromise();
  }

  /**
   * create booking
   * @param userToken web token
   * @param fields
   *  @field startDate (required)
   *  @field endDate (required)
   *  @field startTime
   *  @field endTime
   *  @field transactionID
   * @returns http response promise
   */
  createBooking(userToken: string, fields: any){
    return this.http.post(`${this.url}/api/booking`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * Add info to booking
   * @param userToken 
   * @param fields
   *   @field bookingID
   *   @field info
   * @returns 
   */
  addBookingInfo(userToken: string, fields: any){
    return this.http.post(`${this.url}/api/booking/info`, fields, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  /**
   * get average review score for seller
   * @param userID userID
   * @returns http response promise
   */
  getSellerRating(userID: number){
    return this.http.get(`${this.url}/api/user/sellerrating?id=${userID}`).toPromise()
  }

  /**
   * get average review score for user
   * @param userToken web token
   * @param userID userID
   * @returns http response promise
   */
  getUserRating(userToken: string, userID: number){
    return this.http.get(`${this.url}/api/user/userrating?id=${userID}`, {headers: this.getTokenHeader(userToken)}).toPromise()
  }


  getTaxonomy() {
    const params = { company: this.companyService.companyName };
    return this.http.get(`${this.url}/api/taxonomy`, {params}).toPromise();
  }

  getConstraints() {
    return this.http.get(`${this.url}/api/constraints`).toPromise();
  }

  getProperties() {
    const params = { company: this.companyService.companyName };
    return this.http.get(`${this.url}/api/properties`, {params}).toPromise();
  }

  getSelectedCompany() {
    return this.http.get(`${this.url}/api/company`).toPromise();
  }

  getCompanies() {
    return this.http.get(`${this.url}/api/companies`).toPromise();
  }

  setCompany(company) {
    return this.http.post(`${this.url}/api/setCompany/${company}`, {}).toPromise();
  }

  createProperty(company: string, property: string){
    return this.http.post(`${this.url}/api/property/create/${property}/${company}`, {}).toPromise();
  }

  deleteProperty(company: string, property: string) {
    return this.http.delete(`${this.url}/api/property/${property}/${company}`).subscribe(response => {
    }, error => {
      console.error("Error deleting record", error);
    });
  }

  postMessage(userToken: string, receiverID: number, message: string){
    return this.http.post(`${this.url}/api/message`, { receiverID: receiverID, message: message}, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  getMessages(userToken: string, userID: number){
    return this.http.get(`${this.url}/api/messages?id=${userID}`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  getLastMessages(userToken: string){
    return this.http.get(`${this.url}/api/lastMessages`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }

  getNewMessagesAmount(userToken: string){
    return this.http.get(`${this.url}/api/newMessages`, {headers: this.getTokenHeader(userToken)}).toPromise();
  }
  
  geoLocate(place){
    return this.http.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json?access_token=${environment.mapbox.accessToken}`).toPromise()
  }

  /**
 * Registers a Verifier in the backend
 * @param fields Verifier information
 * @returns http response promise
 */
  signUpVerifier(fields: Object){
    return this.http.post(`${this.url}/api/auth/signup/verifier`, fields).toPromise();
  }

  /**
 * Fetches all organizations from the backend
 * @returns http response promise
 */
  getOrganizations() {
  return this.http.get<any>(`${this.url}/api/organizations`).toPromise()
    .then(response => response.organizations); // Extract the array from the object
  }

 /**
 * Get all verifiers linked to a specific organization
 * @param organizationID Organization ID
 * @returns List of verifiers belonging to that organization
 */
  getVerifiersByOrganization(organizationID: number) {
    return this.http.get<any>(`${this.url}/api/organizations/${organizationID}/verifiers`).toPromise();
  }

  getAllListingsForVerifier(userToken: string) {
    return this.http.get(`${this.url}/api/verifiers/listings/all`, {
      headers: this.getTokenHeader(userToken)
    }).toPromise();
  }

  getVerifierListing(id: number, token: string) {
    return this.http.get(`${this.url}/api/verifiers/listing/${id}`, {
      headers: this.getTokenHeader(token)
    }).toPromise();
  }

  approveListing(listingId: number, token: string) {
    return this.http.post(
      `${this.url}/api/verifiers/listings/${listingId}/approve`,
      {}, // No body needed
      { headers: this.getTokenHeader(token) }
    ).toPromise();
  }

  rejectListing(listingId: number, token: string) {
    return this.http.post(
      `${this.url}/api/verifiers/listings/${listingId}/reject`,
      {}, // No body needed
      { headers: this.getTokenHeader(token) }
    ).toPromise();
  }









}


