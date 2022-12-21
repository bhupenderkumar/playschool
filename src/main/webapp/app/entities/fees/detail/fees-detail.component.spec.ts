import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FeesDetailComponent } from './fees-detail.component';

describe('Fees Management Detail Component', () => {
  let comp: FeesDetailComponent;
  let fixture: ComponentFixture<FeesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ fees: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FeesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FeesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load fees on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.fees).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
