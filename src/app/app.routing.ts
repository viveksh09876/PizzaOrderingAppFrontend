import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { ItemComponent } from './item/item.component';
import { AccountComponent } from './account/account.component';
import { OrderreviewComponent } from './orderreview/orderreview.component';
import { EventsComponent } from './events/events.component';
import { CateringComponent } from './catering/catering.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CareersComponent } from './careers/careers.component';
import { FranchisingComponent } from './franchising/franchising.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

const appRoutes: Routes = [ 
    { path: '', component: HomeComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'item/:slug', component: ItemComponent },
    { path: 'order-review', component: OrderreviewComponent },
    { path: 'account', component: AccountComponent },
    { path: 'events', component: EventsComponent },
    { path: 'catering', component: CateringComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'careers', component: CareersComponent },
	{ path: 'franchising', component: FranchisingComponent },
    { path: 'confirmation', component: ConfirmationComponent }
]; 

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: true });