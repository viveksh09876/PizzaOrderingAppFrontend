import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { ItemComponent } from './item/item.component';
import { OrderreviewComponent } from './orderreview/orderreview.component';

const appRoutes: Routes = [ 
    { path: '', component: HomeComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'item/:slug', component: ItemComponent },
    { path: 'order-review', component: OrderreviewComponent }
]; 

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: true });