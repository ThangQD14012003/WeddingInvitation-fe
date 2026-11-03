import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';

registerLocaleData(localeVi, 'vi-VN');
registerLocaleData(localeVi, 'vi');

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GuestInvitationComponent } from './pages/guest-invitation/guest-invitation.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { HomeLandingComponent } from './pages/home-landing/home-landing.component';
import { SuperAdminComponent } from './pages/super-admin/super-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    GuestInvitationComponent,
    AdminDashboardComponent,
    HomeLandingComponent,
    SuperAdminComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
