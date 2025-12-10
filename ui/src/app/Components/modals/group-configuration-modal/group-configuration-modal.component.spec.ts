import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupConfigurationModalComponent } from './group-configuration-modal.component';

describe('GroupConfigurationModalComponent', () => {
  let component: GroupConfigurationModalComponent;
  let fixture: ComponentFixture<GroupConfigurationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupConfigurationModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupConfigurationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
