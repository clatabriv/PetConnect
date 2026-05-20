import { Component, HostListener } from '@angular/core';
// import { NgClass } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  // imports: [NgClass],
  templateUrl: './scroll-to-top.html',
  styleUrl: './scroll-to-top.css',
})
export class ScrollToTopComponent {
  mostrarBoton = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.mostrarBoton = window.pageYOffset > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
