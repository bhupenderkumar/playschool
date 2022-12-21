import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HomeComponent } from './list/home.component';
import { HomeDetailComponent } from './detail/home-detail.component';
import { HomeUpdateComponent } from './update/home-update.component';
import { HomeDeleteDialogComponent } from './delete/home-delete-dialog.component';
import { HomeRoutingModule } from './route/home-routing.module';

@NgModule({
  imports: [SharedModule, HomeRoutingModule],
  declarations: [HomeComponent, HomeDetailComponent, HomeUpdateComponent, HomeDeleteDialogComponent],
})
export class HomeModule {}
