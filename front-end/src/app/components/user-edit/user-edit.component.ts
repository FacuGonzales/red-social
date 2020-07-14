import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from '../../models';

import { Global } from '../../services/global';
import { UserService } from '../../services/user.service'
import { UploadService } from '../../services/upload.service';
import { ToastrService } from 'ngx-toastr';



@Component({
    selector: 'app-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: []
})
export class UserEditComponent implements OnInit {

    url: string;

    user: User;
    identity;
    token;
    updateForm: FormGroup;
    filesToUpload: Array<File>;

    emailValid: boolean;
   

    constructor(  private route: ActivatedRoute,
                  private router: Router,
                  private alert: ToastrService,
                  private fb: FormBuilder,
                  private userService: UserService,
                  private uploadService: UploadService) { 

        this.user = this.userService.getIdentity();
        this.identity = this.user;
        this.token = this.userService.getToken();
        this.url = Global.url;

    }

    ngOnInit(): void {
        this.formInit();
    }

    formInit(){
        this.updateForm = new FormGroup({ //this.fb.group({
            name: new FormControl(),// ['', [Validators.required]],
            surname: new FormControl(),
            email: new FormControl(),
            nick: new FormControl()
        })
    }

    updateProfile(){
        // Validamos si se completo el campo de name
        if(this.updateForm.get('name').value){
            // Validamos si se completo el campo de surname
            if(this.updateForm.get('surname').value){
                // Validamos si se completo el campo de email
                if(this.updateForm.get('email').value){
                    // Validamos si el email es valido
                    if(this.emailValid == true){
                        // Validamos si se completo el campo de nick
                        if(this.updateForm.get('nick').value){
                            // Validamos si se completo el campo de password
                            
                                            
                            // TODO SE COMPLETO OK, GUARDAMOS EL NUEVO USUARIO!
                            this.user.name = this.updateForm.get('name').value;
                            this.user.surname = this.updateForm.get('surname').value
                            this.user.nick = this.updateForm.get('nick').value
                            this.user.email = this.updateForm.get('email').value

                            this.userService.updateUser(this.user).subscribe(
                                resultado => {
                                    if(!resultado.user){
                                        this.alert.error('Error al actualizar datos');
                                    }else{
                                        this.alert.success('Se modificaron correctamente los datos.')
                                        localStorage.setItem('identity', JSON.stringify(this.user));
                                        this.identity = this.user;

                                        // Subida de archvos
                                        this.uploadService.makeFileRequest(this.url+'upload-image-user/'+this.user._id, [], this.filesToUpload, this.token, 'image')
                                                          .then((result: any) => {
                                                            this.user.image = result.user.image;
                                                            localStorage.setItem('identity', JSON.stringify(this.user));
                                                          });

                                        // this.router.navigate(['/home']);
                                    }
                                },
                                error => {
                                    this.alert.error(error.error.message)
                                }
                            )
                            
                             
                        }else{
                            this.alert.warning('Aún te falta completar el campo de "NOMBRE DE USUARIO"');
                        }; 
                    }else{
                        this.alert.error('El correo ingresado no es válido!');
                    }
                }else{
                    this.alert.warning('Aún te falta completar el campo de "CORREO"');
                };
            }else{
                this.alert.warning('Aún te falta completar el campo de "APELLIDO"');
            };
        }else{
            this.alert.warning('Falta completar el campo de "NOMBRE"');
        };
    }

    fileChangeName(fileInput: any){    
        this.filesToUpload = <Array<File>>fileInput.target.files;
        console.log(this.filesToUpload);
    }

    cancel(){
        this.updateForm.reset();
        this.router.navigate(['/home']);
    }

    validarUserName(value) {
        'use strict';
        var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    

        if (value.match(EMAIL_REGEX)){
            this.emailValid = true;
        }else{
            this.emailValid = false;
        }
    }

}
