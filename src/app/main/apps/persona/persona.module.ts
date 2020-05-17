import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PersonaListComponent } from './persona-list/persona-list.component';

const routes: Routes = [
    {
        path: 'admin/personas',
        component: PersonaListComponent,
        // resolve  : {
        //     data: AnalyticsDashboardService
        // }
    },
];

@NgModule({
    declarations: [PersonaListComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule
    ],
})
export class PersonaModule {}
