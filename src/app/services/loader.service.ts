import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  isLoading : BehaviorSubject<boolean>;

  constructor() {
    this.isLoading = new BehaviorSubject<boolean>(false);
  }

  setIsLoading(data : boolean): void {
    this.isLoading.next(data);
  }

  getIsLoading(): Observable<boolean> {
    return this.isLoading.asObservable();
  }
}
