import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AttendanceService } from '../service/attendance.service';

import { AttendanceComponent } from './attendance.component';

describe('Attendance Management Component', () => {
  let comp: AttendanceComponent;
  let fixture: ComponentFixture<AttendanceComponent>;
  let service: AttendanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'attendance', component: AttendanceComponent }]), HttpClientTestingModule],
      declarations: [AttendanceComponent],
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
      .overrideTemplate(AttendanceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AttendanceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AttendanceService);

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
    expect(comp.attendances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to attendanceService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAttendanceIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAttendanceIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
