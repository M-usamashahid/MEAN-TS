import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { YourAccessComponent } from './your-access/your-access.component';
import { TvLiveComponent } from './tv-live/tv-live.component';
import { ChatComponent } from './chat/chat.component';
import { ManageComponent } from './manage/manage.component';
import { MyDetailsComponent } from './my-details/my-details.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'your-access',
        component: YourAccessComponent
      },
      {
        path: 'eztoned-tv-live',
        component: TvLiveComponent
      },
      {
        path: 'chat',
        component: ChatComponent
      },
      {
        path: 'manage',
        component: ManageComponent
      },
      {
        path: 'my-details',
        component: MyDetailsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
