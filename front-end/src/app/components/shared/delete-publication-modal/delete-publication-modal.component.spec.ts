import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePublicationModalComponent } from './delete-publication-modal.component';

describe('DeletePublicationModalComponent', () => {
  let component: DeletePublicationModalComponent;
  let fixture: ComponentFixture<DeletePublicationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePublicationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePublicationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
