import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IStudentIDCard } from '../student-id-card.model';
import { StudentIDCardService } from '../service/student-id-card.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './student-id-card-delete-dialog.component.html',
})
export class StudentIDCardDeleteDialogComponent {
  studentIDCard?: IStudentIDCard;

  constructor(protected studentIDCardService: StudentIDCardService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.studentIDCardService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
