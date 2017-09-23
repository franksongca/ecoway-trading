import { Injectable, ReflectiveInjector } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigService {
  private static _http;
  private static Data;

  constructor(private http: Http) {
    ConfigService._http = http;
  }

  public static getConfig(): Observable<any> {
    let observable;

    if (ConfigService.Data && (Object.keys(ConfigService.Data).length > 0)) {
      console.log('return loaded config.');
      observable = Observable.of(ConfigService.Data);
    } else {
      observable = ConfigService._http.get('./assets/config.json')
        .map(response => response.json());

      observable.subscribe(
        response => {
          ConfigService.Data = response;
          console.log('load and return the config.');
        },
        (err) => console.log('error occurs', err.message)
      );
    }

    return observable;
  }


}
