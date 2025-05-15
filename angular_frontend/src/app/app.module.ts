import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatNativeDateModule } from '@angular/material/core';

import { CategoriesComponent } from './categories/categories.component';
import { MatIconModule } from '@angular/material/icon';

import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { ListingModule } from './listings/listing.module';

import { TransactionModule } from './transactions/transaction.module';
import { UserModule } from './login/user.module';
import { CompanyService } from './services/company.service';
import { MessagesComponent } from './messages/messages.component';

import { VerifierModule } from './verifier/verifier.module';

@NgModule({
  declarations: [
    AppComponent,
    CategoriesComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    TaxonomyModule,
    ListingModule,
    TransactionModule,
    UserModule,
    NgbModule,
    VerifierModule
  ],
  providers: [CookieService,
    CompanyService,
    MatDatepickerModule,
    MatNativeDateModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
