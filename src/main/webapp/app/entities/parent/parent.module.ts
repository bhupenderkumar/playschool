import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParentComponent } from './list/parent.component';
import { ParentDetailComponent } from './detail/parent-detail.component';
import { ParentUpdateComponent } from './update/parent-update.component';
import { ParentDeleteDialogComponent } from './delete/parent-delete-dialog.component';
import { ParentRoutingModule } from './route/parent-routing.module';

@NgModule({
  imports: [SharedModule, ParentRoutingModule],
  declarations: [ParentComponent, ParentDetailComponent, ParentUpdateComponent, ParentDeleteDialogComponent],
})
export class ParentModule {}
