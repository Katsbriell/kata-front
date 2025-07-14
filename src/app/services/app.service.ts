import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';
import { EmailI, OnbI, UserI } from '../models/app-interface';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private apiURL = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

  public async createUser(user: UserI): Promise<{ data: UserI | null, status: number }> {
    try {
      return { data: await firstValueFrom(this.http.post<UserI>(this.apiURL + '/create-user', user)), status: 200 };
    } catch (error: any) {
      return { data: null, status: error.status || 500 };
    }
  }

  public async getAllUsers(): Promise<UserI[]> {
    return await firstValueFrom(this.http.get<UserI[]>(this.apiURL + '/users'));
  }

  public async updateUsers(users: UserI[]): Promise<UserI[]> {
    return await firstValueFrom(this.http.put<UserI[]>(this.apiURL + '/update-users', users));
  }

  public async deleteUser(id: number): Promise<void> {
    return await firstValueFrom(this.http.delete<void>(`${this.apiURL}/delete-user/${id}`));
  }

  public async getCalendar(): Promise<OnbI[]> {
    return await firstValueFrom(this.http.get<OnbI[]>(this.apiURL + '/onboardings'));
  }

  public async sendEmail(emails: EmailI): Promise<string> {
    return await firstValueFrom(this.http.post<string>(this.apiURL + '/send-email', emails));
  }
}
