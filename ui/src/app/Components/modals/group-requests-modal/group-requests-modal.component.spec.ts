import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRequestsModalComponent } from './group-requests-modal.component';

describe('GroupRequestsModalComponent', () => {
  let component: GroupRequestsModalComponent;
  let fixture: ComponentFixture<GroupRequestsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRequestsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupRequestsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
