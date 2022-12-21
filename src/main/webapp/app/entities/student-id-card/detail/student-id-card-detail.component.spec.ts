import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { StudentIDCardDetailComponent } from './student-id-card-detail.component';

describe('StudentIDCard Management Detail Component', () => {
  let comp: StudentIDCardDetailComponent;
  let fixture: ComponentFixture<StudentIDCardDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentIDCardDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ studentIDCard: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(StudentIDCardDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(StudentIDCardDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load studentIDCard on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.studentIDCard).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
