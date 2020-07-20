import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NivelListComponent } from './nivel-list/nivel-list.component';
import { DemoMaterialModule } from 'app/demo-material-module';
import { FlexLayoutModule } from '@angular/flex-layout';

export const AdminRoutes: Routes = [{
  path: 'nivel',
  component: NivelListComponent
}];

@NgModule({
  declarations: [NivelListComponent],
  imports: [
    CommonModule,
    DemoMaterialModule,
    FlexLayoutModule,
    RouterModule.forChild(AdminRoutes)
  ]
})
export class AdminModule { }
