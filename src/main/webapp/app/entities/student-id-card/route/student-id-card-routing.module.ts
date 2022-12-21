import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { StudentIDCardComponent } from '../list/student-id-card.component';
import { StudentIDCardDetailComponent } from '../detail/student-id-card-detail.component';
import { StudentIDCardUpdateComponent } from '../update/student-id-card-update.component';
import { StudentIDCardRoutingResolveService } from './student-id-card-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const studentIDCardRoute: Routes = [
  {
    path: '',
    component: StudentIDCardComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StudentIDCardDetailComponent,
    resolve: {
      studentIDCard: StudentIDCardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StudentIDCardUpdateComponent,
    resolve: {
      studentIDCard: StudentIDCardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StudentIDCardUpdateComponent,
    resolve: {
      studentIDCard: StudentIDCardRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(studentIDCardRoute)],
  exports: [RouterModule],
})
export class StudentIDCardRoutingModule {}
