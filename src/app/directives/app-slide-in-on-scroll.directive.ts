import { Directive, ElementRef, HostBinding, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appSlideInOnScroll]'
})
export class SlideInOnScrollDirective implements OnInit {
  @HostBinding('class.slide-in-visible') isVisible = false;
  
  @Input() slideDirection: 'left' | 'right' | 'up' | 'down' = 'left';
  @Input() slideDistance: string = '50px';
  @Input() slideDuration: number = 0.6;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setInitialStyles();
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.isVisible = true;
          }, 100);
          // observer.unobserve(this.el.nativeElement); // Décommentez pour une seule animation
        } else {
          this.isVisible = false;
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    observer.observe(this.el.nativeElement);
  }

  private setInitialStyles(): void {
    const element = this.el.nativeElement;
    
    // Styles de base pour l'animation
    element.style.transition = `all ${this.slideDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    element.style.willChange = 'transform, opacity';
    
    // Position initiale selon la direction
    switch (this.slideDirection) {
      case 'left':
        element.style.transform = `translateX(-${this.slideDistance})`;
        break;
      case 'right':
        element.style.transform = `translateX(${this.slideDistance})`;
        break;
      case 'up':
        element.style.transform = `translateY(${this.slideDistance})`;
        break;
      case 'down':
        element.style.transform = `translateY(-${this.slideDistance})`;
        break;
    }
    
    element.style.opacity = '0';
  }

  @HostBinding('style.transform')
  get transformStyle(): string {
    return this.isVisible ? 'translate(0, 0)' : '';
  }

  @HostBinding('style.opacity')
  get opacityStyle(): string {
    return this.isVisible ? '1' : '0';
  }
}