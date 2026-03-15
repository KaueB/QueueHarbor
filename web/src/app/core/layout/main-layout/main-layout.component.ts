import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  private authService = inject(AuthService);
  themeService = inject(ThemeService);

  user = this.authService.currentUser;

  userInitial = computed(() => {
    const email = this.user()?.email;
    return email ? email.charAt(0).toUpperCase() : 'U';
  });

  onLogout() {
    this.authService.logout();
  }
}