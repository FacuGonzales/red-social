import { Component, OnInit } from '@angular/core';

import { Global }  from '../../../services/global';
import { UserService } from '../../../services/user.service'
import { Router } from '@angular/router';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    styles: []
})

export class SidebarComponent implements OnInit {

    identity;
    token;
    url;
    stats;

    constructor( private userService: UserService,
                 private router: Router) { 
        this.url = Global.url;
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.stats = this.userService.getStats();
    }

    ngOnInit(): void {
        
    }

    editProfile(){
        this.router.navigate(['/edit-profile'])
    }



}
