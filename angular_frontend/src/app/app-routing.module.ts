import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { ListingDetailComponent } from './listings/listingdetail/listingdetail.component';
import { CreateEditListingComponent } from './listings/createeditlisting/createeditlisting.component';
import { ListingsComponent } from './listings/listings.component';
import { MylistingsComponent } from './listings/mylistings/mylistings.component'
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { TransactiondetailComponent } from './transactions/transactiondetail/transactiondetail.component'
import { TaxonomyComponent } from './taxonomy/taxonomy.component';
import { NotFoundComponent } from './404/404.component';
import { MessagesComponent } from './messages/messages.component';
import { MylistingsverifierComponent } from './verifier/listings/mylistingsverifier/mylistingsverifier.component';
import { ListingdetailverifierComponent } from './verifier/listingdetailverifier/listingdetailverifier.component';


const routes: Routes = [
  { path: '', redirectTo: '/listings', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'profile/changePassword', component: ChangePasswordComponent },
  { path: 'listings', component: ListingsComponent },
  { path: 'mylistings', component: MylistingsComponent},
  { path: 'listings/details/:id', component: ListingDetailComponent },
  { path: 'listings/details/:id/:type', component: ListingDetailComponent },
  { path: 'listings/createEditListing', component: CreateEditListingComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'transactions/details/:id', component: TransactiondetailComponent },
  { path: 'transactions/details/:id/:type', component: TransactiondetailComponent },
  { path: 'taxonomy', component: TaxonomyComponent },
  { path: 'messages', component: MessagesComponent},
  { path: 'verifier/mylistings', component: MylistingsverifierComponent},
  { path: 'verifier/mylistings/details/:id', component: ListingdetailverifierComponent },
  { path: '**', component: NotFoundComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
