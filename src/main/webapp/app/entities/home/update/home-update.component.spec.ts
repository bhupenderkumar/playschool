import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HomeFormService } from './home-form.service';
import { HomeService } from '../service/home.service';
import { IHome } from '../home.model';

import { HomeUpdateComponent } from './home-update.component';

describe('Home Management Update Component', () => {
  let comp: HomeUpdateComponent;
  let fixture: ComponentFixture<HomeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let homeFormService: HomeFormService;
  let homeService: HomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HomeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(HomeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HomeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    homeFormService = TestBed.inject(HomeFormService);
    homeService = TestBed.inject(HomeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const home: IHome = { id: 456 };

      activatedRoute.data = of({ home });
      comp.ngOnInit();

      expect(comp.home).toEqual(home);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHome>>();
      const home = { id: 123 };
      jest.spyOn(homeFormService, 'getHome').mockReturnValue(home);
      jest.spyOn(homeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ home });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: home }));
      saveSubject.complete();

      // THEN
      expect(homeFormService.getHome).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(homeService.update).toHaveBeenCalledWith(expect.objectContaining(home));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHome>>();
      const home = { id: 123 };
      jest.spyOn(homeFormService, 'getHome').mockReturnValue({ id: null });
      jest.spyOn(homeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ home: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: home }));
      saveSubject.complete();

      // THEN
      expect(homeFormService.getHome).toHaveBeenCalled();
      expect(homeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IHome>>();
      const home = { id: 123 };
      jest.spyOn(homeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ home });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(homeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
