import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { User, Follow } from '../../../models';
import { Global } from '../../../services/global'
import { UserService } from '../../../services/user.service'
import { FollowsService } from '../../../services/follows.service'

@Component({
    selector: 'app-following',
    templateUrl: './following.component.html',
    styleUrls: [],
    providers: [FollowsService]
})
export class FollowingComponent implements OnInit {
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
    following;
    followUserOver;
    userPageId;
    user;
    
    constructor(  private route: ActivatedRoute,
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
            let user_id = params['id'];
            this.userPageId = user_id;
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

            this.getUser(user_id, page)
        });

    }

    getFollows(user_id, page){
        this.followsService.getFollowing(this.token, user_id, page).subscribe( 
            resultado => {
                if(!resultado.follows){
                    this.alerta.error('Error al obtener los usuarios');
                }else{
                    console.log(resultado)
                    this.total = resultado.total;
                    this.following = resultado.follows;
                    this.pages = resultado.pages;
                    this.follows = resultado.users_following;

                    if(page > this.pages){
                        this.router.navigate(['/users', 1])
                    }
                }
            },
            error => {
                this.alerta.error(error);
            }
        );
    }


    getUser(user_id, page){
        this.userService.getUser(user_id).subscribe(
            respuesta => {
                if(respuesta.user){
                    this.user = respuesta.user;
                    this.getFollows(user_id, page);
                }else{
                    this.router.navigate(['/home']);
                }
                
            },
            error => {
                this.alerta.error(error)
            }
        )
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
