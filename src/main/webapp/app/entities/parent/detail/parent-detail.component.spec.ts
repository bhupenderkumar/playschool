import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParentDetailComponent } from './parent-detail.component';

describe('Parent Management Detail Component', () => {
  let comp: ParentDetailComponent;
  let fixture: ComponentFixture<ParentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
