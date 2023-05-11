import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { SharedOrderService } from 'src/app/service/shared-order.service';
import { Router } from '@angular/router';
import { SharedModule } from '../shared.module';
import { EventEmitter } from '@angular/core';

class SharedOrderTestingService {
  $modal = new EventEmitter<boolean>();
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let orderSvc: SharedOrderService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [HeaderComponent],
      providers: [
        { provide: SharedOrderService, useClass: SharedOrderTestingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    orderSvc = TestBed.inject(SharedOrderService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component).toBeDefined();
  });

  it('functionality openModal', () => {
    spyOn(orderSvc.$modal, 'emit').and.callThrough();
    component.openModal();
    expect(orderSvc.$modal.emit).toHaveBeenCalledOnceWith(true);
  });

  it('funcionality goToDelivering', () => {
    spyOn(router, 'navigate');
    component.goToDelivering();
    expect(router.navigate).toHaveBeenCalledOnceWith(['delivering']);
  });
  it('funcionality goToMenu', () => {
    spyOn(router, 'navigate');
    component.goToMenu();
    expect(router.navigate).toHaveBeenCalledOnceWith(['menu']);
  });
  it('funcionality goToAdmin', () => {
    spyOn(router, 'navigate');
    component.goToAdmin();
    expect(router.navigate).toHaveBeenCalledOnceWith(['admin']);
  });
  it('funcionality goToAdmin', () => {
    spyOn(router, 'navigate');
    component.goToKitchen();
    expect(router.navigate).toHaveBeenCalledOnceWith(['kitchen']);
  });
});
