import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignListComponent } from './campaign-list/campaign-list.component';
import { CampaignDetailComponent } from './campaign-detail/campaign-detail.component';
import { AddCampaignComponent } from './add-campaign/add-campaign.component';
import { MaterialModule } from '../../material/material.module';


@NgModule({
  declarations: [
    CampaignListComponent,
    CampaignDetailComponent,
    AddCampaignComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    CampaignRoutingModule
  ]
})
export class CampaignModule { }
