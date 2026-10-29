// main.js - Application bootstrap & orchestration
import { EarthEngine } from './earthEngine.js';
import { MicroscopeExplorer } from './microscope.js';
import { PlasticCalculator } from './calculator.js';
import { TimelineSimulator } from './timeline.js';
import { PlasticQuiz } from './quiz.js';
import { SoundScape } from './audio.js';
import { UIKitShowcase } from './uikit.js';
import { setLang, getCurrentLang, registerModule, t } from './i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader Handling
  const preloader = document.getElementById('preloader');
  const preloaderBar = document.getElementById('preloader-bar');
  const preloaderText = document.getElementById('preloader-text');

  function hidePreloader() {
    if (!preloader || preloader.classList.contains('loaded')) return;
    preloader.classList.add('loaded');
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 600);
  }

  // Fallback for preloader in case assets are cached
  window.addEventListener('load', () => setTimeout(hidePreloader, 1200));

  // 2. Scroll Reveal Observer for page animations
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal, .reveal-delay-1, .reveal-delay-2, .reveal-delay-3, .reveal-delay-4').forEach(el => {
    revealObserver.observe(el);
  });

  // 3. Floating Neo-Tactile Notification Toast
  const toast = document.getElementById('neo-toast');
  const toastTitle = document.getElementById('toast-title');
  const toastDesc = document.getElementById('toast-desc');
  let toastTimer = null;

  function showNeoNotification(title, desc, symbol = '✦') {
    if (!toast) return;
    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;
    const symEl = toast.querySelector('.neo-toast-symbol');
    if (symEl) symEl.textContent = symbol;

    toast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 3800);
  }

  // 4. Audio Synthesizer (Generative Soundscape)
  const soundScape = new SoundScape();
  const btnSound = document.getElementById('btn-sound');
  const soundIcon = document.getElementById('sound-icon');
  const soundTextEl = document.getElementById('sound-text');
  const dockSoundIcon = document.getElementById('dock-sound-icon');

  function toggleAudio() {
    const isPlaying = soundScape.toggle();
    const isEn = getCurrentLang() === 'en';
    const soundText = isPlaying 
      ? (isEn ? 'Sound On' : 'Звук вкл') 
      : (isEn ? 'Sound' : 'Звук');
    const soundIconText = isPlaying ? '🔊' : '🔈';

    if (soundIcon) soundIcon.textContent = soundIconText;
    if (soundTextEl) soundTextEl.textContent = soundText;
    if (dockSoundIcon) dockSoundIcon.textContent = soundIconText;

    if (btnSound) {
      if (isPlaying) {
        btnSound.classList.add('active');
        btnSound.classList.add('btn-pill--accent');
      } else {
        btnSound.classList.remove('active');
        btnSound.classList.remove('btn-pill--accent');
      }
    }

    showNeoNotification(
      isEn ? 'OCEAN AMBIENT SOUND' : 'ЗВУКОВОЙ ЭМБИЕНТ',
      isPlaying 
        ? (isEn ? 'Deep hydroacoustic synthesizer activated' : 'Глубинный гидроакустический синтезатор включён')
        : (isEn ? 'Ambient sound muted' : 'Звуковой фон отключён'),
      isPlaying ? '🔊' : '🔈'
    );
  }

  if (btnSound) {
    btnSound.addEventListener('click', toggleAudio);
  }

  // 5. Mobile Menu Drawer Toggle & Navbar Scroll State
  const navbar = document.getElementById('navbar');
  const navBurger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (navBurger && mobileMenu) {
    navBurger.addEventListener('click', () => {
      navBurger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        navBurger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // 6. Earth Canvas 3D Engine
  const earthCanvas = document.getElementById('earth-canvas');
  const markerDrawer = document.getElementById('marker-drawer');
  const drawerContent = document.getElementById('drawer-content');
  const drawerClose = document.getElementById('drawer-close');
  const hotspotsPillsContainer = document.getElementById('hotspots-pills');

  let activeMarkerPill = null;
  let currentOpenMarker = null;

  const earth = new EarthEngine(earthCanvas, {
    manifestUrl: '/assets/earth/manifest.json',
    previewUrl: '/assets/earth/preview.webp',
    onProgress: (p) => {
      const pct = Math.round(p * 100);
      if (preloaderBar) preloaderBar.style.width = `${pct}%`;
      if (preloaderText) preloaderText.textContent = `${t('preloader.text')} ${pct}%`;
      if (p >= 1) hidePreloader();
    },
    onReady: () => {
      hidePreloader();
    },
    onMarkerSelect: (marker) => {
      if (soundScape.isPlaying) {
        soundScape.playBlip(780);
      }
      showMarkerDetails(marker);
    }
  });

  registerModule('earth', earth);

  // Render hotspot pills
  function renderHotspotPills() {
    if (!hotspotsPillsContainer) return;
    hotspotsPillsContainer.innerHTML = '';

    earth.markers.forEach((marker) => {
      const pill = document.createElement('button');
      pill.className = 'hotspot-pill';
      pill.dataset.id = marker.id;
      if (currentOpenMarker && currentOpenMarker.id === marker.id) {
        pill.classList.add('active');
        activeMarkerPill = pill;
      }
      pill.innerHTML = `<span>${marker.icon}</span> <span>${marker.name}</span>`;
      
      pill.addEventListener('click', () => {
        earth.rotateToMarker(marker.id);
        updateActivePill(pill);
      });

      hotspotsPillsContainer.appendChild(pill);
    });
  }

  renderHotspotPills();

  function updateActivePill(pill) {
    if (activeMarkerPill) {
      activeMarkerPill.classList.remove('active');
    }
    pill.classList.add('active');
    activeMarkerPill = pill;
  }

  function showMarkerDetails(marker) {
    if (!markerDrawer || !drawerContent) return;
    currentOpenMarker = marker;

    // Update corresponding pill
    const matchingPill = hotspotsPillsContainer?.querySelector(`[data-id="${marker.id}"]`);
    if (matchingPill) {
      updateActivePill(matchingPill);
    }

    const badgeClass = (marker.dangerLevel === 'Критический' || marker.dangerLevel === 'Critical')
      ? 'badge-critical' 
      : ((marker.dangerLevel === 'Экстремальный' || marker.dangerLevel === 'Extreme') ? 'badge-extreme' : 'badge-high');

    drawerContent.innerHTML = `
      <div class="drawer-icon">${marker.icon}</div>
      <div class="drawer-region">${marker.region}</div>
      <h3 class="drawer-name">${marker.name}</h3>
      <div class="drawer-badge ${badgeClass}">
        ${t('drawer.danger')} ${marker.dangerLevel}
      </div>
      <p class="drawer-desc">${marker.description}</p>
      <div class="drawer-stats">
        <div class="drawer-stat-row">
          <span class="drawer-stat-key">${t('drawer.particles')}</span>
          <span class="drawer-stat-val">${marker.particles}</span>
        </div>
        <div class="drawer-stat-row">
          <span class="drawer-stat-key">${t('drawer.depth')}</span>
          <span class="drawer-stat-val" style="color: var(--amber);">${marker.depth}</span>
        </div>
        <div class="drawer-stat-row">
          <span class="drawer-stat-key">${t('drawer.coords')}</span>
          <span class="drawer-stat-val" style="color: #cbd5e1;">${marker.lat.toFixed(1)}°N, ${Math.abs(marker.lon).toFixed(1)}°${marker.lon < 0 ? 'W' : 'E'}</span>
        </div>
      </div>
    `;

    markerDrawer.classList.add('open');
    showNeoNotification(
      marker.region.toUpperCase(),
      `${marker.name} — ${marker.particles}`,
      marker.icon
    );
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', () => {
      markerDrawer.classList.remove('open');
      earth.activeMarker = null;
      currentOpenMarker = null;
      if (activeMarkerPill) {
        activeMarkerPill.classList.remove('active');
        activeMarkerPill = null;
      }
    });
  }

  // 7. Interactive Hero Dock (Segmented Capsule From Reference)
  const dockBtnRotate = document.getElementById('dock-btn-rotate');
  const dockRotateIcon = document.getElementById('dock-rotate-icon');
  const dockBtnReset = document.getElementById('dock-btn-reset');
  const dockBtnRandom = document.getElementById('dock-btn-random');
  const dockBtnSound = document.getElementById('dock-btn-sound');
  const dockBtnGlow = document.getElementById('dock-btn-glow');

  if (dockBtnRotate) {
    dockBtnRotate.addEventListener('click', () => {
      const isAuto = earth.toggleAutoRotate();
      if (dockRotateIcon) dockRotateIcon.textContent = isAuto ? '⏸' : '▶';
      const isEn = getCurrentLang() === 'en';
      showNeoNotification(
        isEn ? 'EARTH ROTATION' : 'ВРАЩЕНИЕ ЗЕМЛИ',
        isAuto 
          ? (isEn ? 'Automatic rotation resumed' : 'Автоматическое вращение возобновлено')
          : (isEn ? 'Planet locked to manual cursor control' : 'Планета зафиксирована курсором'),
        isAuto ? '⏸' : '▶'
      );
    });
  }

  if (dockBtnReset) {
    dockBtnReset.addEventListener('click', () => {
      earth.resetView();
      if (activeMarkerPill) {
        activeMarkerPill.classList.remove('active');
        activeMarkerPill = null;
      }
      if (markerDrawer) markerDrawer.classList.remove('open');
      currentOpenMarker = null;
      const isEn = getCurrentLang() === 'en';
      showNeoNotification(
        isEn ? 'ORIENTATION' : 'ОРИЕНТАЦИЯ',
        isEn ? 'Planet reset to primary observation axis' : 'Планета возвращена в исходное положение',
        '🔄'
      );
    });
  }

  if (dockBtnRandom) {
    dockBtnRandom.addEventListener('click', () => {
      const rand = earth.selectRandomMarker();
      if (rand) {
        showMarkerDetails(rand);
      }
    });
  }

  if (dockBtnSound) {
    dockBtnSound.addEventListener('click', toggleAudio);
  }

  if (dockBtnGlow) {
    dockBtnGlow.addEventListener('click', () => {
      dockBtnGlow.classList.toggle('active-ring');
      const isGlowing = dockBtnGlow.classList.contains('active-ring');
      const isEn = getCurrentLang() === 'en';
      showNeoNotification(
        isEn ? 'NEO-TACTILE GLOW' : 'НЕО-ТАКТИЛЬНЫЙ РЕЖИМ',
        isGlowing 
          ? (isEn ? 'Dual neon aura and specular frosted glass enabled' : 'Двойной неоновый ореол и матовое стекло активны')
          : (isEn ? 'Base studio illumination active' : 'Базовое освещение включено'),
        '✨'
      );
    });
  }

  // 8. Microscope Explorer
  const microscopeContainer = document.getElementById('microscope');
  if (microscopeContainer) {
    const microscope = new MicroscopeExplorer(microscopeContainer);
    registerModule('microscope', microscope);
  }

  // 9. Personal Plastic Calculator
  const calcContainer = document.getElementById('calculator');
  if (calcContainer) {
    const calculator = new PlasticCalculator(calcContainer);
    registerModule('calculator', calculator);
  }

  // 10. Timeline Simulator
  const timelineContainer = document.getElementById('timeline');
  if (timelineContainer) {
    const timeline = new TimelineSimulator(timelineContainer);
    registerModule('timeline', timeline);
  }

  // 11. Interactive Quiz
  const quizContainer = document.getElementById('quiz-container');
  if (quizContainer) {
    const quiz = new PlasticQuiz(quizContainer);
    registerModule('quiz', quiz);
  }

  // 12. Neo-Tactile UI Kit Showcase Engine
  const showcaseContainer = document.getElementById('showcase');
  if (showcaseContainer) {
    const uikit = new UIKitShowcase(showcaseContainer, {
      soundScape,
      showToast: showNeoNotification,
      lang: getCurrentLang()
    });
    registerModule('uikit', uikit);
  }

  // 13. Language Toggle (RU / EN)
  const btnLang = document.getElementById('btn-lang');
  const langText = document.getElementById('lang-text');
  const langIcon = document.getElementById('lang-icon');

  if (btnLang) {
    btnLang.addEventListener('click', () => {
      const current = getCurrentLang();
      const next = current === 'ru' ? 'en' : 'ru';
      setLang(next);

      if (langText) langText.textContent = next.toUpperCase();
      if (langIcon) langIcon.textContent = next === 'ru' ? '🇷🇺' : '🇬🇧';

      // Re-render hotspot pills in new language
      renderHotspotPills();

      // If drawer is open, refresh marker info in new language
      if (currentOpenMarker) {
        const updated = earth.markers.find(m => m.id === currentOpenMarker.id);
        if (updated) {
          showMarkerDetails(updated);
        }
      }

      showNeoNotification(
        next === 'en' ? 'LANGUAGE CHANGED' : 'ЯЗЫК ИЗМЕНЕН',
        next === 'en' ? 'Switched to English version' : 'Сайт переключен на русский язык',
        next === 'en' ? '🇬🇧' : '🇷🇺'
      );

      // Update sound button text
      const soundIsPlaying = soundScape.isPlaying;
      if (soundIcon) soundIcon.textContent = soundIsPlaying ? '🔊' : '🔈';
      if (soundTextEl) {
        soundTextEl.textContent = soundIsPlaying
          ? (next === 'en' ? 'Sound On' : 'Звук вкл')
          : (next === 'en' ? 'Sound' : 'Звук');
      }
    });
  }
});
