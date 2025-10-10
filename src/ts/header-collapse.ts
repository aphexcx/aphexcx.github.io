/**
 * Header collapse effect - transitions hero photo/name into navbar on scroll
 * Inspired by Android CoordinatorLayout behavior
 */

class HeaderCollapseEffect {
  private heroPhoto: HTMLElement | null;
  private heroName: HTMLElement | null;
  private heroSocial: HTMLElement | null;
  private navLogo: HTMLElement | null;
  private navSocial: HTMLElement | null;
  private heroSection: HTMLElement | null;
  private lastScrollY: number = 0;

  constructor() {
    this.heroPhoto = document.querySelector('#hero .profile-photo');
    this.heroName = document.querySelector('#hero .name');
    this.heroSocial = document.querySelector('#hero .social-links');
    this.navLogo = document.querySelector('nav .logo');
    this.navSocial = document.querySelector('.nav-social-links');
    this.heroSection = document.querySelector('#hero');

    if (!this.heroPhoto || !this.heroName || !this.heroSocial || !this.navLogo || !this.navSocial || !this.heroSection) {
      console.warn('Header collapse: Required elements not found');
      return;
    }

    // Hide nav logo and social initially
    (this.navLogo as HTMLElement).style.opacity = '0';
    (this.navLogo as HTMLElement).style.transform = 'scale(0.8)';
    (this.navSocial as HTMLElement).style.opacity = '0';
    (this.navSocial as HTMLElement).style.transform = 'scale(0.8)';

    // Listen to scroll
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    // Initial check
    this.onScroll();
  }

  private onScroll(): void {
    if (!this.heroSection || !this.navLogo) return;

    const scrollY = window.scrollY;
    const heroRect = this.heroSection.getBoundingClientRect();
    const heroTop = heroRect.top;
    const heroHeight = heroRect.height;

    // Calculate progress: 0 (hero at top) to 1 (transition complete)
    // Start transition immediately as user scrolls
    // Complete transition when hero photo would hit the navbar
    const transitionDistance = heroHeight * 0.7; // Extended transition duration
    const scrollProgress = (0 - heroTop) / transitionDistance;
    const progress = Math.max(0, Math.min(1, scrollProgress));

    // Apply transformations
    this.updateHeroElements(1 - progress);
    this.updateNavElements(progress);

    this.lastScrollY = scrollY;
  }

  private updateHeroElements(visibility: number): void {
    if (!this.heroPhoto || !this.heroName || !this.heroSocial || !this.navLogo) return;

    const progress = 1 - visibility; // 0 (hero visible) to 1 (collapsed)

    // Get positions for smooth movement - need to account for current transforms
    const heroPhotoRect = (this.heroPhoto as HTMLElement).getBoundingClientRect();
    const navLogoPhotoRect = (this.navLogo as HTMLElement).querySelector('.logo-photo')?.getBoundingClientRect();

    if (!navLogoPhotoRect) return;

    // Calculate center positions
    const heroPhotoCenterY = heroPhotoRect.top + heroPhotoRect.height / 2;
    const navPhotoCenterY = navLogoPhotoRect.top + navLogoPhotoRect.height / 2;
    const heroPhotoCenterX = heroPhotoRect.left + heroPhotoRect.width / 2;
    const navPhotoCenterX = navLogoPhotoRect.left + navLogoPhotoRect.width / 2;

    // Calculate deltas
    const deltaY = navPhotoCenterY - heroPhotoCenterY;
    const deltaX = navPhotoCenterX - heroPhotoCenterX;

    // Apply smooth arcing motion with stronger easing for smoother transition
    const easeProgress = 1 - Math.pow(1 - progress, 2.5); // Stronger ease-out
    const translateY = deltaY * easeProgress;
    const translateX = deltaX * easeProgress;

    // Gentler arc
    const arcHeight = -30; // Reduced arc height
    const arc = arcHeight * Math.sin(progress * Math.PI);

    // Scale from 150px (hero) to 36px (nav)
    const heroSize = 150;
    const navSize = 36;
    const currentSize = heroSize - ((heroSize - navSize) * easeProgress);
    const scale = currentSize / heroSize;

    // Keep photo visible longer, fade only at the very end
    const opacity = Math.max(0, Math.min(1, visibility * 1.5 - 0.5));

    (this.heroPhoto as HTMLElement).style.opacity = opacity.toString();
    (this.heroPhoto as HTMLElement).style.transform =
      `translate(${translateX}px, ${translateY + arc}px) scale(${scale})`;

    // Name fades out more quickly
    const nameOpacity = Math.pow(visibility, 2); // Faster fade
    (this.heroName as HTMLElement).style.opacity = nameOpacity.toString();
    (this.heroName as HTMLElement).style.transform = `scale(${0.7 + (visibility * 0.3)})`;

    // Social icons fade out
    (this.heroSocial as HTMLElement).style.opacity = opacity.toString();
    (this.heroSocial as HTMLElement).style.transform = `scale(${0.8 + (visibility * 0.2)})`;
  }

  private updateNavElements(visibility: number): void {
    if (!this.navLogo || !this.navSocial) return;

    // Fade in and scale up nav logo and social icons
    // Start fading in earlier to create overlap/seamless transition
    const fadeInProgress = Math.max(0, (visibility - 0.3) / 0.7); // Start at 30% progress
    const scale = 0.8 + (fadeInProgress * 0.2); // Scale from 0.8 to 1
    const opacity = fadeInProgress;

    (this.navLogo as HTMLElement).style.opacity = opacity.toString();
    (this.navLogo as HTMLElement).style.transform = `scale(${scale})`;

    (this.navSocial as HTMLElement).style.opacity = opacity.toString();
    (this.navSocial as HTMLElement).style.transform = `scale(${scale})`;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new HeaderCollapseEffect());
} else {
  new HeaderCollapseEffect();
}
