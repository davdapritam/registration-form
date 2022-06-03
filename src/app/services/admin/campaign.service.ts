import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ICampaign {
  campaign_type: string;
  email_subject: string;
  message: string;
  name: string;
  schedule_datetime: string;
  service_type: string;
  status: string;
  _id: string;
}

export interface IAddCampaign {
  service_type: string;
  name: string;
  message: string;
  email_subject: string;
  campaign_type: string;
  schedule_datetime: string;
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(
    private http: HttpClient
  ) { }

  getCampaign(params: HttpParams) {
    return this.http.get(`${environment.ngRok}/campaign`, {params}) as Observable<{
      data: ICampaign[];
      status: boolean;
      message?: string;
      pages: number;
      total: number;
    }>;
  }

  addCampaign(d: IAddCampaign) {

    return this.http.post(`${environment.ngRok}/campaign`, d)as Observable<{
      status: boolean,
      message?: string
    }>;;
  }
}
