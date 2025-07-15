import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '../../service/article.service';
import { Article } from '../../model/article.service';
import { CommonModule } from '@angular/common';
import {MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-article',
  imports: [CommonModule,MatIconModule],
  templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit {
goBack() {
    window.history.back();
}
  article?: Article;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.articleService.getArticleById(id).subscribe(data => {
      this.article = data;
    });
  }
}
