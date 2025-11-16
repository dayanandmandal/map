import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLocatorComponent } from './user-locator.component';

describe('UserLocatorComponent', () => {
  let component: UserLocatorComponent;
  let fixture: ComponentFixture<UserLocatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLocatorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserLocatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
