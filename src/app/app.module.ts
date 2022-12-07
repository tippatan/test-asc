import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { ConfirmationService, MessageService } from 'primeng-lts/api';
import { BlockUIModule } from 'primeng-lts/blockui';
import { BreadcrumbModule } from 'primeng-lts/breadcrumb';
import { ButtonModule } from 'primeng-lts/button';
import { CheckboxModule } from 'primeng-lts/checkbox';
import { ChipsModule } from 'primeng-lts/chips';
import { ConfirmDialogModule } from 'primeng-lts/confirmdialog';
import { DropdownModule } from 'primeng-lts/dropdown';
import { InputTextModule } from 'primeng-lts/inputtext';
import { InputTextareaModule } from 'primeng-lts/inputtextarea';
import { MegaMenuModule } from 'primeng-lts/megamenu';
import { PanelModule } from 'primeng-lts/panel';
import { ProgressSpinnerModule } from 'primeng-lts/progressspinner';
import { RadioButtonModule } from 'primeng-lts/radiobutton';
import { ToastModule } from 'primeng-lts/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentModule } from './components/component.module';
import { NumbersOnlyDirectiveModule } from './helpers/directive/numbers-only.directive';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { LoggerInterceptor } from './helpers/logger.interceptor';
import { FilterPipe } from './helpers/pipes/filter.pipe';
import { LoginProfileComponent } from './login-profile/login-profile.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ErrorService } from './services/error.service';
import { SelectButtonModule } from 'primeng-lts/selectbutton';
import { MatDialogModule } from '@angular/material/dialog';
import { MainUnitComponent } from './main-unit/main-unit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginProfileComponent,
    FilterPipe,
    LogoutComponent,
    MainUnitComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MegaMenuModule,
    ButtonModule,
    FontAwesomeModule,
    InputTextModule,
    BrowserAnimationsModule,
    PanelModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    ComponentModule,
    RadioButtonModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    BlockUIModule,
    ConfirmDialogModule,
    BreadcrumbModule,
    ChipsModule,
    FormsModule,
    NumbersOnlyDirectiveModule,
    SelectButtonModule,
    MatDialogModule,
  ],
  exports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    MegaMenuModule,
    ButtonModule,
    FontAwesomeModule,
    InputTextModule,
    BrowserAnimationsModule,
    PanelModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    ComponentModule,
    RadioButtonModule,
    InputTextareaModule,
    ProgressSpinnerModule,
    BlockUIModule,
    ConfirmDialogModule,
    BreadcrumbModule,
    ChipsModule,
    FormsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    MessageService,
    ConfirmationService,
    ErrorService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
