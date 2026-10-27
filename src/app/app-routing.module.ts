import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestInvitationComponent } from './pages/guest-invitation/guest-invitation.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'invite/thang-lan', pathMatch: 'full' },
  { path: 'invite/:slug', component: GuestInvitationComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: '**', redirectTo: 'invite/thang-lan' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
