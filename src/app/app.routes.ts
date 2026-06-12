import { Routes } from '@angular/router';
//import { Login } from './features/auth/login/login';
import { Dashboard } from './features/dashboard/dashboard';
import { AdminDash } from './features/dashboard/components/admin-dash/admin-dash';
import { MentorDash } from './features/dashboard/components/mentor-dash/mentor-dash';
import { InternDash } from './features/dashboard/components/intern-dash/intern-dash';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'admin',
        component: AdminDash
    },
    {
        path: 'mentor',
        component: MentorDash
    },
    {
        path: 'intern',
        component: InternDash
    }

];
