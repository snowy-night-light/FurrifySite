import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'ui-navbar',
  imports: [NgOptimizedImage, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {}
