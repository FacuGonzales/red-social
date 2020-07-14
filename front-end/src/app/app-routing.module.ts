import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import{  LoginComponent, RegisterComponent, HomeComponent, UserEditComponent, UsersComponent } from './components'
import { UserService } from './services/user.service';
import { ProfileComponent } from './components/profile/profile.component';
import { FollowingComponent } from './components/shared/following/following.component';
import { FollowedComponent } from './components/shared/followed/followed.component';

import { UserGuard } from './services/user.guard';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [UserGuard]  }, //Remplazar por homeComponent
    { path: 'home', component: HomeComponent, canActivate: [UserGuard] },
    { path: 'edit-profile', component: UserEditComponent, canActivate: [UserGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'users', component: UsersComponent, canActivate: [UserGuard] },
    { path: 'users/:page', component: UsersComponent, canActivate: [UserGuard] },
    { path: 'profile/:id', component: ProfileComponent, canActivate: [UserGuard] },
    { path: 'siguiendo/:id/:page', component: FollowingComponent, canActivate: [UserGuard] },
    { path: 'seguidores/:id/:page', component: FollowedComponent, canActivate: [UserGuard] },
    { path: 'mensajes', loadChildren: () =>import('./components/shared/messages/messages.module').then(m => m.MessagesModule), canActivate: [UserGuard]},

    { path: '**', component: HomeComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
