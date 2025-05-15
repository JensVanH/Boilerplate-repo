import { Injectable } from '@angular/core';
import { DbConnectionService } from './db-connection.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {
  public properties = new BehaviorSubject<any>(null); // <-- Use BehaviorSubject to track loading
  public propertiesLoaded = this.properties.asObservable();

  constructor (private db: DbConnectionService) {
    this.fetchProperties();
  }

  fetchProperties() {
    this.db.getProperties().then((r: any) => {
      console.log("Properties fetched:", r); // <-- Console log to verify fetch
      this.properties.next(r);
    }).catch(error => {
      console.error("Error fetching properties:", error);
    });
  }

}

export interface Properties {
  "Conversation System": string[],
  "Frequency": string[],
  "Time Unit": string[],
  "Listing Kind": string[],
  "Listing Type": string[],
  "Price Calculation": string[],
  "Price Discovery": string[],
  "Quantity": string[],
  "Revenue Source": string[],
  "revenue Stream": string[],
  "Review By": string[],
  "Review Of": string[],
  "User Type": string[],
  "Listing Verification Mechanism": string[],
  "Listing Verifier Type": string[],
}


