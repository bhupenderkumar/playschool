import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IFees } from '../fees.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../fees.test-samples';

import { FeesService, RestFees } from './fees.service';

const requireRestSample: RestFees = {
  ...sampleWithRequiredData,
  dueDate: sampleWithRequiredData.dueDate?.format(DATE_FORMAT),
};

describe('Fees Service', () => {
  let service: FeesService;
  let httpMock: HttpTestingController;
  let expectedResult: IFees | IFees[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FeesService);
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

    it('should create a Fees', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const fees = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(fees).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Fees', () => {
      const fees = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(fees).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Fees', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Fees', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Fees', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFeesToCollectionIfMissing', () => {
      it('should add a Fees to an empty array', () => {
        const fees: IFees = sampleWithRequiredData;
        expectedResult = service.addFeesToCollectionIfMissing([], fees);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fees);
      });

      it('should not add a Fees to an array that contains it', () => {
        const fees: IFees = sampleWithRequiredData;
        const feesCollection: IFees[] = [
          {
            ...fees,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFeesToCollectionIfMissing(feesCollection, fees);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Fees to an array that doesn't contain it", () => {
        const fees: IFees = sampleWithRequiredData;
        const feesCollection: IFees[] = [sampleWithPartialData];
        expectedResult = service.addFeesToCollectionIfMissing(feesCollection, fees);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fees);
      });

      it('should add only unique Fees to an array', () => {
        const feesArray: IFees[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const feesCollection: IFees[] = [sampleWithRequiredData];
        expectedResult = service.addFeesToCollectionIfMissing(feesCollection, ...feesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const fees: IFees = sampleWithRequiredData;
        const fees2: IFees = sampleWithPartialData;
        expectedResult = service.addFeesToCollectionIfMissing([], fees, fees2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(fees);
        expect(expectedResult).toContain(fees2);
      });

      it('should accept null and undefined values', () => {
        const fees: IFees = sampleWithRequiredData;
        expectedResult = service.addFeesToCollectionIfMissing([], null, fees, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(fees);
      });

      it('should return initial array if no Fees is added', () => {
        const feesCollection: IFees[] = [sampleWithRequiredData];
        expectedResult = service.addFeesToCollectionIfMissing(feesCollection, undefined, null);
        expect(expectedResult).toEqual(feesCollection);
      });
    });

    describe('compareFees', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFees(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFees(entity1, entity2);
        const compareResult2 = service.compareFees(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFees(entity1, entity2);
        const compareResult2 = service.compareFees(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFees(entity1, entity2);
        const compareResult2 = service.compareFees(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
