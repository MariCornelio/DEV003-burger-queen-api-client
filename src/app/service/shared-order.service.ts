import { Injectable, EventEmitter } from '@angular/core';
import { Products, ProductsQty } from '../interfaces/products.interface';
// rxjs: Reactive Extensions Library for JavaScript
import { BehaviorSubject, Observable } from 'rxjs';
import { Order } from '../interfaces/order.interface';
import { OrderService } from './order.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SharedOrderService {
  // Se declara y define la variable orden como un array vacío
  productsOrder: ProductsQty[] = [];
  order: Order[] = [];
  // comunicar componentes en angular (inputs y outputs)
  $modal = new EventEmitter<any>();
  $modalUser = new EventEmitter<any>();
  $modalProduct = new EventEmitter<any>();

  constructor(
    private orderHttpSvc: OrderService,
    private toastr: ToastrService
  ) {}

  private productsOrderSubject = new BehaviorSubject<ProductsQty[]>([]);
  private totalSubject = new BehaviorSubject<number>(0);
  private orderSubject = new BehaviorSubject<Order[]>([]);
  private qtySubject = new BehaviorSubject<number>(0);

  get productsOrder$(): Observable<ProductsQty[]> {
    return this.productsOrderSubject.asObservable();
  }

  get total$(): Observable<number> {
    return this.totalSubject.asObservable();
  }

  get order$(): Observable<Order[]> {
    return this.orderSubject.asObservable();
  }

  get qty$(): Observable<number> {
    return this.qtySubject.asObservable();
  }

  private addToProduct(product: Products): void {
    const isProductInOrder: ProductsQty | undefined = this.productsOrder.find(
      (el) => el.product.id === product.id
    );
    if (isProductInOrder) {
      isProductInOrder.qty += 1;
    } else {
      this.productsOrder.push({ product: product, qty: 1 });
    }
    this.productsOrderSubject.next(this.productsOrder);
  }

  private totalCount(): void {
    const total: number = this.productsOrder.reduce(
      (total, el) => (total += el.product.price * el.qty),
      0
    );
    return this.totalSubject.next(total);
  }

  private addToOrder(client: string, tableNum: number | null): void {
    // creando body para el post
    const orderObj = {
      userId: sessionStorage.getItem('idUser'),
      client: client,
      tableNum: tableNum,
      products: this.productsOrder,
      status: 'pending',
      dataEntry: new Date(),
    };
    // enviando orden al servidor
    this.orderHttpSvc.postOrder(orderObj).subscribe({
      error: (error) => {
        this.toastr.error(error.error, 'something went wrong');
      },
    });
  }

  resetProductsOrder(): void {
    this.totalSubject.next(0);
    this.qtySubject.next(0);
    this.productsOrderSubject.next([]);
    this.productsOrder = [];
  }

  onClickAddOrder(client: string, tableNum: number | null) {
    this.addToOrder(client, tableNum);
  }

  onClickAddProduct(product: Products): void {
    this.addToProduct(product);
    this.totalCount();
    this.qtyAddedProducts();
  }

  deleteProduct(id: string): void {
    this.productsOrder = this.productsOrder.filter((el) => {
      return el.product.id !== id;
    });
    this.productsOrderSubject.next(this.productsOrder);
    this.totalCount();
    this.qtyAddedProducts();
  }

  qtyOperations(operations: string, id: string) {
    const product = this.productsOrder.find((el) => {
      return el.product.id === id;
    });
    if (product) {
      if (operations === 'minus' && product.qty > 0) {
        product.qty = product.qty - 1;
        this.totalCount();
        this.qtyAddedProducts();
      }
      if (operations === 'add') {
        product.qty = product.qty + 1;
        this.totalCount();
        this.qtyAddedProducts();
      }
      if (product.qty === 0) {
        this.deleteProduct(id);
        this.qtyAddedProducts();
      }
    }
  }

  qtyAddedProducts() {
    const qty: number = this.productsOrder.reduce((a, b) => (a = a + b.qty), 0);
    this.qtySubject.next(qty);
  }

  
}
