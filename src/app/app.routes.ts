import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { authGuard } from './core/guards/auth-guard';
import { Dashboard } from './features/dashboard/dashboard';
import { AdminDash } from './features/dashboard/components/adminComponent/admin-dash/admin-dash';
import { MentorDash } from './features/dashboard/components/mentorComponent/mentor-dash/mentor-dash';
import { InternDash } from './features/dashboard/components/internComponent/intern-dash/intern-dash';
import { EditProfile } from './features/shared/edit-profile/edit-profile';
import { UsersManagement } from './features/dashboard/components/adminComponent/users-management/users-management';
import { CreateTask } from './features/dashboard/components/mentorComponent/create-task/create-task';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login', component: Login
    },
    {
        path: 'dashboard', component: Dashboard, 
        canActivate: [authGuard], 
        children: [
            { path: 'admin', component: AdminDash },
            { path: 'users-management', component: UsersManagement },
            
            { path: 'mentor', component: MentorDash },
            { path: 'create-task', component: CreateTask },
            { path: 'intern', component: InternDash },
            
            { path: 'edit-profile', component: EditProfile },
        ]
    }
    
];
