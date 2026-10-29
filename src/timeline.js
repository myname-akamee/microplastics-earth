// timeline.js - Interactive Global Plastic Accumulation Timeline
// Data source: UNEP, Geyer et al. (Science Advances), OECD Global Plastics Outlook

export class TimelineSimulator {
  constructor(container) {
    this.container = container;
    this.canvas = container.querySelector('#timeline-chart');
    this.ctx = this.canvas.getContext('2d');
    this.slider = container.querySelector('#timeline-slider');
    this.yearDisplay = container.querySelector('#timeline-year');
    this.statsContainer = container.querySelector('#timeline-stats');
    this.scenarioSwitch = container.querySelector('#timeline-scenario');
    this.lang = 'ru';

    this.pointsData = {
      ru: [
        {
          year: 1950,
          productionMt: 2,
          oceanMt: 0.1,
          fishRatio: '1 : 100 000',
          title: 'Зарождение полимерной эры',
          desc: 'Изобретение бакелита и начало массового производства нейлона, ПЭТ и полиэтилена. Пластик рекламируется как чудо-материал будущего.'
        },
        {
          year: 1980,
          productionMt: 60,
          oceanMt: 8,
          fishRatio: '1 : 2 500',
          title: 'Эпоха одноразовой упаковки',
          desc: 'Повсеместное внедрение пластиковых пакетов в супермаркетах и ПЭТ-бутылок. Первые научные сообщения о синтетических гранулах в желудках буревестников.'
        },
        {
          year: 2000,
          productionMt: 234,
          oceanMt: 35,
          fishRatio: '1 : 500',
          title: 'Открытие мусорных водоворотов',
          desc: 'Капитан Чарльз Мур официально картирует Большое тихоокеанское мусорное пятно. Термин «микропластик» входит в научный обиход.'
        },
        {
          year: 2026,
          productionMt: 460,
          oceanMt: 140,
          fishRatio: '1 : 5',
          title: 'Наши дни: Глобальная пандемия полимеров',
          desc: 'Микропластик обнаружен в крови человека, грудном молоке, полярных льдах и облаках над горами. В океан попадает более 11 млн тонн пластика ежегодно.'
        },
        {
          year: 2040,
          productionMt: 720,
          oceanMt: 290,
          fishRatio: '1 : 2',
          title: 'Критическая точка биосферы',
          desc: 'При сохранении тренда производство пластика вырастет почти вдвое. Почвы сельскохозяйственных угодий теряют микробиологическую активность.'
        },
        {
          year: 2050,
          productionMt: 1100,
          oceanMt: 450,
          fishRatio: '1 : 1 (Пластика больше, чем рыбы!)',
          title: 'Сценарий «Business As Usual»',
          desc: 'По прогнозу Всемирного экономического форума, совокупный вес пластика в мировом океане превысит биомассу всех обитающих в нем рыб.'
        }
      ],
      en: [
        {
          year: 1950,
          productionMt: 2,
          oceanMt: 0.1,
          fishRatio: '1 : 100,000',
          title: 'Dawn of the Polymer Era',
          desc: 'Invention of Bakelite and start of commercial output of nylon, PET and polyethylene. Plastic hailed as the miracle material of tomorrow.'
        },
        {
          year: 1980,
          productionMt: 60,
          oceanMt: 8,
          fishRatio: '1 : 2,500',
          title: 'Era of Disposable Packaging',
          desc: 'Global adoption of single-use carrier bags and PET bottles. Earliest scientific documentation of synthetic pellets in seabird stomachs.'
        },
        {
          year: 2000,
          productionMt: 234,
          oceanMt: 35,
          fishRatio: '1 : 500',
          title: 'Discovery of Ocean Gyres',
          desc: 'Captain Charles Moore charts the Great Pacific Garbage Patch. The term "microplastic" enters widespread international science lexicon.'
        },
        {
          year: 2026,
          productionMt: 460,
          oceanMt: 140,
          fishRatio: '1 : 5',
          title: 'Today: Global Synthetic Pandemic',
          desc: 'Microplastics detected in donor blood, breast milk, polar glaciers and cloud vapor. Over 11M tonnes of plastic dump into oceans each year.'
        },
        {
          year: 2040,
          productionMt: 720,
          oceanMt: 290,
          fishRatio: '1 : 2',
          title: 'Planetary Biosphere Tipping Point',
          desc: 'Under business as usual, virgin plastic output nearly doubles. Farm soils lose microbial diversity due to toxic micro-residues.'
        },
        {
          year: 2050,
          productionMt: 1100,
          oceanMt: 450,
          fishRatio: '1 : 1 (More plastic than fish!)',
          title: 'Business-As-Usual Trajectory',
          desc: 'World Economic Forum projects that aggregate plastic weight in the ocean will surpass the total biomass of all living fish.'
        }
      ]
    };

    this.points = this.pointsData.ru;
    this.currentYear = 2026;
    this.scenario = 'standard'; // 'standard' or 'eco'

    this.init();
  }

  setLang(lang) {
    this.lang = lang;
    this.points = this.pointsData[lang] || this.pointsData.ru;
    this.updateYear(this.currentYear);
    this.drawChart();
  }

  init() {
    this.setupCanvas();
    this.bindEvents();
    this.updateYear(2026);
    this.drawChart();
  }

  setupCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = Math.min(rect.width * 0.55, 260);

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.dpr = dpr;
  }

  bindEvents() {
    this.slider.addEventListener('input', (e) => {
      const year = parseInt(e.target.value, 10);
      this.updateYear(year);
      this.drawChart();
    });

    if (this.scenarioSwitch) {
      this.scenarioSwitch.addEventListener('change', (e) => {
        this.scenario = e.target.checked ? 'eco' : 'standard';
        this.updateYear(this.currentYear);
        this.drawChart();
      });
    }

    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.drawChart();
    }, { passive: true });
  }

  interpolateData(year) {
    const pts = this.points;
    if (year <= pts[0].year) return pts[0];
    if (year >= pts[pts.length - 1].year) {
      const last = pts[pts.length - 1];
      if (this.scenario === 'eco' && year > 2026) {
        return {
          ...last,
          productionMt: 220,
          oceanMt: 160,
          fishRatio: this.lang === 'en' ? '1 : 12 (Stabilized)' : '1 : 12 (Стабилизация)',
          title: this.lang === 'en' ? 'Eco-Scenario: UN Global Plastics Treaty' : 'Эко-сценарий: Глобальный договор ООН',
          desc: this.lang === 'en'
            ? 'Strict caps on virgin polymer manufacturing enacted, 70% of packaging converted to marine-safe algae biopolymers, all wastewater plants retrofitted with microfiltration.'
            : 'Введен строгий запрет на одноразовый пластик, 70% упаковки заменено на водорослевый биополимер, очистные сооружения оснащены нанофильтрами.'
        };
      }
      return last;
    }

    // Find segment
    for (let i = 0; i < pts.length - 1; i++) {
      if (year >= pts[i].year && year <= pts[i + 1].year) {
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const t = (year - p1.year) / (p2.year - p1.year);

        let prod = p1.productionMt + (p2.productionMt - p1.productionMt) * t;
        let ocean = p1.oceanMt + (p2.oceanMt - p1.oceanMt) * t;

        if (this.scenario === 'eco' && year > 2026) {
          prod = prod * (1 - (year - 2026) / 24 * 0.7);
          ocean = ocean * (1 - (year - 2026) / 24 * 0.55);
        }

        return {
          year,
          productionMt: Math.round(prod),
          oceanMt: Math.round(ocean),
          fishRatio: t > 0.5 ? p2.fishRatio : p1.fishRatio,
          title: t > 0.5 ? p2.title : p1.title,
          desc: t > 0.5 ? p2.desc : p1.desc
        };
      }
    }
  }

  updateYear(year) {
    this.currentYear = year;
    this.yearDisplay.textContent = year;
    const data = this.interpolateData(year);
    const fishColor = data.fishRatio.includes('больше') || data.fishRatio.includes('More plastic')
      ? '#f87171'
      : '#34d399';

    const isEn = this.lang === 'en';
    const prodLabel = isEn ? 'Annual Production' : 'Производство в год';
    const oceanLabel = isEn ? 'Accumulated in Ocean' : 'Накоплено в океане';
    const fishLabel = isEn ? 'Plastic to Fish Ratio' : 'Масса пластика к рыбе';
    const mtUnit = isEn ? 'M tonnes' : 'млн т';

    this.statsContainer.innerHTML = `
      <div class="timeline-detail-card">
        <div class="tl-title">
          <span class="tl-year-tag">${data.year}:</span> ${data.title}
        </div>
        <p class="tl-desc">${data.desc}</p>
        
        <div class="tl-grid-3">
          <div class="tl-metric-card">
            <div class="tl-metric-label">${prodLabel}</div>
            <div class="tl-metric-val" style="color:#38bdf8;">${data.productionMt} ${mtUnit}</div>
          </div>
          <div class="tl-metric-card">
            <div class="tl-metric-label">${oceanLabel}</div>
            <div class="tl-metric-val" style="color:#fbbf24;">${data.oceanMt} ${mtUnit}</div>
          </div>
          <div class="tl-metric-card">
            <div class="tl-metric-label">${fishLabel}</div>
            <div class="tl-metric-val" style="color:${fishColor};">${data.fishRatio}</div>
          </div>
        </div>
      </div>
    `;
  }

  drawChart() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;
    const dpr = this.dpr;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 35;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = 1;
    for (let r = 0; r <= 4; r++) {
      const y = padTop + (chartH / 4) * r;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      const label = `${Math.round(1200 - (1200 / 4) * r)} млн`;
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(label, 4, y + 3);
    }

    // Function to map year and value to chart coords
    const getX = (y) => padLeft + ((y - 1950) / (2050 - 1950)) * chartW;
    const getY = (val) => padTop + chartH - (val / 1200) * chartH;

    // Draw curve
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10;

    for (let y = 1950; y <= 2050; y += 2) {
      const d = this.interpolateData(y);
      const px = getX(y);
      const py = getY(d.productionMt);
      if (y === 1950) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Fill under curve
    ctx.lineTo(getX(2050), padTop + chartH);
    ctx.lineTo(getX(1950), padTop + chartH);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
    fillGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
    fillGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Current year marker vertical line
    const curX = getX(this.currentYear);
    const curData = this.interpolateData(this.currentYear);
    const curY = getY(curData.productionMt);

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(curX, padTop);
    ctx.lineTo(curX, padTop + chartH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing dot at current value
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(curX, curY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // X-axis year ticks
    [1950, 1980, 2000, 2026, 2050].forEach(yr => {
      const tx = getX(yr);
      ctx.fillStyle = yr === 2026 ? '#38bdf8' : '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(yr.toString(), tx, h - 12);
    });

    ctx.restore();
  }
}
