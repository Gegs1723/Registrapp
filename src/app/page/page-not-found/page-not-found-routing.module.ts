import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundPage } from './page-not-found.page';

const routes: Routes = [
  {
    path: '',
    component: PageNotFoundPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageNotFoundPageRoutingModule {}
