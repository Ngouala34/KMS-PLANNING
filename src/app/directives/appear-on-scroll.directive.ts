import { Directive, ElementRef, HostBinding, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appAppearOnScroll]'
})
export class AppearOnScrollDirective implements OnInit {
  @HostBinding('class.show') isVisible = false;
  
  @Input() animationDelay: number = 0;
  @Input() threshold: number = 0.1;
  @Input() once: boolean = true;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setInitialStyles();
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.isVisible = true;
            if (this.once) {
              observer.unobserve(this.el.nativeElement);
            }
          }, this.animationDelay);
        } else if (!this.once) {
          this.isVisible = false;
        }
      });
    }, {
      threshold: this.threshold,
      rootMargin: '0px 0px -20px 0px'
    });

    observer.observe(this.el.nativeElement);
  }

  private setInitialStyles(): void {
    const element = this.el.nativeElement;
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    element.style.willChange = 'opacity, transform';
    element.style.opacity = '0';
  }

  @HostBinding('style.opacity')
  get opacityStyle(): string {
    return this.isVisible ? '1' : '0';
  }

  @HostBinding('style.transform')
  get transformStyle(): string {
    return this.isVisible ? 'translateY(0)' : 'translateY(20px)';
  }
}