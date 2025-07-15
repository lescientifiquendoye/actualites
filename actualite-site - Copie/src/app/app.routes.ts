import { Routes } from '@angular/router';
import { ArticleComponent } from './pages/article/article.component';
import { CategorieComponent } from './pages/categorie/categorie.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoryFormComponent } from './pages/editor-dashboard/category-form/category-form.component';
import { CategoryManagementComponent } from './pages/editor-dashboard/category-management/category-management.component';
import { AuthGuard } from './guards/auth.guard'; // Assurez-vous que le chemin est correct
import { LoginComponent } from './components/auth/login/login.component'; // Assurez-vous que le chemin est correct
import { EditorDashboardComponent } from './pages/editor-dashboard/editor-dashboard.component';
import { ArticleManagementComponent } from './pages/editor-dashboard/article-management/article-management.component';
import { AddArticleComponent } from './pages/editor-dashboard/add-article/add-article.component';
import { UserManagementComponent } from './pages/editor-dashboard/user-management/user-management.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'article/:id', component: ArticleComponent },
  { path: 'categorie/:nom', component: CategorieComponent },
  {
    path: 'editeur/categories',
    component: CategoryManagementComponent,
   // canActivate: [AuthGuard],
    data: { roles: ['EDITEUR', 'ADMIN'] } // Rôles autorisés pour cette route
  },
  {
    path: "editeur-dashboard",
    component: EditorDashboardComponent,
   // canActivate: [AuthGuard], // <-- AJOUTÉ : Protège cette route
    data: { roles: ['EDITEUR', 'ADMIN'] } // <-- AJOUTÉ : Spécifie les rôles nécessaires
  },
  {
    path: "editeur/articles",
    component: ArticleManagementComponent,
   // canActivate: [AuthGuard], // <-- AJOUTÉ : Protège cette route
    data: { roles: ['EDITEUR', 'ADMIN'] } // <-- AJOUTÉ : Spécifie les rôles nécessaires
  },
  {
    path: 'add-article', // Considérez de renommer cette route en 'editeur/add-article' pour la cohérence
    component: AddArticleComponent,
   // canActivate: [AuthGuard], // <-- AJOUTÉ : Protège cette route
    data: { roles: ['EDITEUR', 'ADMIN'] } // <-- AJOUTÉ : Spécifie les rôles nécessaires
  },
  {
    path: 'admin/users', component: UserManagementComponent,

  },
   {
    path: 'editeur/articles/edit/:id',
    component: AddArticleComponent,
   // canActivate: [AuthGuard], // <-- AJOUTÉ : Protège cette route
    data: { roles: ['EDITEUR', 'ADMIN'] } // <-- AJOUTÉ : Spécifie les rôles nécessaires
  },

  {
    path: 'editor/categories/new',
    component: CategoryFormComponent,
   // canActivate: [AuthGuard],
    data: { roles: ['EDITEUR', 'ADMIN'] } // NOTE : Incohérence de casse entre 'EDITEUR' et 'editor'
  },
  {
    path: 'editor/categories/edit/:id',
    component: CategoryFormComponent,
 //   canActivate: [AuthGuard],
    data: { roles: ['EDITEUR', 'ADMIN'] } // NOTE : Incohérence de casse entre 'EDITEUR' et 'editor'
  },
];