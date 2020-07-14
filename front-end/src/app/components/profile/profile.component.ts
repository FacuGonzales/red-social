import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Global }  from '../../services/global';
import { UserService } from '../../services/user.service';
import { FollowsService } from '../../services/follows.service';

import { Publication, Follow, User } from '../../models';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

    user: User;
    identity;
    token;
    url;
    stats;
    followed: boolean = false;
    following: boolean = false;

    followUserOver;

    constructor(private userService: UserService,
                private followService: FollowsService,
                private router: Router,
                private route: ActivatedRoute,
                private alert: ToastrService) {
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.url = Global.url;
    }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(){
       this.route.params.subscribe(params => {
           let id = params['id'];

           this.getUser(id);
           this.getCounters(id);
       })
    }

    getUser(id){
        this.userService.getUser(id).subscribe(
            respuesta => {
                if(respuesta.user){
                    this.user = respuesta.user;

                    console.log(respuesta)
                    if(respuesta.following){
                        if(respuesta.following._id){
                            this.following = true;
                        }else{
                            this.following = false;
                        }
                    }

                    if(respuesta.followed){
                        if(respuesta.followed._id){
                            this.followed = true;
                        }else{
                            this.followed = false;
                        }
                    }

                }else{
                    this.alert.error('Error al obtener usuario');
                }
            },
            error => {
                this.alert.error(error.error.message);
                this.router.navigate(['/profile', this.identity._id])
            }
        )
    }

    getCounters(id){
        this.userService.getCounters(id).subscribe(
            respuesta => {
                this.stats = respuesta;
            },
            error => {
                this.alert.error(error);
            }
        )
    }

    seguir(followed){
        var follow = new Follow('', this.identity._id, followed);

        this.followService.addFollow(this.token, follow).subscribe(
            respuesta => {
                this.following = true;
            },
            error => {
                this.alert.error(error);
            }
        )
    }

    dejarDeSeguir(followed){
        this.followService.deleteFollow(this.token, followed).subscribe(
            respuesta => {
                this.following = false;
            },
            error => {
                this.alert.error(error);
            }
        )
    }

    mouseEnter(user_id){
        this.followUserOver = user_id;
    }

    mouseLeave(){
        this.followUserOver = 0;
    }

}
