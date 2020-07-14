import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable' 
import { Global } from './global';
import { User } from '../models';

@Injectable({
    providedIn: 'root'
})

export class FollowsService {

    url: string;
    identity;
    token;

    constructor( public http: HttpClient) {
        this.url = Global.url;
    }

    addFollow(token, follow): Observable<any>{
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this.http.post(this.url+'follow', params, {headers: headers});
    }

    deleteFollow(token, id): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this.http.delete(this.url+'follow/'+id, {headers: headers});
    }


    getFollowing(token, user_id = null, page = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);

        var url = this.url+'following';

        if(user_id != null){
            var url = this.url+'following/'+user_id+'/'+page;
        }

        return this.http.get(url, {headers: headers});
    }

    getFollowed(token, user_id = null, page = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);

        var url = this.url+'followed';

        if(user_id != null){
            var url = this.url+'followed/'+user_id+'/'+page;
        }

        return this.http.get(url, {headers: headers});
    }

    getMyFollos(token): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);

        return this.http.get(this.url+'get-my-follows/true', {headers: headers});
    }
}
