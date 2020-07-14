import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { User } from '../../models';
import { UserService } from '../../services/user.service'
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [],
    providers: [
        UserService
    ]
})
export class LoginComponent implements OnInit {

    user: User;
    loginForm: FormGroup;
    identity;
    token;

    constructor( private route: ActivatedRoute,
                 private router: Router,
                 private alert: ToastrService,
                 private userService: UserService) { 
        
        this.user = new User('', '', '', '', '', '', '', '');
    }

    ngOnInit(): void {
        this.formInit();
    }

    formInit(){
        this.loginForm = new FormGroup({ 
            email: new FormControl(),
            password: new FormControl(),
        })
    }

    login(){
        if(this.loginForm.get('email').value){
            if(this.loginForm.get('password').value){

                //Logueamos al usuario y conseguimos datos
                this.user.email = this.loginForm.get('email').value
                this.user.password = this.loginForm.get('password').value

                this.userService.signup(this.user).subscribe(
                    respuesta => {
                        this.identity = respuesta.user;

                        if(!this.identity || !this.identity._id){
                            this.alert.error('Error al loguear');
                        }else{
                            
                            //Persistir los datos del usuario
                            localStorage.setItem('identity', JSON.stringify(this.identity));

                            // Conseguir el token
                            this.getToken();
                        }
                    },
                    error => {
                        this.alert.error(error.error.message);
                    }
                )

            }else{
                this.alert.warning('Debes ingresar tu contraseña para poder loguearte!.')
            };
        }else{
            this.alert.warning('Debes ingresar un correo.')
        };
       
    }

    resetPassword(){
        console.log('Reset password')
    }

    redirectToRegister(){
        this.router.navigate(['/register']);
    }


    getToken(){
        this.user.email = this.loginForm.get('email').value
        this.user.password = this.loginForm.get('password').value

        this.userService.signup(this.user, 'true').subscribe(
            respuesta => {
                this.token = respuesta.token;

                if(this.token.length <= 0){
                    this.alert.error('Error al loguear');
                }else{
                   
                    //Persistir token
                    localStorage.setItem('token', JSON.stringify(this.token));

                    // Conseguir los contadores o estadisticas del usuario
                    this.getCounters();

                    this.router.navigate(['/home']);

                }
            },
            error => {
                this.alert.error(error.error.message);
            }
        )
    }

    getCounters(){
        this.userService.getCounters().subscribe(
            resultado => {
                localStorage.setItem('stats', JSON.stringify(resultado));
                this.alert.success('Bienvenido de nuevo!');
            },
            error => {
                console.log(error)
            }
        )
    }

}
