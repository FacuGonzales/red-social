import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Message, Follow, User} from '../../../../models';
import { Global } from '../../../../services/global'
import { MessageService } from '../../../../services/message.service';
import { FollowsService } from '../../../../services/follows.service';
import { UserService } from '../../../../services/user.service'

@Component({
    selector: 'app-received',
    templateUrl: './received.component.html',
    styles: []
})
export class ReceivedComponent implements OnInit {
    url: string;
    identity;
    token;
    messages: Message[];

    page;
    nextPage;
    prevPage;
    total;
    pages;

    constructor(  private route: ActivatedRoute,
                  private router: Router,
                  private alerta: ToastrService,
                  private messageService: MessageService,
                  private userService: UserService,
                  private followsService: FollowsService) {  

        this.url = Global.url;
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
    }

    ngOnInit(): void {
        this.actualPage()
        
    }

    getMessages(token, page){
        this.messageService.getMyMessages(token, page).subscribe(
            respuesta => {
                if(!respuesta.messages){
                   
                }else{
                    this.total = respuesta.total;
                    this.messages = respuesta.messages;
                    this.pages = respuesta.pages;

                    if(page > this.pages){
                        this.router.navigate(['/users', 1])
                    }
                }
            },
            error => {
                this.alerta.error(error);
            }    
        )    
    }

    enviarNuevoMje(){
        this.router.navigate(['/mensajes/enviar'])
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

            this.getMessages(this.token, this.page);
        });

    }

}
