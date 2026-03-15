import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@ngneat/transloco';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { TranslocoHttpLoader } from './transloco-loader';

import {
  AlertCircle,
  Box,
  Check,
  CheckCircle,
  ChevronUp,
  Database,
  LayoutDashboard as Dashboard, Eye, EyeOff,
  Inbox,
  Languages,
  List,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  LucideAngularModule,
  Mail,
  Monitor,
  Moon,
  Plus,
  Palette,
  Server, Sun,
  Settings,
  Trash2,
  X
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideTransloco({
      config: {
        availableLangs: ['en', 'pt-BR'],
        defaultLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    importProvidersFrom(LucideAngularModule.pick({ 
      Box, Server, Sun, Moon, Monitor, Check, X, Palette, Languages, 
      LogOut, ChevronUp, CheckCircle, Inbox, Dashboard, Eye, EyeOff, 
      Loader2, Mail, Lock, AlertCircle, LogIn, Database, Plus, Trash2,
      List, Settings
    })),
  ],
};