import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // ✅ Keep this
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MylistingsverifierComponent } from './listings/mylistingsverifier/mylistingsverifier.component';
import { ListingdetailverifierComponent } from './listingdetailverifier/listingdetailverifier.component';

@NgModule({
  declarations: [
    MylistingsverifierComponent,
    ListingdetailverifierComponent
  ],
  imports: [
    CommonModule, // ✅ For *ngIf, *ngFor, etc.
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ]
})
export class VerifierModule { }
