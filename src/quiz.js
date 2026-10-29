// quiz.js - Interactive Microplastic Knowledge Challenge

export class PlasticQuiz {
  constructor(container) {
    this.container = container;
    this.lang = 'ru';

    this.questions = {
      ru: [
        {
          question: 'Сколько граммов микропластика среднестатистический человек проглатывает и вдыхает каждую неделю?',
          options: [
            'Около 0.01 грамма (размер крупицы соли)',
            'Около 5 граммов (вес стандартной банковской карты)',
            'Около 50 граммов (размер яблока)',
            'Менее 1 миллиграмма'
          ],
          correct: 1,
          explanation: 'Согласно масштабному исследованию WWF и Университета Ньюкасла (Австралия), человек потребляет около 5 граммов микропластика в неделю — преимущественно через бутилированную воду, пиво, морепродукты и воздух в помещениях.'
        },
        {
          question: 'Что является крупнейшим источником первичных синтетических микрочастиц в воздухе и водоемах?',
          options: [
            'Пластиковые соломинки для коктейлей',
            'Износ автомобильных шин и стирка синтетики',
            'Одноразовые вилки и ложки',
            'Зубные щетки'
          ],
          correct: 1,
          explanation: 'Истирание автомобильных шин (пыль из синтетического каучука) дает до 28% всего микропластика в океане, а каждая стирка одежды из полиэстера или нейлона выбрасывает до 700 000 микроволокон прямо в канализацию.'
        },
        {
          question: 'Где из перечисленных мест ученые НЕ обнаружили микропластик?',
          options: [
            'В снегу на вершине горы Эверест (8 848 м)',
            'В донорской крови человека и тканях легких',
            'На дне Марианской впадины (глубина 11 км)',
            'Нигде — он найден абсолютно во всех перечисленных местах!'
          ],
          correct: 3,
          explanation: 'Микропластик и нанопластик обнаружен во всех уголках биосферы: от снега на вершине Эвереста и полярного льда Арктики до самой глубокой точки океана (Марианской впадины) и кровотока человека.'
        },
        {
          question: 'Почему чайные пакетики-пирамидки опаснее обычных бумажных?',
          options: [
            'Они изготавливаются из пищевого пластика (PET/нейлон), выделяющего миллиарды частиц в кипяток',
            'Они красятся токсичными красителями',
            'В них больше кофеина',
            'Они не пропускают воду'
          ],
          correct: 0,
          explanation: 'Исследование Университета Макгилла (Канада) показало, что один синтетический чайный пакетик при заваривании при 95°C выделяет в чашку около 11.6 миллиардов микрочастиц и 3.1 миллиарда наночастиц пластика.'
        },
        {
          question: 'Какое биологическое явление ученые называют термином «Пластисфера»?',
          options: [
            'Коллекция пластиковых бутылок в музеях',
            'Новая экосистема микроорганизмов, вирусов и грибков, колонизирующих плавающий пластик',
            'Пластиковый купол над городами',
            'Слой пластика на мусорных полигонах'
          ],
          correct: 1,
          explanation: '«Пластисфера» — термин, введенный морскими микробиологами в 2013 году для описания уникальных сообществ микробов, патогенных бактерий (включая вибрионы Vibrio) и токсичных водорослей, процветающих на фрагментах плавающего пластика.'
        }
      ],
      en: [
        {
          question: 'How many grams of microplastics does the average person ingest and inhale every week?',
          options: [
            'About 0.01 grams (the size of a grain of salt)',
            'About 5 grams (the weight of a standard credit card)',
            'About 50 grams (the size of an apple)',
            'Less than 1 milligram'
          ],
          correct: 1,
          explanation: 'According to a landmark study by WWF and the University of Newcastle (Australia), a person consumes about 5 grams of microplastics per week — primarily through bottled water, beer, seafood and indoor air.'
        },
        {
          question: 'What is the largest source of primary synthetic microparticles in the air and waterways?',
          options: [
            'Plastic drinking straws',
            'Car tyre wear and washing synthetic clothing',
            'Disposable forks and spoons',
            'Toothbrushes'
          ],
          correct: 1,
          explanation: 'Car tyre abrasion (synthetic rubber dust) contributes up to 28% of all microplastics in the ocean, and every wash of polyester or nylon clothing releases up to 700,000 microfibres straight into the sewage system.'
        },
        {
          question: 'Where have scientists NOT found microplastics?',
          options: [
            'In the snow at the summit of Mount Everest (8,848 m)',
            'In donor blood and lung tissue',
            'At the bottom of the Mariana Trench (11 km deep)',
            'Nowhere — microplastics have been found in all of the above!'
          ],
          correct: 3,
          explanation: 'Microplastics and nanoplastics have been found everywhere in the biosphere: from the summit of Everest and Arctic polar ice to the deepest point of the ocean (the Mariana Trench) and the human bloodstream.'
        },
        {
          question: 'Why are pyramid-shaped tea bags more dangerous than ordinary paper ones?',
          options: [
            'They are made from food-grade plastic (PET/nylon) that releases billions of particles into boiling water',
            'They are dyed with toxic dyes',
            'They contain more caffeine',
            'They do not let water through'
          ],
          correct: 0,
          explanation: 'A study from McGill University (Canada) found that a single synthetic tea bag, when brewed at 95 °C, releases about 11.6 billion microparticles and 3.1 billion nanoplastic particles into the cup.'
        },
        {
          question: 'What biological phenomenon do scientists call the "Plastisphere"?',
          options: [
            'A collection of plastic bottles in museums',
            'A new ecosystem of microorganisms, viruses and fungi colonising floating plastic',
            'A plastic dome over cities',
            'A layer of plastic on landfill sites'
          ],
          correct: 1,
          explanation: '"Plastisphere" is a term coined by marine microbiologists in 2013 to describe unique communities of microbes, pathogenic bacteria (including Vibrio vibrios) and toxic algae thriving on floating plastic debris.'
        }
      ]
    };

    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;

    this.init();
  }

  setLang(lang) {
    this.lang = lang;
    this.currentIndex = 0;
    this.score = 0;
    this.answered = false;
    this.renderQuestion();
  }

  get currentQuestions() {
    return this.questions[this.lang] || this.questions.ru;
  }

  init() {
    this.renderQuestion();
  }

  renderQuestion() {
    const questions = this.currentQuestions;
    if (this.currentIndex >= questions.length) {
      this.renderResults();
      return;
    }

    const q = questions[this.currentIndex];
    this.answered = false;
    const isLast = this.currentIndex === questions.length - 1;
    const nextLabel = this.lang === 'en'
      ? (isLast ? 'See Results' : 'Next Question →')
      : (isLast ? 'Посмотреть результаты' : 'Следующий вопрос →');
    const questionLabel = this.lang === 'en'
      ? `Question ${this.currentIndex + 1} of ${questions.length}`
      : `Вопрос ${this.currentIndex + 1} из ${questions.length}`;
    const scoreLabel = this.lang === 'en'
      ? `Score: ${this.score} / ${questions.length}`
      : `Счет: ${this.score} / ${questions.length}`;

    this.container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress-row">
          <span class="quiz-progress-label">${questionLabel}</span>
          <span class="quiz-score-label">${scoreLabel}</span>
        </div>

        <h3 class="quiz-question">${q.question}</h3>

        <div class="quiz-options" id="quiz-options">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt-btn" data-index="${i}">
              <span class="opt-num">${String.fromCharCode(65 + i)}</span>
              <span class="opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div id="quiz-feedback" class="quiz-feedback"></div>

        <div class="quiz-next-row">
          <button id="quiz-next-btn" class="quiz-next-btn">${nextLabel}</button>
        </div>
      </div>
    `;

    const optButtons = this.container.querySelectorAll('.quiz-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.answered) return;
        const selected = parseInt(btn.dataset.index, 10);
        this.checkAnswer(selected, optButtons);
      });
    });

    const nextBtn = this.container.querySelector('#quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentIndex++;
        this.renderQuestion();
      });
    }
  }

  checkAnswer(selected, buttons) {
    this.answered = true;
    const q = this.currentQuestions[this.currentIndex];
    const isCorrect = selected === q.correct;
    if (isCorrect) this.score++;

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) {
        btn.classList.add('opt-correct');
      } else if (idx === selected) {
        btn.classList.add('opt-wrong');
      }
    });

    const feedback = this.container.querySelector('#quiz-feedback');
    const correctText = this.lang === 'en' ? 'Correct!' : 'Верно!';
    const wrongText = this.lang === 'en' ? 'Not quite right.' : 'Не совсем верно.';
    feedback.classList.add('show');
    feedback.classList.toggle('correct', isCorrect);
    feedback.classList.toggle('wrong', !isCorrect);
    feedback.innerHTML = `
      <div class="quiz-feedback-title">${isCorrect ? correctText : wrongText}</div>
      <div>${q.explanation}</div>
    `;

    const nextBtn = this.container.querySelector('#quiz-next-btn');
    if (nextBtn) nextBtn.classList.add('show');
  }

  renderResults() {
    const questions = this.currentQuestions;
    let title = '';
    let desc = '';
    const pct = Math.round((this.score / questions.length) * 100);

    if (this.lang === 'en') {
      if (this.score === 5) {
        title = 'Top-Level Eco-Expert!';
        desc = 'Outstanding knowledge! You have an excellent grasp of the scale and mechanisms of plastic pollution on our planet.';
      } else if (this.score >= 3) {
        title = 'Advanced Eco-Activist!';
        desc = 'Great level of understanding. You know the key facts and can influence the habits of those around you.';
      } else {
        title = 'The Start of Your Eco-Journey';
        desc = 'Now you know much more about the hidden threat of invisible polymer particles to our health and nature.';
      }
    } else {
      if (this.score === 5) {
        title = 'Эксперт-эколог высшей категории!';
        desc = 'Потрясающие знания! Вы великолепно разбираетесь в масштабах и механизмах пластикового загрязнения планеты.';
      } else if (this.score >= 3) {
        title = 'Продвинутый эко-активист!';
        desc = 'Отличный уровень понимания проблемы. Вы знаете ключевые факты и можете влиять на привычки окружающих.';
      } else {
        title = 'Начало пути к эко-осознанности';
        desc = 'Теперь вы знаете намного больше о скрытой угрозе невидимых полимерных частиц для нашего здоровья и природы.';
      }
    }

    const completedLabel = this.lang === 'en' ? 'Test Completed' : 'Тест завершен';
    const pctLabel = this.lang === 'en' ? `${pct}% correct answers` : `${pct}% правильных ответов`;
    const restartLabel = this.lang === 'en' ? 'Restart ↺' : 'Пройти заново ↺';

    this.container.innerHTML = `
      <div class="quiz-card quiz-results-card">
        <div class="quiz-trophy-wrap">
          <div class="quiz-trophy">🏆</div>
        </div>
        <div class="quiz-completed-label">${completedLabel}</div>
        <h3 class="quiz-results-title">${title}</h3>
        <p class="quiz-results-desc">${desc}</p>
        
        <div class="quiz-score-box">
          <div class="quiz-score-big">${this.score} / ${questions.length}</div>
          <div class="quiz-score-pct">${pctLabel}</div>
        </div>

        <button id="quiz-restart-btn" class="quiz-restart-btn">${restartLabel}</button>
      </div>
    `;

    this.container.querySelector('#quiz-restart-btn').addEventListener('click', () => {
      this.currentIndex = 0;
      this.score = 0;
      this.renderQuestion();
    });
  }
}
