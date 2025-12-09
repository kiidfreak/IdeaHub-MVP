import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIdeaModalComponent } from './create-idea-modal.component';

describe('CreateIdeaModalComponent', () => {
  let component: CreateIdeaModalComponent;
  let fixture: ComponentFixture<CreateIdeaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateIdeaModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIdeaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
