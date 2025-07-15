import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { AuthService } from '../../service/auth.service';
import { Utilisateur } from '../../model/utilisateur.service';

@Component({
  selector: 'app-editor-dashboard',
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './editor-dashboard.component.html',
})
export class EditorDashboardComponent implements OnInit {
   curentUser:Utilisateur|null=null;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.curentUser= this.authService.currentUserValue;
  }
}