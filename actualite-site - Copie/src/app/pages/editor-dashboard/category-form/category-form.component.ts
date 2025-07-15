import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategorieService } from '../../../service/categorie.service';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  category: any = { nom: '' }; // Remplacez 'any' par votre interface Categorie
  isEditMode: boolean = false;
  categoryId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategorieService // Assurez-vous que CategoryService est importé
    // private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.categoryId = +id;
        this.loadCategory(this.categoryId);
      }
    });
  }

  loadCategory(id: number): void {
    this.categoryService.getCategorieById(id).subscribe(
      (data) => { 
        this.category = data;
      },
      (error) => {  
        console.error('Erreur lors du chargement de la catégorie:', error);
        alert('Une erreur est survenue lors du chargement de la catégorie.');
      }
  //  const dummyCategory = { id: id, nom: 'Catégorie à Modifier' };
    //this.category = { ...dummyCategory };
  )}

  saveCategory(): void {
    if (this.isEditMode) {
      this.categoryService.editCategory(this.categoryId!, this.category).subscribe(
        (updatedCategory) => {    
          alert('Catégorie mise à jour !');
          // Rediriger vers la liste des catégories après la mise à jour
           this.router.navigate(['editeur/categories']);
        }
      , (error) => {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        alert('Une erreur est survenue lors de la mise à jour de la catégorie.');
      }
      );
    } else {
      this.categoryService.addCategory(this.category).subscribe(
        (newCategory) => {
          alert('Catégorie ajoutée !');
           this.router.navigate(['editeur/categories']);
      } )}
      
    }
  

  goBack(): void {
    this.router.navigate(['editeur/categories']);
  }
}