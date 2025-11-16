import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {UserAppModel} from "../../models/user";
import {UserService} from "../../core/services";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
export class Profile implements OnInit{

  profile: UserAppModel | null = null;
  private destroyRef = inject(DestroyRef)

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.getProfile$().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: res => this.profile = res,
      error: (err) => {
        this.profile = null;
        console.error(err);
      }
    });
    }
}
