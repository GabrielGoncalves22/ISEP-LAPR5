import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { LogoutComponent } from './authentication/logout/logout.component';
import { VerifyAuthService } from './verify-auth.service';
import { Role } from './user/models/role';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent, canActivate: [VerifyAuthService] },
    { path: 'campus', loadChildren: () => import('./campus/campus.module').then(m => m.CampusModule), canActivate: [VerifyAuthService], data: { roles: [Role.CampusManager] } },
    { path: 'fleet', loadChildren: () => import('./fleet/fleet.module').then(m => m.FleetModule), canActivate: [VerifyAuthService], data: { roles: [Role.FleetManager] } },
    { path: 'task', loadChildren: () => import('./task/task.module').then(m => m.TaskModule) },
    { path: 'visualization', loadChildren: () => import('./visualization/visualization.module').then(m => m.VisualizationModule), canActivate: [VerifyAuthService], data: { roles: [Role.CampusManager, Role.FleetManager, Role.TaskManager] } },
    { path: 'administration', loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule), canActivate: [VerifyAuthService], data: { roles: [Role.SystemManager] } },
    { path: 'info', loadChildren: () => import('./info/info.module').then(m => m.InfoModule) },
    { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), canActivate: [VerifyAuthService], data: { roles: [Role.SystemManager] } },
    { path: 'profile', component: ProfileComponent, canActivate: [VerifyAuthService], data: { roles: [Role.User] } },
    { path: 'logout', component: LogoutComponent, canActivate: [VerifyAuthService] }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }
