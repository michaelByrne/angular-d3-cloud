import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { D3CloudComponent } from './directives/d3-cloud/d3-cloud.component';
import { CloudConfig } from './cloud.config';

@NgModule({
	declarations: [
		AppComponent,
		D3CloudComponent
	],
	imports: [
		BrowserModule,
		FormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
