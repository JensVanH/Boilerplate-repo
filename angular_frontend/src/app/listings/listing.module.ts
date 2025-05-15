import { NgModule } from '@angular/core';
import { ListingDetailComponent } from './listingdetail/listingdetail.component';
import { CreateEditListingComponent } from './createeditlisting/createeditlisting.component';
import { ListingsComponent } from './listings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MylistingsComponent } from './mylistings/mylistings.component';

@NgModule({
    declarations: [
        ListingsComponent,
        ListingDetailComponent,
        CreateEditListingComponent,
        MylistingsComponent
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
    ],
    exports: [
    ]
})
export class ListingModule { }