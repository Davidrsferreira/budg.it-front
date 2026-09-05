import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import {RouterOutlet} from '@angular/router';
import { Navigation } from "../navigation/navigation";
import { Header } from "../header/header";

@Component({
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    Navigation,
    Header
],
  selector: 'app-shell',
  styleUrl: './shell.css',
  templateUrl: './shell.html',
})
export class Shell {}
