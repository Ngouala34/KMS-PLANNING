import { Directive, ElementRef, HostBinding, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appZoomInOnScroll]'
})
export class ZoomInOnScrollDirective implements OnInit {
  @HostBinding('class.zoom-in-visible') isVisible = false;
  
  @Input() zoomScale: number = 0.8;
  @Input() zoomDuration: number = 0.8;
  @Input() zoomType: 'in' | 'out' = 'in';
  @Input() rotateEffect: boolean = false;
  @Input() rotateDegree: number = 5;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.setInitialStyles();
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            this.isVisible = true;
          }, 150);
        } else {
          // Optionnel: réinitialiser à l'invisible quand l'élément sort de la vue
          // this.isVisible = false;
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    });

    observer.observe(this.el.nativeElement);
  }

  private setInitialStyles(): void {
    const element = this.el.nativeElement;
    
    const scale = this.zoomType === 'in' ? this.zoomScale : 1.2;
    const rotation = this.rotateEffect ? `rotate(${this.rotateDegree}deg)` : '';
    
    element.style.transition = `all ${this.zoomDuration}s cubic-bezier(0.5, 1.56, 1, 2)`;
    element.style.willChange = 'transform, opacity';
    element.style.transform = `scale(${scale}) ${rotation}`;
    element.style.opacity = '0';
    element.style.transformOrigin = 'center';
  }

  @HostBinding('style.transform')
  get transformStyle(): string {
    if (!this.isVisible) return '';
    
    const rotation = this.rotateEffect ? 'rotate(0deg)' : '';
    return `scale(1) ${rotation}`;
  }

  @HostBinding('style.opacity')
  get opacityStyle(): string {
    return this.isVisible ? '1' : '0';
  }
}