import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { routing } from './app.routing';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { CustomFormsModule } from 'ng2-validation'

import { DataService } from './data.service';
import { UtilService } from './util.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { RegisterComponent } from './register/register.component';
import { ItemComponent } from './item/item.component';
import { OrderreviewComponent } from './orderreview/orderreview.component';
import { OrdernowmodalComponent } from './ordernowmodal/ordernowmodal.component';
import { MessageComponent } from './message/message.component';
import { KeysPipePipe } from './keys-pipe.pipe';
import { ProfileComponent } from './profile/profile.component';
import { AccountComponent } from './account/account.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CateringComponent } from './catering/catering.component';
import { EventsComponent } from './events/events.component';
import { CareersComponent } from './careers/careers.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { SortPipe } from './sort.pipe';
import { FavmodalComponent } from './favmodal/favmodal.component';
import { FranchisingComponent } from './franchising/franchising.component';
import { BahrainComponent } from './bahrain/bahrain.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { RegisterConfirmationComponent } from './register-confirmation/register-confirmation.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MenuComponent,
    RegisterComponent,
    ItemComponent,
    OrderreviewComponent,
    OrdernowmodalComponent,
    MessageComponent,
    KeysPipePipe,
    ProfileComponent,
    AccountComponent,
    CheckoutComponent,
    CateringComponent,
    EventsComponent,
    CareersComponent,
    ConfirmationComponent,
    SortPipe,
    FavmodalComponent,
    FranchisingComponent,
    BahrainComponent,
    ContactUsComponent,
    RegisterConfirmationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BootstrapModalModule,
    JsonpModule,
    NguiDatetimePickerModule,
    CustomFormsModule
  ],
  entryComponents: [LoginComponent, RegisterComponent, OrdernowmodalComponent, MessageComponent, FavmodalComponent, ContactUsComponent, RegisterConfirmationComponent],
  schemas:  [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DataService, UtilService],
  bootstrap: [AppComponent]
})
export class AppModule { }
