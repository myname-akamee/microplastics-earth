// calculator.js - Interactive Personal Microplastic Footprint & Intake Calculator
// Based on studies: WWF/Newcastle University (2019), Cox et al. (2019), Vethaak et al. (2022)

export class PlasticCalculator {
  constructor(container) {
    this.container = container;
    this.lang = 'ru';
    this.inputs = {
      water: container.querySelector('#calc-water'),
      wash: container.querySelector('#calc-wash'),
      cups: container.querySelector('#calc-cups'),
      car: container.querySelector('#calc-car'),
      seafood: container.querySelector('#calc-seafood')
    };

    this.outputs = {
      intakeGrams: container.querySelector('#calc-intake-grams'),
      intakeParticles: container.querySelector('#calc-intake-particles'),
      emissionKg: container.querySelector('#calc-emission-kg'),
      cardEquiv: container.querySelector('#calc-card-equiv'),
      levelBadge: container.querySelector('#calc-level-badge'),
      tipsList: container.querySelector('#calc-tips-list')
    };

    this.init();
  }

  init() {
    // Bind input listeners
    Object.entries(this.inputs).forEach(([key, input]) => {
      if (!input) return;
      const display = this.container.querySelector(`#calc-val-${key}`);
      input.addEventListener('input', () => {
        if (display) {
          display.textContent = input.value;
        }
        this.calculate();
      });
    });

    this.calculate();
  }

  calculate() {
    // Inputs:
    // water: bottles per week (0..28)
    const bottlesWeek = parseFloat(this.inputs.water?.value || 0);
    // wash: loads per week (0..14)
    const washWeek = parseFloat(this.inputs.wash?.value || 0);
    // cups: hot take-away cups per week (0..21)
    const cupsWeek = parseFloat(this.inputs.cups?.value || 0);
    // car: km driven per week (0..1000)
    const carKmWeek = parseFloat(this.inputs.car?.value || 0);
    // seafood: meals per week (0..14)
    const seafoodWeek = parseFloat(this.inputs.seafood?.value || 0);

    // Intake calculation (annual particles):
    // Baseline ambient air & tap food intake: ~50,000 particles/year
    let annualParticles = 50000;
    // Bottled water: ~325 particles/liter * 0.5L/bottle * 52 weeks = ~8,450 per bottle/week/yr
    annualParticles += bottlesWeek * 8450;
    // Hot takeout cups: ~25,000 particles per hot cup * 52 weeks = ~1,300,000 per cup/week/yr
    annualParticles += cupsWeek * 65000; // conservative 65k swallowed per cup/week/yr
    // Seafood: ~750 particles per meal * 52 weeks = 39,000
    annualParticles += seafoodWeek * 39000;

    // Weight estimate: average 5 grams per week base = 260g/yr for average person
    // Credit card = ~5 grams
    let intakeGramsYear = (annualParticles / 100000) * 110;
    intakeGramsYear = Math.max(30, Math.min(850, Math.round(intakeGramsYear)));

    const creditCards = (intakeGramsYear / 5).toFixed(1);

    // Environmental emission into nature:
    // Washing: ~500,000 microfibers per load * 52 weeks -> ~0.08 kg per wash/week/yr
    const washEmissionKg = washWeek * 0.12;
    // Car tire wear: ~0.025 kg microplastic per 100 km * 52 weeks
    const carEmissionKg = (carKmWeek * 52 * 0.00025);
    // Total emission kg
    const totalEmissionKg = (washEmissionKg + carEmissionKg + (bottlesWeek * 52 * 0.02)).toFixed(1);

    // Update DOM
    const isEn = this.lang === 'en';
    if (this.outputs.intakeGrams) {
      this.outputs.intakeGrams.textContent = `${intakeGramsYear} ${isEn ? 'g' : 'г'}`;
    }
    if (this.outputs.intakeParticles) {
      this.outputs.intakeParticles.textContent = `${(annualParticles / 1000).toFixed(0)} ${isEn ? 'k' : 'тыс.'}`;
    }
    if (this.outputs.emissionKg) {
      this.outputs.emissionKg.textContent = `${totalEmissionKg} ${isEn ? 'kg' : 'кг'}`;
    }
    if (this.outputs.cardEquiv) {
      this.outputs.cardEquiv.textContent = `${creditCards} ${isEn ? 'cards' : 'шт.'}`;
    }

    // Badge assessment
    if (this.outputs.levelBadge) {
      if (intakeGramsYear < 120) {
        this.outputs.levelBadge.textContent = isEn ? 'Low Footprint (Eco-Conscious)' : 'Низкий след (Эко-осознанный)';
        this.outputs.levelBadge.className = 'level-badge level-low';
      } else if (intakeGramsYear < 260) {
        this.outputs.levelBadge.textContent = isEn ? 'Moderate Footprint (Global Average)' : 'Средний след (Среднестатистический)';
        this.outputs.levelBadge.className = 'level-badge level-medium';
      } else {
        this.outputs.levelBadge.textContent = isEn ? 'High Footprint (Critical Level)' : 'Высокий след (Критический уровень)';
        this.outputs.levelBadge.className = 'level-badge level-high';
      }
    }

    // Dynamic tips
    this.renderTips({ bottlesWeek, washWeek, cupsWeek, carKmWeek, seafoodWeek });
  }

  setLang(lang) {
    this.lang = lang;
    this.calculate();
  }

  renderTips(data) {
    if (!this.outputs.tipsList) return;
    const isEn = this.lang === 'en';

    const tips = [];
    if (data.bottlesWeek > 2) {
      tips.push({
        icon: '🚰',
        title: isEn ? 'Switch away from single-use bottled water' : 'Замените воду в одноразовых бутылках',
        desc: isEn ? 'Use a stainless steel or glass reusable flask with an RO or micro-filtration filter — cuts particle ingestion by 90%.' : 'Используйте стеклянную или стальную многоразовую бутылку с фильтром обратного осмоса — это снизит попадание частиц на 90%.'
      });
    }
    if (data.cupsWeek > 1) {
      tips.push({
        icon: '☕',
        title: isEn ? 'Ditch disposable paper coffee cups' : 'Откажитесь от бумажных стаканчиков для кофе',
        desc: isEn ? 'Their inner polyethylene coating degrades within 15 mins of hot liquid contact. Opt for a travel mug.' : 'Внутри них находится слой полиэтилена, который разрушается кипятком за 15 минут. Берите термокружку из стали.'
      });
    }
    if (data.washWeek > 2) {
      tips.push({
        icon: '👕',
        title: isEn ? 'Use a Guppyfriend bag or washing machine filter' : 'Установите мешок Guppyfriend или фильтр на стиральную машину',
        desc: isEn ? 'Washing at 30°C on short cycles with liquid detergent reduces synthetic microfiber shedding by up to 3×.' : 'Стирка при 30°C на коротких циклах и использование жидкого геля снижают истирание синтетических нитей в 3 раза.'
      });
    }
    if (data.carKmWeek > 100) {
      tips.push({
        icon: '🚗',
        title: isEn ? 'Maintain proper tire inflation' : 'Контролируйте давление в шинах',
        desc: isEn ? 'Under-inflated tires wear 30% faster, dispersing toxic rubber microparticles and 6PPD-quinone into roadside air.' : 'Недокачанные шины изнашиваются на 30% быстрее, выбрасывая в воздух токсичные наночастицы каучука 6PPD-quinone.'
      });
    }

    if (tips.length === 0) {
      tips.push({
        icon: '🌟',
        title: isEn ? 'Excellent Score!' : 'Отличный результат!',
        desc: isEn ? 'You lead an eco-conscious lifestyle. Share tips with friends on reducing single-use packaging and synthetic fabrics.' : 'Вы ведете экологичный образ жизни. Расскажите близким о вреде пластиковых упаковок и синтетики.'
      });
    }

    this.outputs.tipsList.innerHTML = tips.map(t => `
      <div class="tip-card">
        <span class="tip-icon">${t.icon}</span>
        <div>
          <h4 class="tip-title">${t.title}</h4>
          <p class="tip-desc">${t.desc}</p>
        </div>
      </div>
    `).join('');
  }
}
