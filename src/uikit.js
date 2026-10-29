// uikit.js - Interactive Neo-Tactile UI Kit Showcase Engine
// Makes all buttons, switches, sliders, dropdowns, accordions, and tokens fully functional and tactile

export class UIKitShowcase {
  constructor(container, options = {}) {
    this.container = container;
    this.soundScape = options.soundScape || null;
    this.showToast = options.showToast || (() => {});
    this.lang = options.lang || 'ru';

    this.activeAccentColor = '#0284c7'; // default cobalt blue
    this.init();
  }

  setLang(lang) {
    this.lang = lang;
    this.updateLanguageTexts();
  }

  updateLanguageTexts() {
    const isEn = this.lang === 'en';
    
    // Update spec labels
    const hoverTitle = this.container.querySelector('#showcase-hover-title');
    const hoverMeta = this.container.querySelector('#showcase-hover-meta');
    if (hoverTitle) hoverTitle.textContent = isEn ? 'Hover state elevates element' : 'Hover state elevates element';
    if (hoverMeta) hoverMeta.textContent = isEn ? 'Tactile elevation physics with progressive shadow blur' : 'Тактильная физика подъема с размытием тени';

    const loadingTitle = this.container.querySelector('#showcase-loading-title');
    const loadingMeta = this.container.querySelector('#showcase-loading-meta');
    if (loadingTitle) loadingTitle.textContent = isEn ? 'Loading state shows animation' : 'Loading state shows animation';
    if (loadingMeta) loadingMeta.textContent = isEn ? 'Segmented neon cyclic progress indicator' : 'Сегментированный неоновый циклический индикатор';

    // Update accordion texts
    const reateeDesc = this.container.querySelector('#reatee-desc');
    if (reateeDesc) {
      reateeDesc.innerHTML = isEn 
        ? '<strong>Verified Eco-Identity:</strong> Zero single-use plastic badge issued. 320 kg CO₂e offset.'
        : '<strong>Верифицированный эко-профиль:</strong> Знак нулевого использования пластика. Сэкономлено 320 кг CO₂e.';
    }

    const llogzenDesc = this.container.querySelector('#llogzen-desc');
    if (llogzenDesc) {
      llogzenDesc.innerHTML = isEn
        ? '<strong>Cellular Shield:</strong> 100 nm nanofiltration membrane active. 99.8% filtration efficiency.'
        : '<strong>Клеточный щит:</strong> Мембрана нанофильтрации 100 нм активна. Эффективность барьера 99.8%.';
    }

    const laclitenDesc = this.container.querySelector('#lacliten-desc');
    if (laclitenDesc) {
      laclitenDesc.innerHTML = isEn
        ? '<strong>Cloud Telemetry:</strong> Connected to Global Ocean Cleanup sensors. Latency: 14 ms.'
        : '<strong>Облачная телеметрия:</strong> Подключено к океаническим датчикам очистки. Задержка: 14 мс.';
    }
  }

  init() {
    this.bindPills();
    this.bindDropdown();
    this.bindDock();
    this.bindSwitchesAndSliders();
    this.bindAccordions();
    this.bindTokensAndActions();
    this.bindHeaderMenu();
  }

  playClick(pitch = 600) {
    if (this.soundScape && typeof this.soundScape.playBlip === 'function') {
      this.soundScape.playBlip(pitch);
    }
  }

  // 1. Defart / Active pill buttons
  bindPills() {
    const pillDef = this.container.querySelector('#demo-pill-default');
    const pillAct = this.container.querySelector('#demo-pill-active');

    if (pillDef && pillAct) {
      pillDef.addEventListener('click', () => {
        pillDef.classList.add('btn-pill--accent');
        pillAct.classList.remove('btn-pill--accent');
        this.playClick(520);
        this.showToast(
          this.lang === 'en' ? 'TACTILE BUTTON' : 'ТАКТИЛЬНЫЙ ЭЛЕМЕНТ',
          this.lang === 'en' ? 'Default clay elevation state activated' : 'Выбран тактильный Defart-элемент с мягким светом',
          '🔘'
        );
      });

      pillAct.addEventListener('click', () => {
        pillAct.classList.add('btn-pill--accent');
        pillDef.classList.remove('btn-pill--accent');
        this.playClick(840);
        this.showToast(
          this.lang === 'en' ? 'ACTIVE BUTTON' : 'АКТИВНЫЙ ЭЛЕМЕНТ',
          this.lang === 'en' ? 'Cobalt active state with specular elevation activated' : 'Активирован королевский синий active-элемент',
          '🔹'
        );
      });
    }
  }

  // 2. Dropdown: Calded / Select / led
  bindDropdown() {
    const trigger = this.container.querySelector('#calded-trigger');
    const menu = this.container.querySelector('#calded-menu');
    const label = this.container.querySelector('#calded-selected-label');

    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('show');
      menu.classList.toggle('show', !isOpen);
      trigger.setAttribute('aria-expanded', !isOpen);
      this.playClick(isOpen ? 450 : 700);
    });

    const options = menu.querySelectorAll('.calded-option');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const color = opt.dataset.color || '#0284c7';
        const name = opt.dataset.name || opt.textContent.trim();
        this.activeAccentColor = color;

        if (label) {
          label.innerHTML = `<span>${name}</span> <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${color};margin-left:6px;box-shadow:0 0 8px ${color}"></span>`;
        }

        // Apply dynamic accent to showcase phone card glow
        const phoneCol = this.container.querySelector('.showcase-phone-col');
        if (phoneCol) {
          phoneCol.style.boxShadow = `0 12px 36px -6px ${color}33, inset 0 1px 1px rgba(255,255,255,0.12)`;
        }

        menu.classList.remove('show');
        this.playClick(920);
        this.showToast(
          this.lang === 'en' ? 'ACCENT COLOR' : 'ЦВЕТОВОЙ АКЦЕНТ',
          this.lang === 'en' ? `Theme switched to: ${name}` : `Тематический акцент изменён на: ${name}`,
          '🎨'
        );
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  }

  // 3. Segmented Capsule Dock (=, ·, ≡, +, ✦)
  bindDock() {
    const dockButtons = this.container.querySelectorAll('#showcase-dock .neo-dock-btn');
    const modes = [
      { ru: 'Режим 1: Линейная физика интерфейса', en: 'Mode 1: Linear Interface Physics', icon: '＝', pitch: 480 },
      { ru: 'Режим 2: Минималистичный нулевой зазор', en: 'Mode 2: Minimal Zero Clearance', icon: '·', pitch: 580 },
      { ru: 'Режим 3: Структурная сетка выравнивания', en: 'Mode 3: Structured Grid Alignment', icon: '≡', pitch: 680 },
      { ru: 'Режим 4: Добавление нового компонента', en: 'Mode 4: Component Injection', icon: '＋', pitch: 780 },
      { ru: 'Режим 5: Неоновый тактильный ореол', en: 'Mode 5: Neon Tactile Halo Active', icon: '✦', pitch: 920 }
    ];

    dockButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        dockButtons.forEach(b => b.classList.remove('active-ring'));
        btn.classList.add('active-ring');
        
        const m = modes[idx] || modes[4];
        this.playClick(m.pitch);
        this.showToast(
          this.lang === 'en' ? 'TACTILE DOCK' : 'ТАКТИЛЬНЫЙ ДОК',
          this.lang === 'en' ? m.en : m.ru,
          m.icon
        );
      });
    });
  }

  // 4. Switches and Sliders
  bindSwitchesAndSliders() {
    const switchOn = this.container.querySelector('#showcase-switch-on');
    const sliderOn = this.container.querySelector('#showcase-slider-on');
    const badgeOn = this.container.querySelector('#showcase-val-on');

    const switchOff = this.container.querySelector('#showcase-switch-off');
    const sliderOff = this.container.querySelector('#showcase-slider-off');
    const badgeOff = this.container.querySelector('#showcase-val-off');

    if (sliderOn && badgeOn) {
      sliderOn.addEventListener('input', (e) => {
        badgeOn.textContent = `${e.target.value}%`;
        const phoneCol = this.container.querySelector('.showcase-phone-col');
        if (phoneCol && switchOn && switchOn.checked) {
          const brightness = 0.8 + (e.target.value / 100) * 0.4;
          phoneCol.style.filter = `brightness(${brightness})`;
        }
      });
    }

    if (switchOn && sliderOn) {
      switchOn.addEventListener('change', () => {
        sliderOn.disabled = !switchOn.checked;
        sliderOn.style.opacity = switchOn.checked ? '1' : '0.4';
        this.playClick(switchOn.checked ? 750 : 400);
        this.showToast(
          'SWITCH [ON]',
          this.lang === 'en' 
            ? (switchOn.checked ? 'Channel ON activated (Full power)' : 'Channel ON deactivated')
            : (switchOn.checked ? 'Канал ON активирован (Полная мощность)' : 'Канал ON отключён'),
          switchOn.checked ? '⚡' : '💤'
        );
      });
    }

    if (sliderOff && badgeOff) {
      sliderOff.addEventListener('input', (e) => {
        badgeOff.textContent = `${e.target.value}%`;
      });
    }

    if (switchOff && sliderOff) {
      switchOff.addEventListener('change', () => {
        sliderOff.disabled = !switchOff.checked;
        sliderOff.style.opacity = switchOff.checked ? '1' : '0.4';
        this.playClick(switchOff.checked ? 700 : 350);
        this.showToast(
          'SWITCH [OFF]',
          this.lang === 'en'
            ? (switchOff.checked ? 'Auxiliary Channel connected' : 'Auxiliary Channel disconnected')
            : (switchOff.checked ? 'Дополнительный канал подключён' : 'Дополнительный канал отключён'),
          switchOff.checked ? '🟢' : '⚪'
        );
      });
    }
  }

  // 5. Modal Accordions
  bindAccordions() {
    const accButtons = this.container.querySelectorAll('.modal-acc-btn');
    accButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const panel = this.container.querySelector(`#${targetId}`);
        const chevron = btn.querySelector('.acc-chevron');
        if (!panel) return;

        const isOpen = panel.classList.contains('show');
        panel.classList.toggle('show', !isOpen);
        if (chevron) {
          chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
        }
        this.playClick(isOpen ? 450 : 650);
      });
    });

    const modalDots = this.container.querySelector('#modal-dots-btn');
    if (modalDots) {
      modalDots.addEventListener('click', () => {
        this.playClick(800);
        this.showToast(
          'MODAL SPECIFICATION',
          this.lang === 'en'
            ? 'Specular frosted modal with 22px curvature and sub-pixel border'
            : 'Матовое модальное окно с радиусом скругления 22px и субпиксельной рамкой',
          '👩'
        );
      });
    }
  }

  // 6. Token specs, Elevate Disc, Spinner, Replenner, Notification
  bindTokensAndActions() {
    // Cobalt token copy
    const tokenBlue = this.container.querySelector('#token-blue');
    if (tokenBlue) {
      tokenBlue.addEventListener('click', () => {
        const code = 'box-shadow: 0 4px 14px 1.5px rgba(2, 132, 199, 0.55);';
        navigator.clipboard?.writeText(code).catch(() => {});
        this.playClick(880);
        this.showToast(
          'TOKEN COPIED',
          this.lang === 'en' ? 'Cobalt Active Accent shadow token copied' : 'CSS-токен кобальтового ореола скопирован в буфер',
          '📋'
        );
      });
    }

    // Slate token copy
    const tokenSlate = this.container.querySelector('#token-slate');
    if (tokenSlate) {
      tokenSlate.addEventListener('click', () => {
        const code = 'box-shadow: inset 0 12px 18px 1.5px rgba(15, 23, 42, 0.8);';
        navigator.clipboard?.writeText(code).catch(() => {});
        this.playClick(600);
        this.showToast(
          'TOKEN COPIED',
          this.lang === 'en' ? 'Ambient Occlusion token copied' : 'CSS-токен глубинного затемнения скопирован в буфер',
          '📋'
        );
      });
    }

    // Elevate button bounce
    const elevateBtn = this.container.querySelector('#token-elevate-btn');
    if (elevateBtn) {
      elevateBtn.addEventListener('click', () => {
        elevateBtn.classList.add('bouncing');
        this.playClick(960);
        setTimeout(() => elevateBtn.classList.remove('bouncing'), 400);
        this.showToast(
          this.lang === 'en' ? 'TACTILE PHYSICS' : 'ТАКТИЛЬНАЯ ФИЗИКА',
          this.lang === 'en' ? 'Spring-mass elevation bounce triggered' : 'Сработала тактильная физика подъема элемента',
          '⬡'
        );
      });
    }

    // Spinner toggle
    const spinner = this.container.querySelector('#token-spinner');
    if (spinner) {
      let spinState = 0; // 0 = spinning, 1 = paused, 2 = success
      spinner.addEventListener('click', () => {
        spinState = (spinState + 1) % 3;
        this.playClick(spinState === 2 ? 1050 : 650);

        if (spinState === 0) {
          spinner.className = 'neo-loading-spinner';
          this.showToast('SPINNER', this.lang === 'en' ? 'Loading animation running' : 'Индикатор загрузки запущен', '⏳');
        } else if (spinState === 1) {
          spinner.className = 'neo-loading-spinner paused';
          this.showToast('SPINNER', this.lang === 'en' ? 'Animation paused' : 'Анимация приостановлена', '⏸');
        } else {
          spinner.className = 'neo-loading-spinner complete';
          this.showToast('SUCCESS', this.lang === 'en' ? 'Process 100% complete!' : 'Процесс успешно завершён!', '✓');
        }
      });
    }

    // Replenner button
    const replenBtn = this.container.querySelector('#btn-replenner');
    if (replenBtn) {
      replenBtn.addEventListener('click', () => {
        this.playClick(720);
        this.showToast(
          'REPLENNER ACTION',
          this.lang === 'en' 
            ? 'Ocean Filter clean cycle triggered. 450 µg captured.' 
            : 'Запущен цикл очистки микроволоконного фильтра. Задержано 450 мкг.',
          '＋'
        );
      });
    }

    // Live Notification test button
    const notifBtn = this.container.querySelector('#btn-test-notification');
    if (notifBtn) {
      notifBtn.addEventListener('click', () => {
        this.playClick(850);
        this.showToast(
          this.lang === 'en' ? 'NOTIFICATION TEST' : 'ТЕСТ УВЕДОМЛЕНИЯ',
          this.lang === 'en' 
            ? 'Neo-Tactile notification triggered with sub-pixel frosted blur' 
            : 'Тактильное уведомление вызвано с размытием матового стекла',
          '🧊'
        );
      });
    }
  }

  // 7. UI Kit Header Hamburger Menu
  bindHeaderMenu() {
    const burger = this.container.querySelector('#showcase-burger');
    const menu = this.container.querySelector('#showcase-menu-dropdown');

    if (!burger || !menu) return;

    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('show');
      menu.classList.toggle('show', !isOpen);
      this.playClick(isOpen ? 480 : 750);
    });

    const menuItems = menu.querySelectorAll('.showcase-menu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = item.dataset.action;
        menu.classList.remove('show');
        this.playClick(820);

        if (action === 'reset') {
          // Reset switches and sliders
          const sOn = this.container.querySelector('#showcase-slider-on');
          const sOff = this.container.querySelector('#showcase-slider-off');
          if (sOn) { sOn.value = 65; sOn.dispatchEvent(new Event('input')); }
          if (sOff) { sOff.value = 25; sOff.dispatchEvent(new Event('input')); }
          this.showToast('UI KIT', this.lang === 'en' ? 'Controls reset to defaults' : 'Элементы сброшены к значениям по умолчанию', '🔄');
        } else if (action === 'inspect') {
          this.showToast('SPEC', this.lang === 'en' ? 'Border: 1px solid rgba(255,255,255,0.12) | Radius: 24px' : 'Рамка: 1px solid rgba(255,255,255,0.12) | Радиус: 24px', '🔍');
        } else {
          this.showToast('STUDIO LIGHTING', this.lang === 'en' ? 'Studio ambient lighting calibrated' : 'Студийное освещение интерфейса откалибровано', '💡');
        }
      });
    });

    document.addEventListener('click', () => {
      menu.classList.remove('show');
    });
  }
}
