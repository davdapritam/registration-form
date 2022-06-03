import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { DragDropListnerDirective } from './directives/drag-drop-listner.directive';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { AlertModalComponent } from './shared/components/alert-modal/alert-modal.component';
import { NoAccessComponent } from './components/no-access/no-access.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ForbiddenAccessComponent } from './components/forbidden-access/forbidden-access.component';
import { ContinueRegistrationDialogComponent } from './registration/continue-registration-dialog/continue-registration-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    DragDropListnerDirective,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    AlertModalComponent,
    NoAccessComponent,
    PageNotFoundComponent,
    ForbiddenAccessComponent,
    ContinueRegistrationDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot({
      positionClass :'toast-top-right'
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  entryComponents: [AlertModalComponent,ContinueRegistrationDialogComponent],
})
export class AppModule { }
