import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [authGuard], 
        children: [
            {   path: 'admin', 
                loadComponent: () => import('./features/dashboard/components/adminComponent/admin-dash/admin-dash').then(m => m.AdminDash) 
            },
            {   path: 'users-management',
                loadComponent: () => import('./features/dashboard/components/adminComponent/users-management/users-management').then(m => m.UsersManagement) 
            },
            
            {   path: 'mentor',
                loadComponent: () => import('./features/dashboard/components/mentorComponent/mentor-dash/mentor-dash').then(m => m.MentorDash) 
            },
            {   path: 'create-task', 
                loadComponent: () => import('./features/dashboard/components/mentorComponent/create-task/create-task').then(m => m.CreateTask) 
            },
            {   path: 'intern', 
                loadComponent: () => import('./features/dashboard/components/internComponent/intern-dash/intern-dash').then(m => m.InternDash) 
            },

            {   path: 'edit-profile', 
                loadComponent: () => import('./features/shared/edit-profile/edit-profile').then(m => m.EditProfile) 
            },
        ]
    }
    
];
