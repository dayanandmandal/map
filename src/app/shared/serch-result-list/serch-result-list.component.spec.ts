import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerchResultListComponent } from './serch-result-list.component';

describe('SerchResultListComponent', () => {
  let component: SerchResultListComponent;
  let fixture: ComponentFixture<SerchResultListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerchResultListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SerchResultListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
