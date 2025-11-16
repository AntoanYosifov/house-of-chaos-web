import {Component, Signal} from '@angular/core';
import {UserAppModel} from "../../models/user";
import {AuthService} from "../../core/services";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink,
    DatePipe
  ],
  templateUrl: './profile.html',
  standalone: true,
  styleUrl: './profile.css'
})
export class Profile {

  readonly currentUser: Signal<UserAppModel | null>

  constructor(private authService: AuthService) {
    this.currentUser = this.authService.currentUser;
  }
}
