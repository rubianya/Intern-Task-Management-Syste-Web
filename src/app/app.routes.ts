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
                loadComponent: () => import ('./features/dashboard/components/mentorComponent/mentor-dash/mentor-dash').then(m => m.MentorDash)
            },
            {   path: 'task-management',
                loadComponent: () => import('./features/dashboard/components/mentorComponent/task-management/task-management').then(m => m.TaskManagement) 
            },
            {
                path: 'mentor-task-detail/:id',
                loadComponent: () => import('./features/dashboard/components/mentorComponent/task-detail/task-detail').then(m => m.TaskDetail) 
            },
            {   path: 'intern', 
                loadComponent: () => import('./features/dashboard/components/internComponent/intern-dash/intern-dash').then(m => m.InternDash) 
            },
            {   path: 'my-task',
                loadComponent: () => import('./features/dashboard/components/internComponent/my-task/my-task').then(m => m.MyTask)
            },
            {
                path: 'intern-task-detail/:id',
                loadComponent: () => import('./features/dashboard/components/internComponent/task-detail/task-detail').then(m => m.TaskDetail)
            },
            {   path: 'edit-profile', 
                loadComponent: () => import('./features/shared/edit-profile/edit-profile').then(m => m.EditProfile) 
            },
        ]
    }
    
];
