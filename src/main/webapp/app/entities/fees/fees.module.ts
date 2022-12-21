import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FeesComponent } from './list/fees.component';
import { FeesDetailComponent } from './detail/fees-detail.component';
import { FeesUpdateComponent } from './update/fees-update.component';
import { FeesDeleteDialogComponent } from './delete/fees-delete-dialog.component';
import { FeesRoutingModule } from './route/fees-routing.module';

@NgModule({
  imports: [SharedModule, FeesRoutingModule],
  declarations: [FeesComponent, FeesDetailComponent, FeesUpdateComponent, FeesDeleteDialogComponent],
})
export class FeesModule {}
