import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from './services/user.service'
import { Global } from './services/global';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [],
    providers: [
        UserService
    ]
})

export class AppComponent implements OnInit, DoCheck{

    identity;
    url: string;

    years: number;
    constructor(private route: ActivatedRoute,
                private router: Router,
                private userService: UserService) {
            
            this.url = Global.url
            this.years = Date.now();
    }

    ngOnInit(): void {
        this.identity = this.userService.getIdentity();
    }

    ngDoCheck(){
        this.identity = this.userService.getIdentity();
    }

    logOut(){
        localStorage.clear();
        this.identity = null;
        this.router.navigate(['/']);
    }

}
