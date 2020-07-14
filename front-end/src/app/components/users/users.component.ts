import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { User, Follow } from '../../models';
import { Global } from '../../services/global'
import { UserService } from '../../services/user.service'
import { FollowsService } from '../../services/follows.service'


@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: []
})

export class UsersComponent implements OnInit {

    url: string;
    identity;
    token;
    page;
    nextPage;
    prevPage;
    total;
    pages;
    users: User[];
    follows; 

    followUserOver;

    constructor( private route: ActivatedRoute,
                 private router: Router,
                 private alerta: ToastrService,
                 private userService: UserService,
                 private followsService: FollowsService) {  

        this.url = Global.url;
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
    }

    ngOnInit(): void {
        this.actualPage();
    }

    actualPage(){
        this.route.params.subscribe( params => {
            let page = +params['page'];
            this.page = page;

            if(!params['page']){
                page = 1
            }

            if(!page){
                page = 1;
            }else{
                this.nextPage = page+1;
                this.prevPage = page-1;

                if(this.prevPage <= 0){
                    this.prevPage = 1;
                }
            }

            this.getUsers(page);
        });

    }

    getUsers(page){
        this.userService.getUsers(page).subscribe( 
            resultado => {
                if(!resultado.users){
                    this.alerta.error('Error al obtener los usuarios');
                }else{
                    this.total = resultado.total;
                    this.users = resultado.users;
                    this.pages = resultado.pages;
                    this.follows = resultado.users_following;

                    console.log(this.follows)

                    if(page > this.pages){
                        this.router.navigate(['/users', 1])
                    }
                }
            },
            error => {
                this.alerta.error(error);
            });
    }


    mouseEnter(user_id){
        this.followUserOver = user_id;
        
    }
    
    mouseLeave(user_id){
        this.followUserOver = 0;
    }

    followUser(followed){
        var follow = new Follow('', this.identity._id, followed);

        this.followsService.addFollow(this.token, follow).subscribe(
            respuesta => {
                if(!respuesta.follow){
                    this.alerta.error('Error');
                }else{
                    this.alerta.success('Has comenzado a seguirlo correctamente!');

                    this.follows.push(followed);

                    console.log(this.identity);
                }
            },
            error => {
                this.alerta.error(error);
            }
        )
    }

    unFollowUser(followed){
        this.followsService.deleteFollow(this.token, followed).subscribe(
            respuesta => {
                var search = this.follows.indexOf(followed);

                if(search != -1){
                    this.follows.splice(search, 1);
                    this.alerta.success('Has dejado de seguirlo correctamente!');
                }
            },
            error => {
                this.alerta.error(error);
            }
        )
    }

}
