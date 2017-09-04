import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { D3CloudComponent } from './directives/d3-cloud/d3-cloud.component';
import { CloudConfig } from './cloud.config';
import { CloudService } from './cloud.service';

@NgModule({
	declarations: [
		AppComponent,
		D3CloudComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [CloudService],
	bootstrap: [AppComponent]
})
export class AppModule { }
