// microscope.js - Interactive Scale & Microscope Explorer
// Visualizes how plastic breaks down from macroscopic litter down to cellular-penetrating nanoplastics

export class MicroscopeExplorer {
  constructor(container) {
    this.container = container;
    this.canvas = container.querySelector('#microscope-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.slider = container.querySelector('#microscope-slider');
    this.infoContainer = container.querySelector('#microscope-info');
    this.scaleLabel = container.querySelector('#microscope-scale-label');

    this.lang = 'ru';

    this.scalesData = {
      ru: [
        {
          id: 'cap',
          zoom: 0,
          size: '10 мм (1 см)',
          name: 'Пластиковая крышка / Фрагмент упаковки',
          category: 'Макропластик',
          danger: 'Удушье птиц и черепах при заглатывании',
          penetration: 'Остается в желудочно-кишечном тракте животных',
          description: 'Обычный бытовой мусор. Под воздействием солнечного ультрафиолета, соленой воды и механических ударов волн полимерные цепочки становятся хрупкими и начинают крошиться.',
          visualType: 'macro_bottle',
          color: '#38bdf8'
        },
        {
          id: 'nurdle',
          zoom: 1,
          size: '5 мм',
          name: 'Гранула первичного пластика (нурдл)',
          category: 'Порог микропластика (верхняя граница)',
          danger: 'Птицы и рыбы путают с икрой и рыбьим кормом',
          penetration: 'Блокирует пищевод, вызывает ложное чувство сытости',
          description: 'Сырье для любого завода пластмасс. Ежегодно триллионы нурдлов теряются при транспортировке и смываются в реки. Содержит химические пластификаторы и огнестойкие присадки.',
          visualType: 'nurdle_pellet',
          color: '#f59e0b'
        },
        {
          id: 'sand',
          zoom: 2,
          size: '1 мм (1000 мкм)',
          name: 'Фрагмент на песчаном пляже',
          category: 'Вторичный микропластик',
          danger: 'Поглощается песчаными червями, моллюсками, крабами',
          penetration: 'Накапливается в донных отложениях и водорослях',
          description: 'Размер крупицы соли или песчинки. Покрывается биопленкой из бактерий и водорослей («пластисфера»), приобретая запах натуральной пищи для морских обитателей.',
          visualType: 'fragment_sand',
          color: '#fbbf24'
        },
        {
          id: 'fiber',
          zoom: 3,
          size: '50 мкм (0.05 мм)',
          name: 'Синтетическое микроволокно (полиэстер/нейлон)',
          category: 'Текстильный микропластик',
          danger: 'Проникает в жабры рыб и ткани планктона, витает в домашней пыли',
          penetration: 'Вдыхается легкими человека; обнаружено в дождевой воде',
          description: 'Толщина меньше человеческого волоса. Всего одна машинная стирка флисовой кофты высвобождает до 700 000 таких волокон, которые не улавливаются городскими очистными станциями.',
          visualType: 'synthetic_fiber',
          color: '#f97316'
        },
        {
          id: 'cell',
          zoom: 4,
          size: '7–10 мкм',
          name: 'Клетка крови человека (эритроцит) vs Частица пластика',
          category: 'Биологический барьер',
          danger: 'Частицы пластика равны по размеру форменным элементам крови',
          penetration: 'Обнаружен в крови 80% здоровых доноров-людей (исследование 2022 года)',
          description: 'На этом масштабе микропластик начинает циркулировать по кровеносной системе. Исследования Амстердамского свободного университета подтвердили присутствие ПЭТ, полистирола и полиэтилена в кровотоке человека.',
          visualType: 'blood_cells',
          color: '#ef4444'
        },
        {
          id: 'nano',
          zoom: 5,
          size: '100 нм (0.1 мкм)',
          name: 'Нанопластик (клеточная инвазия)',
          category: 'Нанопластик — наивысшая угроза',
          danger: 'Проходит сквозь мембраны клеток, плацентарный и гематоэнцефалический барьер',
          penetration: 'Проникает в клетки мозга, печени, сердца и тканей эмбриона',
          description: 'Субмикроскопические частицы. Обладают колоссальной удельной площадью поверхности, адсорбируют токсичные яды (диоксины, ПХБ) и вызывают окислительный стресс, мутации и воспаления на уровне ДНК клеток.',
          visualType: 'nanoplastic_invasion',
          color: '#ec4899'
        }
      ],
      en: [
        {
          id: 'cap',
          zoom: 0,
          size: '10 mm (1 cm)',
          name: 'Plastic Bottle Cap / Fragment',
          category: 'Macroplastic',
          danger: 'Suffocation of seabirds and sea turtles upon ingestion',
          penetration: 'Persists in animal gastrointestinal tracts',
          description: 'Common household litter. Under solar UV, saltwater and physical wave impact, polymer chains embrittle and shatter into microscopic fragments.',
          visualType: 'macro_bottle',
          color: '#38bdf8'
        },
        {
          id: 'nurdle',
          zoom: 1,
          size: '5 mm',
          name: 'Pre-production Plastic Pellet (Nurdle)',
          category: 'Microplastic Threshold (Upper Bound)',
          danger: 'Birds and fish mistake nurdles for fish eggs and krill',
          penetration: 'Obstructs digestive tract, creates false sensation of fullness',
          description: 'Raw feedstock for plastics manufacturing. Trillions of nurdles spill into waterways every year, carrying toxic flame retardants and plasticizers.',
          visualType: 'nurdle_pellet',
          color: '#f59e0b'
        },
        {
          id: 'sand',
          zoom: 2,
          size: '1 mm (1000 µm)',
          name: 'Beach Sand Fragment',
          category: 'Secondary Microplastic',
          danger: 'Ingested by beach lugworms, bivalves and crabs',
          penetration: 'Accumulates in seabed sediments and coastal algae',
          description: 'The size of a grain of salt. Rapidly colonised by bacterial and algal biofilms ("plastisphere"), mimicking the scent of natural food to marine life.',
          visualType: 'fragment_sand',
          color: '#fbbf24'
        },
        {
          id: 'fiber',
          zoom: 3,
          size: '50 µm (0.05 mm)',
          name: 'Synthetic Microfiber (Polyester / Nylon)',
          category: 'Textile Microplastic',
          danger: 'Infiltrates fish gills and zooplankton; floats in domestic dust',
          penetration: 'Inhaled into deep human lung tissue; found in alpine rainfall',
          description: 'Finer than a human hair. A single wash of a fleece jacket releases up to 700,000 fibers that easily bypass municipal sewage treatment filters.',
          visualType: 'synthetic_fiber',
          color: '#f97316'
        },
        {
          id: 'cell',
          zoom: 4,
          size: '7–10 µm',
          name: 'Human Red Blood Cell vs Plastic Particle',
          category: 'Biological Barrier',
          danger: 'Plastic fragments match the physical dimensions of blood cells',
          penetration: 'Detected in the bloodstream of 80% of human donors (2022)',
          description: 'At this microscale, polymers circulate freely through human arteries and veins. Vrije Universiteit Amsterdam confirmed circulating PET and polyethylene.',
          visualType: 'blood_cells',
          color: '#ef4444'
        },
        {
          id: 'nano',
          zoom: 5,
          size: '100 nm (0.1 µm)',
          name: 'Nanoplastic (Cellular Invasion)',
          category: 'Nanoplastics — Highest Threat Level',
          danger: 'Crosses cell membranes, the placental and blood-brain barriers',
          penetration: 'Infiltrates cells of the brain, myocardium, liver and embryo',
          description: 'Submicroscopic particles with vast surface area. They adsorb persistent organic pollutants and trigger oxidative stress, DNA mutations and systemic inflammation.',
          visualType: 'nanoplastic_invasion',
          color: '#ec4899'
        }
      ]
    };

    this.scales = this.scalesData.ru;

    this.currentIndex = 0;
    this.targetZoom = 0;
    this.currentZoom = 0;
    this.animationFrame = null;

    this.init();
  }

  init() {
    this.setupCanvas();
    this.bindEvents();
    this.updateInfo(0);
    this.startRender();
  }

  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = Math.min(rect.width * 0.7, 380);

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.dpr = dpr;
  }

  bindEvents() {
    this.slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.targetZoom = val;
      const nearestIdx = Math.round(val);
      if (nearestIdx !== this.currentIndex) {
        this.currentIndex = nearestIdx;
        this.updateInfo(nearestIdx);
      }
    });

    const stepButtons = this.container.querySelectorAll('.micro-step-btn, .step-btn');
    stepButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        this.slider.value = idx;
        this.targetZoom = idx;
        this.currentIndex = idx;
        this.updateInfo(idx);
      });
    });

    window.addEventListener('resize', () => {
      this.setupCanvas();
    }, { passive: true });
  }

  setLang(lang) {
    this.lang = lang;
    this.scales = this.scalesData[lang] || this.scalesData.ru;
    
    // Update step buttons labels if needed
    const stepButtons = this.container.querySelectorAll('.micro-step-btn, .step-btn');
    const stepLabels = lang === 'en' 
      ? ['10 mm', '5 mm', '1 mm', '50 µm', '10 µm', '100 nm']
      : ['10 мм', '5 мм', '1 мм', '50 мкм', '10 мкм', '100 нм'];
    stepButtons.forEach((btn, i) => {
      if (stepLabels[i]) btn.textContent = stepLabels[i];
    });

    const edgeLabels = this.container.querySelectorAll('.micro-scale-edge');
    if (edgeLabels.length >= 2) {
      edgeLabels[0].textContent = lang === 'en' ? '10 mm' : '10 мм';
      edgeLabels[1].textContent = lang === 'en' ? '100 nm' : '100 нм';
    }

    this.updateInfo(this.currentIndex);
  }

  updateInfo(idx) {
    const item = this.scales[idx];
    if (!item) return;

    this.scaleLabel.textContent = `${item.size} • ${item.name}`;

    const dangerMeta = this.lang === 'en' ? 'Wildlife Hazard' : 'Опасность для фауны';
    const penetrationMeta = this.lang === 'en' ? 'Biological Penetration' : 'Уровень проникновения';

    this.infoContainer.innerHTML = `
      <div class="scale-badge" style="background: ${item.color}22; color: ${item.color}; border: 1px solid ${item.color}55;">
        ${item.category}
      </div>
      <h3 class="scale-title">${item.name}</h3>
      <p class="scale-desc">${item.description}</p>
      
      <div class="scale-stats-grid">
        <div class="scale-stat-card">
          <div class="stat-meta">${dangerMeta}</div>
          <div class="stat-val-small text-amber-400">${item.danger}</div>
        </div>
        <div class="scale-stat-card">
          <div class="stat-meta">${penetrationMeta}</div>
          <div class="stat-val-small text-sky-400">${item.penetration}</div>
        </div>
      </div>
    `;

    // Highlight active button
    const buttons = this.container.querySelectorAll('.micro-step-btn, .step-btn');
    buttons.forEach((b, i) => {
      if (i === idx) {
        b.classList.add('active');
        b.style.borderColor = item.color;
        b.style.boxShadow = `0 0 14px ${item.color}44`;
      } else {
        b.classList.remove('active');
        b.style.borderColor = '';
        b.style.boxShadow = '';
      }
    });
  }

  startRender() {
    const loop = () => {
      this.currentZoom += (this.targetZoom - this.currentZoom) * 0.15;
      this.render();
      this.animationFrame = requestAnimationFrame(loop);
    };
    this.animationFrame = requestAnimationFrame(loop);
  }

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const dpr = this.dpr;

    ctx.save();
    ctx.scale(dpr, dpr);

    // Dark petri dish / laboratory background
    ctx.fillStyle = '#030816';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const radius = Math.min(w, h) * 0.44;

    // Microscope circular viewfinder
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Microscope lens background gradient
    const lensGrad = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
    lensGrad.addColorStop(0, '#0c1b33');
    lensGrad.addColorStop(0.7, '#071224');
    lensGrad.addColorStop(1, '#02060e');
    ctx.fillStyle = lensGrad;
    ctx.fill();

    // Grid lines for scientific scale reference
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.lineWidth = 1;
    const step = 28;
    for (let x = cx - radius; x <= cx + radius; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, cy - radius);
      ctx.lineTo(x, cy + radius);
      ctx.stroke();
    }
    for (let y = cy - radius; y <= cy + radius; y += step) {
      ctx.beginPath();
      ctx.moveTo(cx - radius, y);
      ctx.lineTo(cx + radius, y);
      ctx.stroke();
    }

    // Dynamic rendering depending on current interpolated zoom
    this.drawMicroscopeVisual(ctx, cx, cy, radius, this.currentZoom);

    // Viewfinder reticle (crosshairs)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy);
    ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx, cy + 20);
    ctx.stroke();

    // Inner rim lens vignette
    const vig = ctx.createRadialGradient(cx, cy, radius * 0.82, cx, cy, radius);
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(0,0,0,0.85)');
    ctx.fillStyle = vig;
    ctx.fill();

    ctx.restore();

    // Viewfinder brass / titanium metallic bezel
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Measurement scale bar in corner of viewfinder
    ctx.fillStyle = '#f8fafc';
    ctx.font = '500 11px "Space Grotesk", monospace';
    const scaleText = this.scales[Math.round(this.currentZoom)]?.size || '';
    ctx.fillText(`МАСШТАБ: ${scaleText}`, cx - radius + 18, cy + radius - 16);

    ctx.restore();
  }

  drawMicroscopeVisual(ctx, cx, cy, radius, zoom) {
    const time = performance.now() * 0.001;

    if (zoom < 0.8) {
      // Scale 0: Plastic bottle cap (Macro)
      const scale = 1 - zoom * 0.4;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Blue serrated bottle cap
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI * 2);
      ctx.fill();

      // Ridges
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 65, Math.sin(a) * 65);
        ctx.lineTo(Math.cos(a) * 75, Math.sin(a) * 75);
        ctx.stroke();
      }

      ctx.fillStyle = '#0369a1';
      ctx.beginPath();
      ctx.arc(0, 0, 52, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '600 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('HDPE #2', 0, 5);

      ctx.restore();

    } else if (zoom < 1.8) {
      // Scale 1: Nurdle pellets (5mm raw industrial pre-production pellets)
      ctx.save();
      ctx.translate(cx, cy);
      
      const pellets = [
        { x: -30, y: -20, r: 38, col: '#f8fafc' },
        { x: 35, y: 15, r: 42, col: '#fef08a' },
        { x: -10, y: 35, r: 35, col: '#e2e8f0' },
        { x: 25, y: -35, r: 32, col: '#bae6fd' }
      ];

      for (const p of pellets) {
        const grad = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, 2, p.x, p.y, p.r);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.7, p.col);
        grad.addColorStop(1, '#64748b');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.stroke();
      }
      ctx.restore();

    } else if (zoom < 2.8) {
      // Scale 2: Fragment with sand grains (1mm)
      ctx.save();
      ctx.translate(cx, cy);

      // Natural sand grains (rounded, beige)
      const sandGrains = [
        { x: -60, y: -40, r: 18 }, { x: 50, y: -50, r: 22 },
        { x: -45, y: 55, r: 25 }, { x: 70, y: 30, r: 20 },
        { x: -20, y: -65, r: 15 }
      ];
      for (const s of sandGrains) {
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Microplastic fragment (jagged, synthetic neon-blue / red)
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-25, -15);
      ctx.lineTo(20, -35);
      ctx.lineTo(35, 10);
      ctx.lineTo(5, 30);
      ctx.lineTo(-30, 20);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

    } else if (zoom < 3.8) {
      // Scale 3: Microfibers vs Human Hair (50 µm)
      ctx.save();
      ctx.translate(cx, cy);

      // Human hair (thick brown cylinder)
      ctx.lineWidth = 42;
      ctx.strokeStyle = '#451a03';
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-radius * 0.8, -80);
      ctx.bezierCurveTo(-20, -60, 40, -100, radius * 0.8, -70);
      ctx.stroke();

      ctx.fillStyle = '#a16207';
      ctx.font = '600 11px sans-serif';
      ctx.fillText('Человеческий волос (~70 мкм)', -60, -110);

      // Microfibers (curled, synthetic polyester thread, glowing neon)
      ctx.lineWidth = 7;
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(-110, 80);
      ctx.bezierCurveTo(-50, -20, 20, 110, 100, 30);
      ctx.stroke();

      ctx.strokeStyle = '#ec4899';
      ctx.shadowColor = '#ec4899';
      ctx.beginPath();
      ctx.moveTo(-70, 110);
      ctx.bezierCurveTo(-10, 40, 60, 60, 80, 120);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Микроволокно полиэстера (~15 мкм)', -40, 15);

      ctx.restore();

    } else if (zoom < 4.8) {
      // Scale 4: Red Blood Cells (Erythrocytes 7µm) with plastic particle
      ctx.save();
      ctx.translate(cx, cy);

      // Flowing red blood cells
      const cells = [
        { x: -50, y: -45, r: 28 },
        { x: 60, y: -30, r: 30 },
        { x: -30, y: 40, r: 27 },
        { x: 55, y: 50, r: 29 },
        { x: -75, y: 10, r: 26 }
      ];

      for (const c of cells) {
        const bloodGrad = ctx.createRadialGradient(c.x, c.y, 4, c.x, c.y, c.r);
        bloodGrad.addColorStop(0, '#991b1b');
        bloodGrad.addColorStop(0.6, '#dc2626');
        bloodGrad.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = bloodGrad;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();

        // Doughnut indent of erythrocyte
        ctx.fillStyle = 'rgba(69, 10, 10, 0.4)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }

      // Foreign plastic particle in blood stream
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.moveTo(5, -15);
      ctx.lineTo(25, -8);
      ctx.lineTo(18, 12);
      ctx.lineTo(-6, 8);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#38bdf8';
      ctx.font = '600 11px sans-serif';
      ctx.fillText('Частица ПЭТ в крови', -10, -26);

      ctx.restore();

    } else {
      // Scale 5: Nanoplastics (100nm) penetrating lipid membrane bilayer
      ctx.save();
      ctx.translate(cx, cy);

      // Cell membrane bilayer (phospholipids)
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      const memY = 30;

      for (let x = -radius * 0.9; x < radius * 0.9; x += 14) {
        // Head
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x, memY - 12, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, memY + 12, 5, 0, Math.PI * 2);
        ctx.fill();

        // Tails
        ctx.strokeStyle = '#059669';
        ctx.beginPath();
        ctx.moveTo(x, memY - 7);
        ctx.lineTo(x, memY - 2);
        ctx.moveTo(x, memY + 7);
        ctx.lineTo(x, memY + 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#10b981';
      ctx.font = '600 11px sans-serif';
      ctx.fillText('Липидная мембрана клетки', -80, memY + 36);

      // Nanoplastic particles piercing through
      const nanos = [
        { x: -35, y: -45, r: 8, col: '#ec4899' },
        { x: 10, y: 0, r: 10, col: '#f43f5e' }, // Passing right through membrane!
        { x: 45, y: -60, r: 7, col: '#a855f7' },
        { x: -20, y: 70, r: 9, col: '#ec4899' }  // Inside cytoplasm!
      ];

      for (const n of nanos) {
        ctx.fillStyle = n.col;
        ctx.shadowColor = n.col;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ec4899';
      ctx.fillText('Наночастица проникает в цитоплазму', -5, -8);

      ctx.restore();
    }
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}
