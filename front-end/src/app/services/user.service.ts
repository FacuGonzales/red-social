import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable' 
import { Global } from './global';
import { User } from '../models';


@Injectable({
    providedIn: 'root'
})

export class UserService {

    url: string;
    identity;
    token;

    constructor( public http: HttpClient) {
        this.url = Global.url;
    }

    register(user: User): Observable<any>{
        let params = JSON.stringify(user);

        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post(this.url+'register', params, {headers: headers});

    }

    signup(user, gettoken = null): Observable<any>{
        if(gettoken != null){
            user.gettoken = gettoken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post(this.url+'login', params, {headers: headers});
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity != 'undefined'){
            this.identity = identity;
        }else{
            this.identity = null;
        };

        return this.identity;
    }

    getToken(){
        let token = JSON.parse(localStorage.getItem('token'));

        if(token != 'undefined'){
            this.token = token;
        }else{
            this.token = null;
        };

        return this.token;
    }
    

    getStats(){
        let stats = JSON.parse(localStorage.getItem('stats'));
        
        if(stats != 'undefined'){
            stats = stats;
        }else{
            stats = null;
        }

        return stats;
    }

    getCounters(userId = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        
        if(userId != null){
            return this.http.get(this.url+'counters/'+userId, {headers: headers});
        }else{
            return this.http.get(this.url+'counters', {headers: headers});
        }
    }

    updateUser(user: User ): Observable<any>{
        let params = JSON.stringify(user);

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());

        return this.http.put(this.url+'update-user/'+user._id, params, {headers: headers});
    }

    getUsers(page = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());

        return this.http.get(this.url+'users/'+page, {headers: headers});
    }
    
    getUser(id): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());

        return this.http.get(this.url+'user/'+id, {headers: headers});
    }

}
