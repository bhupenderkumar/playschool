import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { StudentIDCardComponent } from './list/student-id-card.component';
import { StudentIDCardDetailComponent } from './detail/student-id-card-detail.component';
import { StudentIDCardUpdateComponent } from './update/student-id-card-update.component';
import { StudentIDCardDeleteDialogComponent } from './delete/student-id-card-delete-dialog.component';
import { StudentIDCardRoutingModule } from './route/student-id-card-routing.module';

@NgModule({
  imports: [SharedModule, StudentIDCardRoutingModule],
  declarations: [StudentIDCardComponent, StudentIDCardDetailComponent, StudentIDCardUpdateComponent, StudentIDCardDeleteDialogComponent],
})
export class StudentIDCardModule {}
