import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';

import { User } from '../../models';
import { ToastrService } from 'ngx-toastr';

import { UserService } from '../../services/user.service'

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: [],
    providers: [
        UserService
    ]
})
export class RegisterComponent implements OnInit {

    user: User;
    registerForm: FormGroup;

    emailValid: boolean;
    passValid: boolean;
    repeatPassValid: boolean;
    password: string;
    regPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&+=!_*-]{8,14}$/;

    constructor( private route: ActivatedRoute,
                 private router: Router,
                 private alert: ToastrService,
                 private fb: FormBuilder,
                 private userService: UserService) { 
        
        this.user = new User('', '', '', '', '', '', '', '');
    }

    ngOnInit(): void {
        this.formInit();
    }

    formInit(){
        this.registerForm = new FormGroup({ //this.fb.group({
            name: new FormControl(),// ['', [Validators.required]],
            surname: new FormControl(),
            email: new FormControl(),
            nick: new FormControl(),
            password: new FormControl(),
            repeatPassword: new FormControl(),
        })
    }

    //esRequerido(field:string ){
    //    return (this.rolEditForm.get(field).getError("required"));
    //}

    register(){
        // Validamos si se completo el campo de name
        if(this.registerForm.get('name').value){
            // Validamos si se completo el campo de surname
            if(this.registerForm.get('surname').value){
                // Validamos si se completo el campo de email
                if(this.registerForm.get('email').value){
                    // Validamos si el email es valido
                    if(this.emailValid == true){
                        // Validamos si se completo el campo de nick
                        if(this.registerForm.get('nick').value){
                            // Validamos si se completo el campo de password
                            if(this.registerForm.get('password').value){
                                // Valido que la password sea valida
                                if(this.passValid == true){
                                    // Validamos que se repitio la password
                                    if(this.registerForm.get('repeatPassword').value){
                                        // Validamos que la password repetida coincida
                                        if(this.repeatPassValid == true){
                                            
                                            // TODO SE COMPLETO OK, GUARDAMOS EL NUEVO USUARIO!
                                            this.user.name = this.registerForm.get('name').value;
                                            this.user.surname = this.registerForm.get('surname').value
                                            this.user.nick = this.registerForm.get('nick').value
                                            this.user.email = this.registerForm.get('email').value
                                            this.user.password = this.registerForm.get('password').value
                                            
                                            this.userService.register(this.user).subscribe( resultado => {
                                                if(resultado.user && resultado.user._id){

                                                    this.registerForm.reset();

                                                    this.alert.success('El registro se realizo con exito');
                                                    this.router.navigate(['/login']);
                                                }
                                            }, error => {
                                                this.alert.error(error.error.message)
                                            });


                                        }else{
                                            this.alert.error('Las contraseñas no coinciden, por favor reviselas.');
                                        };
                                    }else{
                                        this.alert.warning('Aún te falta REPETIR LA CONTRASEÑA');
                                    };
                                }else{
                                    this.alert.error('El formato de la contraseña no es válida! Debe ser alfanúmerica, y contener al menos una mayúscula.');
                                };
                            }else{
                                this.alert.warning('Aún te falta completar el campo de "CONTRASEÑA"');
                            };
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

    cancel(){
        this.registerForm.reset();
        this.router.navigate(['/login']);
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

    validarPassword(value){
        this.password  = value
        this.passValid = this.regPass.test(value)
    }

    validarRepeatPass(value){
        if(this.password == value){
            this.repeatPassValid = true;
        }else{
            this.repeatPassValid = false
        }
    }
}
