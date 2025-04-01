import { Component, OnInit, OnDestroy } from '@angular/core';

interface StatItem {
  current: number;
  target: number;
  label: string;
  suffix: string;
  icon: string;
}

@Component({
  selector: 'app-stats-section',
  templateUrl: './stats-section.component.html',
  styleUrls: ['./stats-section.component.scss']
})
export class StatsSectionComponent implements OnInit, OnDestroy {
  title = "Nos chiffres clés";
  description = "Des résultats concrets qui témoignent de l'efficacité de notre plateforme. Laissez-vous convaincre par des statistiques impressionnantes !";
  
  stats: StatItem[] = [
    { current: 0, target: 8073, label: "Nombre d'utilisateurs", suffix: "+", icon: "fas fa-user-tie" },
    { current: 0, target: 10254, label: "Rendez-vous pris", suffix: "+", icon: "fas fa-calendar-check" },
    { current: 0, target: 89, label: "Taux de satisfaction", suffix: "%", icon: "fas fa-star" }
  ];

  private counterIntervals: any[] = [];
  private animationFrameId: number | null = null;
  private hasAnimated = false;

  ngOnInit() {
    this.checkVisibility();
    window.addEventListener('scroll', this.checkVisibility.bind(this));
  }

  ngOnDestroy() {
    this.counterIntervals.forEach(interval => clearInterval(interval));
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('scroll', this.checkVisibility.bind(this));
  }

  checkVisibility() {
    if (this.hasAnimated) return;

    this.animationFrameId = requestAnimationFrame(() => {
      const element = document.querySelector('.stats-section');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.75) && 
                         (rect.bottom >= window.innerHeight * 0.25);

        if (isVisible) {
          this.animateCounters();
          this.hasAnimated = true;
        }
      }
    });
  }

  animateCounters() {
    const duration = 2000; // 2 secondes
    const steps = 100;
    const interval = duration / steps;

    this.stats.forEach((stat, index) => {
      const increment = stat.target / steps;
      let currentStep = 0;

      this.counterIntervals[index] = setInterval(() => {
        if (currentStep < steps) {
          stat.current = Math.min(stat.target, stat.current + increment);
          currentStep++;
        } else {
          stat.current = stat.target;
          clearInterval(this.counterIntervals[index]);
        }
      }, interval);
    });
  }
}