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
    selector: 'app-add',
    templateUrl: './add.component.html',
    styles: []
})
export class AddComponent implements OnInit {
    url: string;
    message: Message;
    identity;
    token;
    follows;

    sendMessage: FormGroup;


    constructor(  private route: ActivatedRoute,
                  private router: Router,
                  private alerta: ToastrService,
                  private messageService: MessageService,
                  private userService: UserService,
                  private followsService: FollowsService) {  

        this.url = Global.url;
        this.identity = this.userService.getIdentity();
        this.token = this.userService.getToken();
        this.message = new Message('', '', '', '',  this.identity._id, '');
    }

    ngOnInit(): void {
        this.formInit();
        this.getMyFollows();
    }

    formInit(){
        this.sendMessage = new FormGroup({
            para: new FormControl(),
            message: new FormControl(),
        })
    }

    getMyFollows(){
        this.followsService.getMyFollos(this.token).subscribe(
            resultado => {
                this.follows = resultado.follows
            },
            error => {
                this.alerta.error(error)
            }
        )
    }

    enviar(){
        if(this.sendMessage.get('para').value){
            if(this.sendMessage.get('message').value){

                this.message.receiver = this.sendMessage.get('para').value;
                this.message.text = this.sendMessage.get('message').value;

                this.messageService.addMessage(this.token, this.message).subscribe(
                    respuesta => {
                        if(respuesta.message){
                            this.alerta.success('Mensaje enviado');
                            this.sendMessage.reset();
                        }
                    },
                    error => {
                        this.alerta.error(error)
                    }
                )

            }else{
                this.alerta.warning('Falta escribir un mensaje');
            }
        }else{
            this.alerta.warning('Debes indicar un destino para tu mensaje.')
        }

    }

}
