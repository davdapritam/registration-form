import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CampaignService } from 'src/app/services/admin/campaign.service';

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.scss']
})
export class AddCampaignComponent implements OnInit {

  campaignFG: FormGroup;

  isApiCalling = false;

  constructor(
    private toastrService: ToastrService,
    private campaignService: CampaignService
  ) {

    this.campaignFG = new FormGroup({
      service_type: new FormControl('Email', [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      message: new FormControl(null, [Validators.required]),
      email_subject: new FormControl(null, [Validators.required]),
      campaign_type: new FormControl(null, [Validators.required]),
      schedule_datetime: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  saveCampaign() {

    this.campaignFG.markAllAsTouched();

    if (this.campaignFG.valid) {

      let date = this.campaignFG.get('schedule_datetime')?.value;

      date = new Date(date).toISOString().split('T')[0]

      const data = this.campaignFG.getRawValue();

      delete data.schedule_datetime;

      this.isApiCalling = true;
  
      this.campaignService.addCampaign(data).subscribe({
        next: (v) => {
          if (v.status) {
            this.toastrService.success(v.message);
          } else {
            this.toastrService.error(v.message);
          }
          this.isApiCalling = false;
        }, 
        error: (v) => {
          this.toastrService.error(v.message);
          this.isApiCalling = false;
        }
      });
    }

  }
}
