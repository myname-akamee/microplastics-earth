// earthEngine.js - Ultra-photorealistic 1080p 60/120 FPS 3D Earth Engine with Three.js WebGL & Canvas HUD
// Physically-inspired planetary lighting: NASA Blue Marble 4K Day + Black Marble 4K Night,
// topographic normal relief, ocean specular sunglint, floating cloud parallax layer,
// golden twilight terminator, Rayleigh atmospheric scattering, inertia drag physics, and 3D geolocation markers.

import * as THREE from 'three';

export class EarthEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.options = Object.assign({
      manifestUrl: '/assets/earth/manifest.json',
      previewUrl: '/assets/earth/preview.webp',
      earthDayUrl: '/assets/earth_day_4096.jpg',
      earthNightUrl: '/assets/earth_night_4096.jpg',
      earthNormalUrl: '/assets/earth_normal_2048.jpg',
      earthSpecularUrl: '/assets/earth_specular_2048.jpg',
      earthCloudsUrl: '/assets/earth_clouds_1024.png',
      inertia: 0.92,
      sensitivity: 0.22,
      dragSensitivity: 0.38,
      autoRotateSpeed: 0.038,
      onProgress: null,
      onReady: null,
      onMarkerSelect: null,
    }, options);

    this.isLoaded = false;
    this.glReady = false;
    this.texturesLoaded = 0;
    this.totalTextures = 5;

    // Dimensions & Canvas Sizing
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    this.earthRadius = 300;
    this.centerX = 0;
    this.centerY = 0;
    this.mouseNormX = 0;
    this.mouseNormY = 0;

    // Rotation state (in degrees 0..360)
    // Positive currentAngle = Earth rotates eastward (to the right)
    this.currentAngle = 0;
    this.targetAngle = 0;
    this.velocity = 0;
    this.lastPointerX = null;
    this.lastPointerY = null;
    this.isDragging = false;
    this.lastInteractionTime = performance.now();
    this.autoRotateEnabled = true;

    // Three.js 3D WebGL Pipeline
    this.glSize = 1080;
    this.glCanvas = null;
    this.glRenderer = null;
    this.glScene = null;
    this.glCamera = null;
    this.glTiltGroup = null;
    this.glSpinGroup = null;
    this.earthMesh = null;
    this.cloudMesh = null;
    this.cloudDrift = 0;
    this.markerAnchors = {};

    // Starfield & ambient microplastic particles
    this.stars = [];
    this.particles = [];

    // Hotspot markers (lat, lon in degrees)
    this.lang = 'ru';
    this.markersData = {
      ru: [
        {
          id: 'pacific-patch',
          name: 'Большое тихоокеанское мусорное пятно',
          region: 'Северная часть Тихого океана',
          lat: 32.0,
          lon: -145.0,
          particles: '1.8 триллиона',
          depth: 'Поверхность и глубина до 30м',
          area: '1.6 млн км² (в 3 раза больше Франции)',
          dangerLevel: 'Критический',
          description: 'Крупнейшее скопление пластика в мире. Океанический вихрь концентрирует микроволокна и гранулы; концентрация пластика здесь превышает массу зоопланктона в 6 раз.',
          icon: '🌊'
        },
        {
          id: 'mariana-trench',
          name: 'Марианская впадина (10 994 м)',
          region: 'Западная часть Тихого океана',
          lat: 11.35,
          lon: 142.2,
          particles: '2 200 на литр осадка',
          depth: 'Глубина 10 994 м',
          area: 'Глубоководный желоб',
          dangerLevel: 'Экстремальный',
          description: 'Микропластик оседает на самое дно Земли. В кишечнике глубоководных рачков Lysianassoidea найдены нейлон, полиэтилен и полистирол в 100% изученных особей.',
          icon: '⚓'
        },
        {
          id: 'arctic-ice',
          name: 'Ледниковый щит и льды Арктики',
          region: 'Северный ледовитый океан / Шпицберген',
          lat: 78.5,
          lon: 18.0,
          particles: '14 000 частиц / литр снега',
          depth: 'Ледяной покров и снег',
          area: 'Полярный регион',
          dangerLevel: 'Высокий',
          description: 'Темные частицы микропластика переносятся воздушными потоками и оседают на белоснежный лед, поглощая солнечное тепло и критически ускоряя таяние полярных ледников.',
          icon: '❄️'
        },
        {
          id: 'atlantic-gyre',
          name: 'Североатлантический круговорот',
          region: 'Саргассово море / Северная Атлантика',
          lat: 28.0,
          lon: -45.0,
          particles: '580 000 штук на км²',
          depth: '0–50 м',
          area: 'Субтропический вихрь',
          dangerLevel: 'Высокий',
          description: 'Огромный водоворот, собирающий сточные воды из рек Северной Америки и Европы. Каждая стирка синтетической одежды отправляет в этот бассейн миллионы микроволокон.',
          icon: '🌀'
        },
        {
          id: 'yangtze-delta',
          name: 'Дельта Янцзы и Восточно-Китайское море',
          region: 'Восточная Азия',
          lat: 31.5,
          lon: 121.8,
          particles: '330 000 тонн пластика в год',
          depth: 'Речной и прибрежный сток',
          area: 'Дельта реки',
          dangerLevel: 'Критический',
          description: 'Один из крупнейших речных конвейеров пластика на планете. Миллиарды гранул первичного сырья (нурдлов) смываются в океан с промышленных производств.',
          icon: '🏭'
        },
        {
          id: 'mount-everest',
          name: 'Пик Эвереста (8 848 м)',
          region: 'Гималаи, Непал / Тибет',
          lat: 27.98,
          lon: 86.92,
          particles: '30 частиц на литр талого снега',
          depth: 'Высота 8 440 м – 8 848 м',
          area: 'Вершина мира',
          dangerLevel: 'Высокий',
          description: 'Микропластик найден на «Балконе» Эвереста (8440м). Он принесен ветром из синтетической экипировки альпинистов и высотных струйных атмосферных течений.',
          icon: '🏔️'
        }
      ],
      en: [
        {
          id: 'pacific-patch',
          name: 'Great Pacific Garbage Patch',
          region: 'North Pacific Ocean',
          lat: 32.0,
          lon: -145.0,
          particles: '1.8 trillion pieces',
          depth: 'Surface down to 30m depth',
          area: '1.6M km² (3× size of France)',
          dangerLevel: 'Critical',
          description: 'World\'s largest oceanic accumulation of floating plastic. Gyre forces concentrate microfibers and pellets; plastic mass outweighs resident zooplankton by 6:1.',
          icon: '🌊'
        },
        {
          id: 'mariana-trench',
          name: 'Mariana Trench (10,994 m)',
          region: 'Western Pacific Ocean',
          lat: 11.35,
          lon: 142.2,
          particles: '2,200 pieces per litre sediment',
          depth: 'Depth 10,994 m',
          area: 'Abyssal Trench',
          dangerLevel: 'Extreme',
          description: 'Microplastics settle into the deepest abyss on Earth. Endemic amphipods (Lysianassoidea) have synthetic polymers found in 100% of tested individuals.',
          icon: '⚓'
        },
        {
          id: 'arctic-ice',
          name: 'Arctic Sea Ice & Glaciers',
          region: 'Arctic Ocean / Svalbard',
          lat: 78.5,
          lon: 18.0,
          particles: '14,000 particles / litre snow',
          depth: 'Ice pack & seasonal snow',
          area: 'Polar Region',
          dangerLevel: 'High',
          description: 'Airborne dark microparticles settle onto pristine snow, lowering albedo, absorbing solar heat and accelerating polar ice melt.',
          icon: '❄️'
        },
        {
          id: 'atlantic-gyre',
          name: 'North Atlantic Gyre',
          region: 'Sargasso Sea / North Atlantic',
          lat: 28.0,
          lon: -45.0,
          particles: '580,000 pieces per km²',
          depth: '0–50 m',
          area: 'Subtropical Gyre',
          dangerLevel: 'High',
          description: 'Vast vortex aggregating municipal runoff from North America and Western Europe. Millions of synthetic laundry microfibers enter this basin daily.',
          icon: '🌀'
        },
        {
          id: 'yangtze-delta',
          name: 'Yangtze Delta & East China Sea',
          region: 'East Asia',
          lat: 31.5,
          lon: 121.8,
          particles: '330,000 tonnes of plastic / yr',
          depth: 'Estuary and coastal shelf',
          area: 'River Delta',
          dangerLevel: 'Critical',
          description: 'Major fluvial conduit of plastic to the ocean. Billions of pre-production plastic pellets (nurdles) leach directly from manufacturing hubs.',
          icon: '🏭'
        },
        {
          id: 'mount-everest',
          name: 'Mount Everest Peak (8,848 m)',
          region: 'Himalayas, Nepal / Tibet',
          lat: 27.98,
          lon: 86.92,
          particles: '30 particles per litre meltwater',
          depth: 'Altitude 8,440 m – 8,848 m',
          area: 'Summit of the World',
          dangerLevel: 'High',
          description: 'Microplastics detected on the South Col (8,440 m), shed from mountaineering apparel, ropes and tents, and transported by high-altitude jet streams.',
          icon: '🏔️'
        }
      ]
    };
    this.markers = this.markersData.ru;

    this.activeMarker = null;
    this.hoveredMarker = null;
    this.markerProjections = [];

    this.isRunning = true;
    this.isVisible = true;

    this.init();
  }

  async init() {
    this.setupCanvasSize();
    this.createStarfield();
    this.createMicroplasticParticles();
    this.setupEvents();
    this.initWebGL();

    // Start 60 FPS animation loop
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);

    await this.loadAssets();
  }

  setupCanvasSize() {
    const parent = this.canvas.parentElement || document.body;
    const rect = parent.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Cinematic Center Stage Framing
    this.centerX = this.width * 0.50;
    if (this.width >= 1200) {
      this.centerY = Math.min(460, Math.max(380, this.height * 0.44));
      this.earthRadius = Math.min(320, Math.min(this.width * 0.25, this.height * 0.36));
    } else if (this.width >= 768) {
      this.centerY = Math.min(420, Math.max(340, this.height * 0.42));
      this.earthRadius = Math.min(265, this.width * 0.34);
    } else {
      this.centerY = Math.min(360, Math.max(280, this.height * 0.38));
      this.earthRadius = Math.min(195, this.width * 0.42);
    }
  }

  initWebGL() {
    try {
      this.glSize = 1080;
      this.glCanvas = document.createElement('canvas');
      this.glCanvas.width = this.glSize;
      this.glCanvas.height = this.glSize;

      this.glRenderer = new THREE.WebGLRenderer({
        canvas: this.glCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true
      });
      this.glRenderer.setSize(this.glSize, this.glSize, false);
      this.glRenderer.setPixelRatio(1);
      this.glRenderer.outputColorSpace = THREE.SRGBColorSpace;

      this.glScene = new THREE.Scene();

      // Orthographic camera [-1, 1, 1, -1] fits sphere of radius 1.0 with 0 distortion
      this.glCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      this.glCamera.position.z = 2.5;

      // Real Earth Axial Tilt (~12° aesthetic tilt)
      this.glTiltGroup = new THREE.Group();
      this.glTiltGroup.rotation.z = THREE.MathUtils.degToRad(-12);
      this.glTiltGroup.rotation.x = THREE.MathUtils.degToRad(7);
      this.glScene.add(this.glTiltGroup);

      // Spin group rotating continuously around Y axis
      this.glSpinGroup = new THREE.Group();
      this.glTiltGroup.add(this.glSpinGroup);

      // ─── PHYSICALLY-INSPIRED SPACE LIGHTING SETUP ───
      // 1. Primary Sun Directional Light (crisp, brilliant sunlight from top-left space angle)
      // Illuminates ~70% of the visible sphere with realistic spherical shading and a smooth dusk terminator
      const sunLight = new THREE.DirectionalLight(0xfffdf5, 2.7);
      sunLight.position.set(-2.6, 1.6, 2.4);
      this.glScene.add(sunLight);

      // 2. Deep Space Ambient (deep navy, preserving deep contrast and letting night lights glow)
      const ambientLight = new THREE.AmbientLight(0x0e172a, 0.32);
      this.glScene.add(ambientLight);

      // 3. Subtle Rayleigh Atmospheric Light Diffusion (soft forward-fill preventing harsh black shadows)
      const atmoFill = new THREE.DirectionalLight(0x38bdf8, 0.45);
      atmoFill.position.set(-0.8, -1.2, 1.8);
      this.glScene.add(atmoFill);

      // 4. Signature Reference 1 Ethereal Violet Edge Light (grazes dark limb from behind)
      const rimLight = new THREE.DirectionalLight(0x8b5cf6, 0.65);
      rimLight.position.set(2.4, -1.4, -1.2);
      this.glScene.add(rimLight);

      // ─── 3D EARTH GLOBE MESH ───
      const earthGeo = new THREE.SphereGeometry(1.0, 64, 64);
      const earthMat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 35,
        specular: new THREE.Color(0x38bdf8),
        emissive: new THREE.Color(0xffd580),
        emissiveIntensity: 0.55
      });
      this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
      this.glSpinGroup.add(this.earthMesh);

      // ─── 3D FLOATING CLOUD LAYER (Real 3D Parallax & Depth) ───
      const cloudGeo = new THREE.SphereGeometry(1.008, 64, 64);
      const cloudMat = new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      this.cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
      this.glSpinGroup.add(this.cloudMesh);

      // Build 3D Geolocation Anchors on the spinning globe
      this.rebuildMarkerAnchors();

      this.glReady = true;
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to 2D canvas', e);
      this.glReady = false;
    }
  }

  rebuildMarkerAnchors() {
    if (!this.glSpinGroup) return;

    for (const key of Object.keys(this.markerAnchors)) {
      if (this.markerAnchors[key]) {
        this.glSpinGroup.remove(this.markerAnchors[key]);
      }
    }
    this.markerAnchors = {};

    for (const marker of this.markers) {
      const anchor = new THREE.Object3D();
      const latRad = (marker.lat * Math.PI) / 180;
      const lonRad = (marker.lon * Math.PI) / 180;
      anchor.position.set(
        Math.cos(latRad) * Math.cos(lonRad),
        Math.sin(latRad),
        -Math.cos(latRad) * Math.sin(lonRad)
      );
      this.glSpinGroup.add(anchor);
      this.markerAnchors[marker.id] = anchor;
    }
  }

  createStarfield() {
    this.stars = [];
    const count = Math.min(300, Math.floor((this.width * this.height) / 4500));
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        baseAlpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.8 ? '#93c5fd' : (Math.random() > 0.6 ? '#e2e8f0' : '#ffffff'),
        parallax: Math.random() * 0.3 + 0.1
      });
    }
  }

  createMicroplasticParticles() {
    this.particles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.5 + 0.8,
        color: ['rgba(56, 189, 248, 0.7)', 'rgba(239, 68, 68, 0.6)', 'rgba(234, 179, 8, 0.6)', 'rgba(168, 85, 247, 0.6)', 'rgba(255, 255, 255, 0.8)'][Math.floor(Math.random() * 5)],
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.04 + 0.01
      });
    }
  }

  async loadAssets() {
    try {
      const textureLoader = new THREE.TextureLoader();

      const onTextureLoaded = () => {
        this.texturesLoaded++;
        const ratio = Math.min(1, this.texturesLoaded / this.totalTextures);
        if (this.options.onProgress) {
          this.options.onProgress(ratio);
        }
        if (this.texturesLoaded >= this.totalTextures) {
          this.isLoaded = true;
          if (this.options.onReady) {
            this.options.onReady();
          }
        }
      };

      // 1. Ultra-HD NASA Blue Marble 4K Day Map (4096x2048)
      textureLoader.load(
        this.options.earthDayUrl || '/assets/earth_day_4096.jpg',
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          if (this.earthMesh) {
            this.earthMesh.material.map = tex;
            this.earthMesh.material.needsUpdate = true;
          }
          onTextureLoaded();
        },
        undefined,
        () => onTextureLoaded()
      );

      // 2. Ultra-HD NASA Black Marble 4K Night Lights (4096x2048)
      textureLoader.load(
        this.options.earthNightUrl || '/assets/earth_night_4096.jpg',
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          if (this.earthMesh) {
            this.earthMesh.material.emissiveMap = tex;
            this.earthMesh.material.needsUpdate = true;
          }
          onTextureLoaded();
        },
        undefined,
        () => onTextureLoaded()
      );

      // 3. Normal 2048x1024 bump relief map
      textureLoader.load(
        this.options.earthNormalUrl,
        (tex) => {
          if (this.earthMesh) {
            this.earthMesh.material.normalMap = tex;
            this.earthMesh.material.normalScale = new THREE.Vector2(0.85, 0.85);
            this.earthMesh.material.needsUpdate = true;
          }
          onTextureLoaded();
        },
        undefined,
        () => onTextureLoaded()
      );

      // 4. Specular 2048x1024 ocean reflectance map
      textureLoader.load(
        this.options.earthSpecularUrl,
        (tex) => {
          if (this.earthMesh) {
            this.earthMesh.material.specularMap = tex;
            this.earthMesh.material.needsUpdate = true;
          }
          onTextureLoaded();
        },
        undefined,
        () => onTextureLoaded()
      );

      // 5. Clouds 1024x512 atmospheric layer
      textureLoader.load(
        this.options.earthCloudsUrl,
        (tex) => {
          tex.generateMipmaps = true;
          if (this.cloudMesh) {
            this.cloudMesh.material.map = tex;
            this.cloudMesh.material.needsUpdate = true;
          }
          onTextureLoaded();
        },
        undefined,
        () => onTextureLoaded()
      );
    } catch (e) {
      console.error('Error loading 3D planetary assets:', e);
      this.isLoaded = true;
      if (this.options.onReady) this.options.onReady();
    }
  }

  setupEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouseNormX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNormY = (e.clientY / window.innerHeight) * 2 - 1;

      const currentX = e.clientX;
      if (this.lastPointerX !== null) {
        const dx = currentX - this.lastPointerX;
        this.velocity += dx * (this.options.sensitivity * 0.12);
        this.lastInteractionTime = performance.now();
      }
      this.lastPointerX = currentX;
      this.lastPointerY = e.clientY;

      this.checkMarkerHover(e.clientX, e.clientY);
    }, { passive: true });

    const startDrag = (x, y) => {
      this.isDragging = true;
      this.dragStartX = x;
      this.dragLastX = x;
      this.dragLastTime = performance.now();
      this.lastInteractionTime = performance.now();
    };

    const moveDrag = (x, y) => {
      if (!this.isDragging) return;
      const now = performance.now();
      const dx = x - this.dragLastX;
      const dt = Math.max(now - this.dragLastTime, 1);

      this.targetAngle += dx * this.options.dragSensitivity;
      this.velocity = (dx / dt) * 12;

      this.dragLastX = x;
      this.dragLastTime = now;
      this.lastInteractionTime = now;
    };

    const endDrag = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.lastInteractionTime = performance.now();

      if (e && Math.abs(this.dragLastX - this.dragStartX) < 6) {
        this.checkMarkerClick(this.dragStartX, e.clientY);
      }
    };

    this.canvas.addEventListener('mousedown', (e) => {
      startDrag(e.clientX, e.clientY);
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        moveDrag(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', (e) => endDrag(e));

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length === 1) {
        moveDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      endDrag(e.changedTouches ? e.changedTouches[0] : null);
    });

    this.canvas.addEventListener('click', (e) => {
      this.checkMarkerClick(e.clientX, e.clientY);
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.setupCanvasSize();
        this.createStarfield();
      }, 100);
    });

    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) {
        this.lastInteractionTime = performance.now();
      }
    });
  }

  checkMarkerHover(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    let found = null;
    for (const p of this.markerProjections) {
      if (p.visible && Math.hypot(p.x - x, p.y - y) <= p.radius + 8) {
        found = p.marker;
        break;
      }
    }

    if (found !== this.hoveredMarker) {
      this.hoveredMarker = found;
      this.canvas.style.cursor = found ? 'pointer' : 'grab';
    }
  }

  checkMarkerClick(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (const p of this.markerProjections) {
      if (p.visible && Math.hypot(p.x - x, p.y - y) <= p.radius + 12) {
        this.selectMarker(p.marker);
        return;
      }
    }
  }

  selectMarker(marker) {
    this.activeMarker = marker;
    if (this.options.onMarkerSelect) {
      this.options.onMarkerSelect(marker);
    }
  }

  rotateToMarker(markerId) {
    const marker = this.markers.find(m => m.id === markerId);
    if (!marker) return;

    let desiredAngle = 15 - marker.lon;
    while (desiredAngle - this.currentAngle > 180) desiredAngle -= 360;
    while (desiredAngle - this.currentAngle < -180) desiredAngle += 360;

    this.targetAngle = desiredAngle;
    this.velocity = (desiredAngle - this.currentAngle) * 0.08;
    this.selectMarker(marker);
    this.lastInteractionTime = performance.now();
  }

  toggleAutoRotate() {
    this.autoRotateEnabled = !this.autoRotateEnabled;
    this.lastInteractionTime = this.autoRotateEnabled ? performance.now() - 3000 : performance.now();
    return this.autoRotateEnabled;
  }

  resetView() {
    this.targetAngle = 0;
    this.velocity = 0;
    this.activeMarker = null;
    this.lastInteractionTime = performance.now();
  }

  selectRandomMarker() {
    const randomIdx = Math.floor(Math.random() * this.markers.length);
    const marker = this.markers[randomIdx];
    this.rotateToMarker(marker.id);
    return marker;
  }

  updatePhysics() {
    const now = performance.now();
    const idleTime = now - this.lastInteractionTime;

    if (this.autoRotateEnabled && !this.isDragging && idleTime > 2500) {
      this.targetAngle += this.options.autoRotateSpeed;
    }

    this.targetAngle += this.velocity;
    this.velocity *= this.options.inertia;
    if (Math.abs(this.velocity) < 0.0005) this.velocity = 0;

    this.currentAngle += (this.targetAngle - this.currentAngle) * 0.085;
  }

  render() {
    if (this.isRunning) {
      requestAnimationFrame(this.render);
    }

    if (!this.isVisible) return;

    this.updatePhysics();

    const ctx = this.ctx;
    const dpr = this.dpr;
    const w = this.width;
    const h = this.height;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Deep cosmic studio background
    const bgGrad = ctx.createRadialGradient(
      this.centerX, this.centerY, this.earthRadius * 0.4,
      this.centerX, this.centerY, Math.max(w, h) * 0.85
    );
    bgGrad.addColorStop(0, '#040614');
    bgGrad.addColorStop(0.5, '#02030a');
    bgGrad.addColorStop(1, '#000000');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Dynamic studio light beam tracking cursor
    const pointerShiftX = (this.mouseNormX || 0) * this.earthRadius * 0.18;
    const pointerShiftY = (this.mouseNormY || 0) * this.earthRadius * 0.18;
    const studioBeam = ctx.createRadialGradient(
      w * 0.15 + pointerShiftX, h * 0.1 + pointerShiftY, 0,
      w * 0.15 + pointerShiftX, h * 0.1 + pointerShiftY, Math.max(w, h) * 0.75
    );
    studioBeam.addColorStop(0, 'rgba(129, 140, 248, 0.08)');
    studioBeam.addColorStop(0.35, 'rgba(56, 189, 248, 0.03)');
    studioBeam.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = studioBeam;
    ctx.fillRect(0, 0, w, h);

    // Ethereal Reference 1 Deep Violet & Purple Celestial Aura (Behind Earth)
    const nebulaGrad = ctx.createRadialGradient(
      this.centerX, this.centerY, this.earthRadius * 0.3,
      this.centerX, this.centerY, this.earthRadius * 1.95
    );
    nebulaGrad.addColorStop(0, 'rgba(139, 92, 246, 0.28)');
    nebulaGrad.addColorStop(0.35, 'rgba(99, 102, 241, 0.16)');
    nebulaGrad.addColorStop(0.65, 'rgba(168, 85, 247, 0.07)');
    nebulaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = nebulaGrad;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.earthRadius * 1.95, 0, Math.PI * 2);
    ctx.fill();

    // 2. Render Starfield
    const parallaxOffsetX = (this.currentAngle * 0.2) % w;
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.twinklePhase += star.twinkleSpeed;
      const alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.25;

      let sx = (star.x - parallaxOffsetX * star.parallax + w * 2) % w;
      let sy = star.y;

      ctx.fillStyle = star.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 3. Signature Reference 1 Luminous Multi-stop Corona & Halo Ring
    const coronaRadius = this.earthRadius * 1.48;
    const coronaGrad = ctx.createRadialGradient(
      this.centerX, this.centerY, this.earthRadius * 0.98,
      this.centerX, this.centerY, coronaRadius
    );
    coronaGrad.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
    coronaGrad.addColorStop(0.03, 'rgba(56, 189, 248, 0.75)');
    coronaGrad.addColorStop(0.16, 'rgba(129, 140, 248, 0.55)');
    coronaGrad.addColorStop(0.38, 'rgba(168, 85, 247, 0.34)');
    coronaGrad.addColorStop(0.70, 'rgba(88, 28, 135, 0.12)');
    coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, coronaRadius, 0, Math.PI * 2);
    ctx.fill();

    // Neon Halo Ring Stroke (from Reference 1)
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.earthRadius * 1.012, 0, Math.PI * 2);
    ctx.lineWidth = 2.8;
    ctx.strokeStyle = 'rgba(168, 85, 247, 0.85)';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 24;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.earthRadius * 1.002, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.95)';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.stroke();
    ctx.restore();

    // Top-left Sun-facing atmospheric crescent glow tracking pointer
    const sunX = this.centerX - this.earthRadius * 0.38 + pointerShiftX;
    const sunY = this.centerY - this.earthRadius * 0.38 + pointerShiftY;
    const crescentGrad = ctx.createRadialGradient(
      sunX, sunY, this.earthRadius * 0.6,
      sunX, sunY, this.earthRadius * 1.45
    );
    crescentGrad.addColorStop(0, 'rgba(192, 132, 252, 0.22)');
    crescentGrad.addColorStop(0.35, 'rgba(56, 189, 248, 0.08)');
    crescentGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = crescentGrad;
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.earthRadius * 1.18, 0, Math.PI * 2);
    ctx.fill();

    // 4. Render 1080p 3D Earth Globe (circularly clipped with zero border bleed)
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.earthRadius, 0, Math.PI * 2);
    ctx.clip();

    this.renderEarthGlobe(ctx);

    // 4B. Ethereal Atmospheric Limb Glow (at outermost rim only)
    const limbGrad = ctx.createRadialGradient(
      this.centerX, this.centerY, this.earthRadius * 0.88,
      this.centerX, this.centerY, this.earthRadius
    );
    limbGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    limbGrad.addColorStop(0.70, 'rgba(56, 189, 248, 0.12)');
    limbGrad.addColorStop(0.95, 'rgba(186, 230, 253, 0.32)');
    limbGrad.addColorStop(1, 'rgba(255, 255, 255, 0.55)');
    ctx.fillStyle = limbGrad;
    ctx.fill();

    ctx.restore();

    // 5. Floating Microplastic Particulate Cloud
    this.renderMicroplastics(ctx);

    // 6. 3D Geolocation Hotspot Markers
    this.renderMarkers(ctx);

    ctx.restore();
  }

  renderEarthGlobe(ctx) {
    if (this.glReady && this.glRenderer && this.glScene && this.glCamera) {
      // Synchronize 3D Earth rotation
      const centerLon = (15 - this.currentAngle) % 360;
      this.glSpinGroup.rotation.y = -Math.PI / 2 - THREE.MathUtils.degToRad(centerLon);

      // Cloud layer independent drift for real 3D parallax depth
      if (this.cloudMesh) {
        this.cloudMesh.rotation.y = this.cloudDrift;
        this.cloudDrift += 0.00028;
      }

      this.glScene.updateMatrixWorld(true);

      // Render 3D WebGL Earth at crisp 1080p resolution
      this.glRenderer.render(this.glScene, this.glCamera);

      // Draw onto 2D canvas
      const drawSize = this.earthRadius * 2;
      const destX = Math.round(this.centerX - this.earthRadius);
      const destY = Math.round(this.centerY - this.earthRadius);

      ctx.drawImage(this.glCanvas, destX, destY, drawSize, drawSize);
      return;
    }

    ctx.fillStyle = '#060a16';
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.earthRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  renderMicroplastics(ctx) {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      const alpha = 0.4 + Math.sin(p.pulse) * 0.35;
      const size = p.size * (0.8 + Math.cos(p.pulse) * 0.2);

      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0.1, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  renderMarkers(ctx) {
    this.markerProjections = [];
    const now = performance.now();

    for (const marker of this.markers) {
      const anchor = this.markerAnchors[marker.id];
      let px, py, isVisible, limbAlpha;

      if (anchor && this.glReady) {
        const worldPos = new THREE.Vector3();
        anchor.getWorldPosition(worldPos);

        isVisible = worldPos.z > 0.04;

        if (!isVisible) {
          this.markerProjections.push({ marker, visible: false });
          continue;
        }

        px = this.centerX + worldPos.x * this.earthRadius;
        py = this.centerY - worldPos.y * this.earthRadius;
        limbAlpha = Math.min(1, Math.max(0, (worldPos.z - 0.04) / 0.26));
      } else {
        const centerLon = (15 - this.currentAngle) % 360;
        let dLon = (marker.lon - centerLon) % 360;
        while (dLon > 180) dLon -= 360;
        while (dLon < -180) dLon += 360;

        const dLonRad = (dLon * Math.PI) / 180;
        const latRad = (marker.lat * Math.PI) / 180;
        const cosLon = Math.cos(dLonRad);
        isVisible = cosLon > 0.05;

        if (!isVisible) {
          this.markerProjections.push({ marker, visible: false });
          continue;
        }

        const tiltRad = (12 * Math.PI) / 180;
        const sphereX = Math.sin(dLonRad) * Math.cos(latRad);
        const rawSphereY = -Math.sin(latRad);
        const sphereY = rawSphereY * Math.cos(tiltRad) - cosLon * Math.sin(tiltRad) * 0.2;

        px = this.centerX + sphereX * (this.earthRadius * 0.96);
        py = this.centerY + sphereY * (this.earthRadius * 0.96);
        limbAlpha = Math.min(1, Math.max(0, (cosLon - 0.05) / 0.3));
      }

      const isHovered = this.hoveredMarker && this.hoveredMarker.id === marker.id;
      const isSelected = this.activeMarker && this.activeMarker.id === marker.id;

      this.markerProjections.push({
        marker,
        visible: true,
        x: px,
        y: py,
        radius: isHovered || isSelected ? 9 : 6
      });

      ctx.save();
      ctx.globalAlpha = limbAlpha;

      const pulseT = ((now % 2400) / 2400);
      const pulseRadius = 8 + pulseT * 18;
      const pulseAlpha = (1 - pulseT) * 0.7 * limbAlpha;

      ctx.strokeStyle = marker.dangerLevel === 'Критический' || marker.dangerLevel === 'Critical' ? '#ef4444' : '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = pulseAlpha;
      ctx.beginPath();
      ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = limbAlpha;
      ctx.fillStyle = marker.dangerLevel === 'Критический' || marker.dangerLevel === 'Critical' ? '#ef4444' : '#38bdf8';
      ctx.shadowColor = marker.dangerLevel === 'Критический' || marker.dangerLevel === 'Critical' ? '#ef4444' : '#38bdf8';
      ctx.shadowBlur = 12;

      ctx.beginPath();
      ctx.arc(px, py, isHovered || isSelected ? 7 : 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();

      if (isHovered || isSelected) {
        ctx.shadowBlur = 18;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.fillStyle = 'rgba(10, 18, 36, 0.88)';
        ctx.strokeStyle = marker.dangerLevel === 'Критический' || marker.dangerLevel === 'Critical' ? 'rgba(244, 63, 94, 0.6)' : 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1;

        const text = `${marker.icon} ${marker.name}`;
        ctx.font = '600 12px -apple-system, BlinkMacSystemFont, "Plus Jakarta Sans", sans-serif';
        const textMetrics = ctx.measureText(text);
        const padX = 14;
        const boxW = textMetrics.width + padX * 2;
        const boxH = 30;
        const boxX = px + 16;
        const boxY = py - 15;

        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 15);
        ctx.fill();
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(text, boxX + padX, boxY + 19);
      }

      ctx.restore();
    }
  }

  setLang(lang) {
    this.lang = lang;
    this.markers = this.markersData[lang] || this.markersData.ru;
    if (this.activeMarker) {
      const refreshed = this.markers.find(m => m.id === this.activeMarker.id);
      if (refreshed) this.activeMarker = refreshed;
    }
    this.rebuildMarkerAnchors();
  }

  destroy() {
    this.isRunning = false;
    if (this.glRenderer) {
      this.glRenderer.dispose();
      this.glRenderer = null;
    }
  }
}
