import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}
  apiurl = 'https://burger-queen-mock-server.onrender.com/orders';
  // apiurl = 'http://localhost:8080/orders';
  httpOptions = {
    headers: new HttpHeaders({
      // Authorization es una propiedad, con el valor del token que reicibimos al iniciar sesión en el login
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    }),
  };

  postOrder(order: Order): Observable<any> {
    return this.http.post(this.apiurl, order, this.httpOptions);
  }

  getOrder(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.apiurl}?status=${status}&_sort=dataEntry&_order=asc`,
      this.httpOptions
    );
  }

  patchOrder(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(
      `${this.apiurl}/${id}`,
      { status: status },
      this.httpOptions
    );
  }
}
