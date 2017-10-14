import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ApiProvider {
  private apiUrl: string = 'http://localhost:3000/api';

  constructor(public http: Http) {
  }

  public getAPIURL(){
    return this.apiUrl;
  }
}
