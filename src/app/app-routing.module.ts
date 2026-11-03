import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestInvitationComponent } from './pages/guest-invitation/guest-invitation.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { HomeLandingComponent } from './pages/home-landing/home-landing.component';
import { SuperAdminComponent } from './pages/super-admin/super-admin.component';

const routes: Routes = [
  { path: '', component: HomeLandingComponent },
  { path: 'templates', component: HomeLandingComponent },
  { path: 'super-admin', component: SuperAdminComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'invite/:slug', component: GuestInvitationComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
