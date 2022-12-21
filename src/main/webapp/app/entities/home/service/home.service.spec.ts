import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHome } from '../home.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../home.test-samples';

import { HomeService } from './home.service';

const requireRestSample: IHome = {
  ...sampleWithRequiredData,
};

describe('Home Service', () => {
  let service: HomeService;
  let httpMock: HttpTestingController;
  let expectedResult: IHome | IHome[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HomeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Home', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const home = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(home).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Home', () => {
      const home = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(home).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Home', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Home', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Home', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addHomeToCollectionIfMissing', () => {
      it('should add a Home to an empty array', () => {
        const home: IHome = sampleWithRequiredData;
        expectedResult = service.addHomeToCollectionIfMissing([], home);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(home);
      });

      it('should not add a Home to an array that contains it', () => {
        const home: IHome = sampleWithRequiredData;
        const homeCollection: IHome[] = [
          {
            ...home,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addHomeToCollectionIfMissing(homeCollection, home);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Home to an array that doesn't contain it", () => {
        const home: IHome = sampleWithRequiredData;
        const homeCollection: IHome[] = [sampleWithPartialData];
        expectedResult = service.addHomeToCollectionIfMissing(homeCollection, home);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(home);
      });

      it('should add only unique Home to an array', () => {
        const homeArray: IHome[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const homeCollection: IHome[] = [sampleWithRequiredData];
        expectedResult = service.addHomeToCollectionIfMissing(homeCollection, ...homeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const home: IHome = sampleWithRequiredData;
        const home2: IHome = sampleWithPartialData;
        expectedResult = service.addHomeToCollectionIfMissing([], home, home2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(home);
        expect(expectedResult).toContain(home2);
      });

      it('should accept null and undefined values', () => {
        const home: IHome = sampleWithRequiredData;
        expectedResult = service.addHomeToCollectionIfMissing([], null, home, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(home);
      });

      it('should return initial array if no Home is added', () => {
        const homeCollection: IHome[] = [sampleWithRequiredData];
        expectedResult = service.addHomeToCollectionIfMissing(homeCollection, undefined, null);
        expect(expectedResult).toEqual(homeCollection);
      });
    });

    describe('compareHome', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareHome(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareHome(entity1, entity2);
        const compareResult2 = service.compareHome(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareHome(entity1, entity2);
        const compareResult2 = service.compareHome(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareHome(entity1, entity2);
        const compareResult2 = service.compareHome(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
