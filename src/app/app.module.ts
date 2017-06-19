import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { routing } from './app.routing';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';

import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MenuComponent } from './menu/menu.component';
import { RegisterComponent } from './register/register.component';
import { ItemComponent } from './item/item.component';
import { OrderreviewComponent } from './orderreview/orderreview.component';
import { OrdernowmodalComponent } from './ordernowmodal/ordernowmodal.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MenuComponent,
    RegisterComponent,
    ItemComponent,
    OrderreviewComponent,
    OrdernowmodalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    BootstrapModalModule,
    JsonpModule
  ],
  entryComponents: [LoginComponent, RegisterComponent, OrdernowmodalComponent],
  schemas:  [CUSTOM_ELEMENTS_SCHEMA],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
