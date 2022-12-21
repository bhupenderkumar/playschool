import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StudentIDCardService } from '../service/student-id-card.service';

import { StudentIDCardComponent } from './student-id-card.component';

describe('StudentIDCard Management Component', () => {
  let comp: StudentIDCardComponent;
  let fixture: ComponentFixture<StudentIDCardComponent>;
  let service: StudentIDCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'student-id-card', component: StudentIDCardComponent }]), HttpClientTestingModule],
      declarations: [StudentIDCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(StudentIDCardComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentIDCardComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StudentIDCardService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.studentIDCards?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to studentIDCardService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStudentIDCardIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStudentIDCardIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
