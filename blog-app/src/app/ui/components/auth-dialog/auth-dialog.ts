import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { AUTH_SERVICE_TOKEN } from '../../../services/auth/auth-service.token';

@Component({
  selector: 'app-auth-dialog',
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatTabsModule],
  templateUrl: './auth-dialog.html',
  styleUrl: './auth-dialog.scss'
})
export class AuthDialog {
  private authService = inject(AUTH_SERVICE_TOKEN);
  private dialogRef = inject(MatDialogRef<AuthDialog>);

  protected loginData = { username: '', password: '' };
  protected registerData = { username: '', email: '', password: '' };
  protected error = signal('');

  protected onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error.set('Неверный логин или пароль')
    });
  }

  protected onRegister() {
    this.authService.register(this.registerData).subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.error.set('Ошибка регистрации')
    });
  }
}