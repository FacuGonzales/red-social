import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { MessagesRoutingModule } from './messages-routing.module';

import { MessagesComponent } from './main/messages.component';
import { AddComponent } from './add/add.component';
import { ReceivedComponent } from './received/received.component';
import { SendedComponent } from './sended/sended.component';


// Material

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';



@NgModule({
    declarations: [
        MessagesComponent,
        AddComponent,
        ReceivedComponent,
        SendedComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MessagesRoutingModule,
        MomentModule,
        MatFormFieldModule,
        MatInputModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTooltipModule,
        MatDividerModule,
        MatDialogModule,
        MatSelectModule
    ],
    exports: [
        MessagesComponent,
        AddComponent,
        ReceivedComponent,
        SendedComponent
    ],
    providers: []
})

export class MessagesModule { }
