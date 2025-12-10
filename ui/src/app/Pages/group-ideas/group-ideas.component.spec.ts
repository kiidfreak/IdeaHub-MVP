import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupIdeasComponent } from './group-ideas.component';

describe('GroupIdeasComponent', () => {
  let component: GroupIdeasComponent;
  let fixture: ComponentFixture<GroupIdeasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupIdeasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupIdeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
