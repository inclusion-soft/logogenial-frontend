import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PersonaListComponent } from './persona-list/persona-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AgmCoreModule } from '@agm/core';
import { EcommerceProductsService } from '../e-commerce/products/products.service';
import { EcommerceProductService } from '../e-commerce/product/product.service';
import { EcommerceOrdersService } from '../e-commerce/orders/orders.service';
import { EcommerceOrderService } from '../e-commerce/order/order.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PersonaService } from './services/persona.service';

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
        // BrowserAnimationsModule,
        CommonModule,
        MatButtonModule,
        MatChipsModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSelectModule,
        MatSortModule,
        MatSnackBarModule,
        MatTableModule,
        MatTabsModule,
        NgxChartsModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers   : [
        EcommerceProductsService,
        EcommerceProductService,
        EcommerceOrdersService,
        EcommerceOrderService,
        PersonaService
    ]
})
export class PersonaModule {}
