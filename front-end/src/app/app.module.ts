import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MomentModule } from 'ngx-moment';

// Modulos
import { MessagesModule } from './components/shared/messages/messages.module';

// Components
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { PublicationComponent } from './components/shared/publication/publication.component';
import { ListPublicationsComponent } from './components/shared/list-publications/list-publications.component';
import { DeletePublicationModalComponent } from './components/shared/delete-publication-modal/delete-publication-modal.component';
import { ProfileComponent } from './components/profile/profile.component';


// Material
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import { FollowingComponent } from './components/shared/following/following.component';
import { FollowedComponent } from './components/shared/followed/followed.component';

// Servicios
import { UserService } from './services/user.service';
import { UserGuard } from './services/user.guard';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        UserEditComponent,
        UsersComponent,
        SidebarComponent,
        PublicationComponent,
        ProfileComponent,
        ListPublicationsComponent,
        DeletePublicationModalComponent,
        FollowingComponent,
        FollowedComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MomentModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot(), // ToastrModule added
        MessagesModule,
        MatToolbarModule,
        MatInputModule,
        MatFormFieldModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatTooltipModule,
        MatDividerModule,
        MatDialogModule
    ],
    entryComponents:[
        // Los componentes modales
        DeletePublicationModalComponent
    ],
    providers: [
        UserService,
        UserGuard
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }
