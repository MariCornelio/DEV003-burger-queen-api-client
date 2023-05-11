import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveredComponent } from './delivered.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OrderService } from 'src/app/service/order.service';
import { Observable, of, throwError } from 'rxjs';
import { Order } from 'src/app/interfaces/order.interface';

class OrderTestingService {
  getOrder(status: string): Observable<Order[]> {
    const order = {
      id: '1',
      userId: '1',
      client: 'MariAle',
      tableNum: 17,
      products: [
        {
          qty: 1,
          product: {
            id: '3',
            name: 'burger',
            price: 3,
            image: 'www.image.com',
            type: 'lunch',
            dateEntry: new Date('Thu May 11 2023 09:57:55 GMT-0500'),
          },
        },
      ],
      status,
      dataEntry: new Date('Thu May 11 2023 09:57:55 GMT-0500'),
    };
    return of([order]);
  }
  patchOrder(id: string, status: string) {
    return of();
  }
}

describe('DeliveredComponent', () => {
  let component: DeliveredComponent;
  let fixture: ComponentFixture<DeliveredComponent>;
  let toastr: ToastrService;
  let orderHttpSvc: OrderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
      declarations: [DeliveredComponent],
      providers: [
        ToastrService,
        {
          provide: OrderService,
          useClass: OrderTestingService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    toastr = TestBed.inject(ToastrService);
    orderHttpSvc = TestBed.inject(OrderService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component).toBeDefined();
  });

  it('Should throw an error if getOrder fails', () => {
    spyOn(orderHttpSvc, 'getOrder').and.callFake(() =>
      throwError(() => 'Error')
    );
    spyOn(toastr, 'error').and.callThrough();
    component.ngOnInit();
    expect(toastr.error).toHaveBeenCalledOnceWith(
      'Loading error delivered orders.'
    );
  });

  it('funcionality onClickCanceled', () => {
    const order = {
      id: '1',
      userId: '1',
      client: 'MariAle',
      tableNum: 17,
      products: [
        {
          qty: 1,
          product: {
            id: '3',
            name: 'burger',
            price: 3,
            image: 'www.image.com',
            type: 'lunch',
            dateEntry: new Date('Thu May 11 2023 09:57:55 GMT-0500'),
          },
        },
      ],
      status,
      dataEntry: new Date('Thu May 11 2023 09:57:55 GMT-0500'),
    };
    spyOn(orderHttpSvc, 'patchOrder').and.callFake(() =>
      throwError(() => 'Error')
    );
    spyOn(toastr, 'error').and.callThrough();
    component.onClickCanceled(order);
    expect(toastr.error).toHaveBeenCalledOnceWith('Something went wrong');
  });
});
