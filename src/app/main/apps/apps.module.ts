import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';
import { PersonaModule } from './persona/persona.module';
import { AuthGuardService } from './seguridad/services/auth-guard.service';

const routes = [
    {
        path        : 'dashboards/analytics', canActivate: [AuthGuardService],
        loadChildren: './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
    },
    {
        path        : 'dashboards/project', canActivate: [AuthGuardService],
        loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
    },
    {
        path        : 'mail', canActivate: [AuthGuardService],
        loadChildren: './mail/mail.module#MailModule'
    },
    {
        path        : 'mail-ngrx', canActivate: [AuthGuardService],
        loadChildren: './mail-ngrx/mail.module#MailNgrxModule'
    },
    {
        path        : 'chat', canActivate: [AuthGuardService],
        loadChildren: './chat/chat.module#ChatModule'
    },
    {
        path        : 'calendar', canActivate: [AuthGuardService],
        loadChildren: './calendar/calendar.module#CalendarModule'
    },
    {
        path        : 'e-commerce', canActivate: [AuthGuardService],
        loadChildren: './e-commerce/e-commerce.module#EcommerceModule'
    },
    {
        path        : 'academy', canActivate: [AuthGuardService],
        loadChildren: './academy/academy.module#AcademyModule'
    },
    {
        path        : 'todo',  canActivate: [AuthGuardService],
        loadChildren: './todo/todo.module#TodoModule'
    },
    {
        path        : 'file-manager', canActivate: [AuthGuardService],
        loadChildren: './file-manager/file-manager.module#FileManagerModule'
    },
    {
        path        : 'contacts', canActivate: [AuthGuardService],
        loadChildren: './contacts/contacts.module#ContactsModule'
    },
    {
        path        : 'scrumboard', canActivate: [AuthGuardService],
        loadChildren: './scrumboard/scrumboard.module#ScrumboardModule'
    }
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),
        FuseSharedModule,
        PersonaModule
    ]
    // declarations: [CategoriaComponent],
})
export class AppsModule
{
}
