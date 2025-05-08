import { Directive, ElementRef, HostBinding, OnInit } from '@angular/core';

@Directive({
  selector: '[appAppearOnScroll]'
})
export class AppearOnScrollDirective implements OnInit {
  @HostBinding('class.show') isVisible = false;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.isVisible = true;
          observer.unobserve(this.el.nativeElement); // Optionnel : observer une seule fois
        }
      });
    }, {
      threshold: 0.1
    });

    observer.observe(this.el.nativeElement);
  }
}
