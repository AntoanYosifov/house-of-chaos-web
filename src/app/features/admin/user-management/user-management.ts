import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {UserAppModel} from "../../../models/user";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {UserService} from "../../../core/services";
import {DatePipe} from "@angular/common";

@Component({
    selector: 'app-user-management',
    imports: [DatePipe],
    templateUrl: './user-management.html',
    standalone: true,
    styleUrl: './user-management.css'
})
export class UserManagement implements OnInit {
    users: UserAppModel[] = [];
    loading: boolean = true;

    private destroyRef = inject(DestroyRef)

    constructor(private userService: UserService) {
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.userService.getAll$().pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: res => {
                    this.users = res;
                    this.loading = false;
                },
                error: err => {
                    console.error(err);
                    this.loading = false;
                }
            });
    }

    isAdmin(user: UserAppModel): boolean {
        return user.roles.includes('ADMIN');
    }

    onPromoteToAdmin(user: UserAppModel): void {
        this.userService.promoteToAdmin$(user.id).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: updatedUser => {
                    const index = this.users.findIndex(u => u.id === user.id);
                    if (index !== -1) {
                        this.users[index] = updatedUser;
                    }
                },
                error: err => {
                    console.error('Failed to promote user:', err);
                }
            });
    }

    onDemoteFromAdmin(user: UserAppModel): void {
        this.userService.demoteFromAdmin$(user.id).pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: updatedUser => {
                    const index = this.users.findIndex(u => u.id === user.id);
                    if (index !== -1) {
                        this.users[index] = updatedUser;
                    }
                },
                error: err => {
                    console.error('Failed to demote user:', err);
                }
            });
    }
}
