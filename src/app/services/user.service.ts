import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUserProfile(): any {
    throw new Error('Method not implemented.');
  }
  updateUserProfile(value: any) {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
