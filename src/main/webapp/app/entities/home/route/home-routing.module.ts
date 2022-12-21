import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HomeComponent } from '../list/home.component';
import { HomeDetailComponent } from '../detail/home-detail.component';
import { HomeUpdateComponent } from '../update/home-update.component';
import { HomeRoutingResolveService } from './home-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const homeRoute: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HomeDetailComponent,
    resolve: {
      home: HomeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HomeUpdateComponent,
    resolve: {
      home: HomeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HomeUpdateComponent,
    resolve: {
      home: HomeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoute)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
