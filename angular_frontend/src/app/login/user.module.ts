import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './login.component';
import { SignupComponent } from '../signup/signup.component';
import { ProfileComponent } from '../profile/profile.component';
import { ChangePasswordComponent } from '../profile/change-password/change-password.component';
import { UserService } from '../services/user.service';

@NgModule({
    declarations: [
        LoginComponent,
        SignupComponent,
        ProfileComponent,
        ChangePasswordComponent
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
    ],
    providers: [
        UserService
    ]
})
export class UserModule { }