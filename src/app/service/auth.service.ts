import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/users.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // declarando dependencias que usaremos en la clase
  constructor(private http: HttpClient) {}
  // Declarando e inicializando variable apiurl que se usará para consultar a json-server-auth
  apiurl: string = 'https://burger-queen-mock-server.onrender.com/login';
  apiurlUsers: string = 'https://burger-queen-mock-server.onrender.com/users';
  // apiurl: string = 'http://localhost:8080/login';
  // apiurlUsers: string = 'http://localhost:8080/users';

  // Método que devuelve un observable: (es una colección de futuros valores=Promesa )
  methodLogin(email: string, password: string): Observable<any> {
    // Accediendo al método post  de la variable http de HttpClient que recibe como parámetros la url y el body de la solicitud (objeto con propiedades email y password recibidos como parámetros)
    return this.http.post(this.apiurl, {
      email: email,
      password: password,
    });
  }

  postUser(user: User): Observable<any> {
    const httOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      }),
    };
    return this.http.post<User>(this.apiurlUsers, user, httOptions);
  }

  getUsers(): Observable<User[]> {
    const httOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      }),
    };
    return this.http.get<User[]>(this.apiurlUsers, httOptions);
  }

  putUser(id: string, user: User): Observable<User> {
    const httOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      }),
    };
    return this.http.put<User>(`${this.apiurlUsers}/${id}`, user, httOptions);
  }

  deleteUser(id: string): Observable<User> {
    const httOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      }),
    };
    return this.http.delete<User>(`${this.apiurlUsers}/${id}`, httOptions);
  }
}
