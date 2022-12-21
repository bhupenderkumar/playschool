import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParentComponent } from '../list/parent.component';
import { ParentDetailComponent } from '../detail/parent-detail.component';
import { ParentUpdateComponent } from '../update/parent-update.component';
import { ParentRoutingResolveService } from './parent-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const parentRoute: Routes = [
  {
    path: '',
    component: ParentComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParentDetailComponent,
    resolve: {
      parent: ParentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParentUpdateComponent,
    resolve: {
      parent: ParentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParentUpdateComponent,
    resolve: {
      parent: ParentRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parentRoute)],
  exports: [RouterModule],
})
export class ParentRoutingModule {}
