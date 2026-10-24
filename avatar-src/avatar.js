// =====================================================================================
// FORM AvatarSystem — персональный герой: идентичность, телосложение, прогресс,
// награды, плавные переходы, хранение и подключаемый рендерер (SVG сейчас, GLB/Three.js позже).
// Разработка Александра Гурлени.
//
// Правило: внешность (идентичность), телосложение, уровень (игровые баллы) и измеренный вес —
// разные сущности. Тело меняется только по этапам, которые считаются из реальных данных
// (взвешивания относительно цели и выполненные тренировки), а не из XP или монет.
// =====================================================================================
const FormAvatar = (() => {
  const VERSION = 2;               // версия структуры данных героя в state.av
  const SVG_MODEL = 'svg-hero-3';  // текущий набор ассетов (векторный рендер formHero)
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;

  // ---------- AvatarIdentity: постоянные черты, которые не зависят от телосложения ----------
  const IDENTITY_KEYS = ['g', 'skin', 'eye', 'hair', 'hc', 'face', 'freckles', 'lash', 'lip', 'shadow', 'blush', 'lashC', 'name'];
  function identity(av) {
    const a = av || {}, o = { id: a.id || null };
    for (const k of IDENTITY_KEYS) if (a[k] !== undefined) o[k] = a[k];
    return o;
  }
  // стабильный идентификатор: из Telegram ID, если есть, иначе случайный один раз
  function stableId(tgId) {
    if (tgId) return 'tg' + String(tgId);
    let r = ''; for (let i = 0; i < 10; i++) r += 'abcdefghijkmnpqrstuvwxyz23456789'[Math.floor(Math.random() * 32)];
    return 'av' + r;
  }

  // ---------- AvatarPersistence: версия, миграция без потери данных ----------
  // возвращает обновлённый av (или null, если миграция не нужна). Ничего не удаляет:
  // все прежние поля сохраняются, а их копия кладётся в av.prev при первой миграции.
  function migrate(av, ctx) {
    const a = av || {};
    if (a.v === VERSION && a.id && a.body && a.model) return null;
    const out = { ...a };
    if (!a.v || a.v < VERSION) {
      const prev = { ...a }; delete prev.prev;
      out.prev = { v: a.v || 1, at: ctx && ctx.date || null, data: prev };
    }
    out.v = VERSION;
    out.id = a.id || stableId(ctx && ctx.tgId);
    out.model = a.model || SVG_MODEL;
    out.body = { start: 'auto', dir: 'auto', ...(a.body || {}) };
    if (a.stage == null) out.stage = null;      // последний показанный этап — выставится без анимации
    if (!a.greet) out.greet = 'wave';
    return out;
  }

  // ---------- AvatarBody: нормализованные параметры и траектории по целям ----------
  // параметры модели: fat (0..1 округлость), mus (0..1 мускулатура), t (0..1 рельеф/тонус).
  // безопасный диапазон для текущей SVG-модели (за его пределами появляются артефакты одежды)
  const SAFE = { fat: [0.02, 0.92], mus: [0.05, 1], t: [0, 1] };
  const safe = (b) => ({ fat: clamp(b.fat, SAFE.fat[0], SAFE.fat[1]), mus: clamp(b.mus, SAFE.mus[0], SAFE.mus[1]), t: clamp(b.t, SAFE.t[0], SAFE.t[1]) });
  // траектории: куда тело идёт от стартового образа на этапах 0..4 (доли пути и прибавки)
  const DIRS = {
    lose:     { label: 'Снижение веса',       fat: [0, 0.18, 0.4, 0.62, 0.8], mus: [0, 0.04, 0.08, 0.12, 0.16], t: [0, 0.12, 0.28, 0.45, 0.6] },
    gain:     { label: 'Набор мышц',          fat: [0, -0.02, -0.04, -0.05, -0.06], mus: [0, 0.17, 0.34, 0.5, 0.64], t: [0, 0.16, 0.32, 0.48, 0.62] },
    recomp:   { label: 'Рекомпозиция',        fat: [0, 0.12, 0.26, 0.4, 0.52], mus: [0, 0.1, 0.2, 0.3, 0.4], t: [0, 0.15, 0.32, 0.5, 0.65] },
    keep:     { label: 'Поддержание формы',   fat: [0, 0.03, 0.06, 0.08, 0.1], mus: [0, 0.03, 0.05, 0.07, 0.09], t: [0, 0.08, 0.15, 0.22, 0.3] },
    athMass:  { label: 'Спорт: масса',        fat: [0, 0, 0, 0, 0], mus: [0, 0.07, 0.14, 0.2, 0.26], t: [0, 0.12, 0.25, 0.38, 0.5] },
    athCut:   { label: 'Спорт: сушка',        fat: [0, 0, 0, 0, 0], mus: [0, 0.06, 0.12, 0.18, 0.25], t: [0, 0.09, 0.18, 0.27, 0.35] },
  };
  const DIR_BY_GOAL = ['lose', 'gain', 'recomp', 'keep', 'keep', 'athMass', 'athMass']; // цели 0..6
  function direction(goal, athCut, override) {
    if (override && override !== 'auto' && DIRS[override]) return override;
    if ((goal === 5 || goal === 6) && athCut) return 'athCut';
    return DIR_BY_GOAL[goal == null ? 3 : goal] || 'keep';
  }
  // стартовый образ: из реального стартового веса (ИМТ) или выбранный пользователем
  const START_PRESETS = [{ fat: 0.06, label: 'Стройное' }, { fat: 0.3, label: 'Среднее' }, { fat: 0.58, label: 'Плотное' }, { fat: 0.85, label: 'Крупное' }];
  function startBody(o) {
    const pre = o.override != null && o.override !== 'auto' ? START_PRESETS[o.override] : null;
    let fat = pre ? pre.fat : o.fatFromWeight;
    let mus = o.musBase, t = 0.05;
    if (o.dir === 'athMass') { fat = Math.max(0.12, Math.min(fat, 0.24)); mus = o.g === 'f' ? 0.6 : 0.74; t = 0.5; }
    if (o.dir === 'athCut') { fat = Math.max(0.06, Math.min(fat, 0.16)); mus = o.g === 'f' ? 0.58 : 0.7; t = 0.65; }
    return safe({ fat, mus, t });
  }
  // тело на этапе (дробный этап даёт плавную промежуточную форму для переходов)
  function bodyAt(start, dirKey, stage, targetFat) {
    const D = DIRS[dirKey] || DIRS.keep, s = clamp(stage, 0, 4), i = Math.min(3, Math.floor(s)), k = s - i;
    const at = (arr) => lerp(arr[i], arr[i + 1], k);
    let fat = start.fat;
    if (dirKey === 'lose' || dirKey === 'recomp') {
      // к целевому образу: если есть целевой вес — к его ИМТ, иначе доля пути вниз
      const goalFat = targetFat != null ? Math.min(start.fat, targetFat) : start.fat * 0.35;
      fat = lerp(start.fat, goalFat, at(D.fat) / D.fat[4]);
    } else if (dirKey === 'athCut') fat = start.fat - (start.fat - 0.03) * (s / 4);
    else fat = start.fat - at(D.fat) * (dirKey === 'keep' ? start.fat : 1);
    return safe({ fat, mus: start.mus + at(D.mus), t: start.t + at(D.t) });
  }

  // ---------- AvatarProgress: этап образа из реальных данных ----------
  // weightP: измеренный прогресс веса к цели (0..1); trainP: выполненные тренировки (0..1).
  const STAGE_AT = [0, 0.15, 0.35, 0.6, 0.85];
  const STAGE_NAMES = ['Старт', 'Первые изменения', 'Заметный прогресс', 'Новая форма', 'Цель близко'];
  const MIX = { lose: [0.65, 0.35], gain: [0.4, 0.6], recomp: [0.3, 0.7], keep: [0.2, 0.8], athMass: [0.3, 0.7], athCut: [0.4, 0.6] };
  function progress(o) {
    const w0 = o.w0, w = o.w, tw = o.tw;
    let weightP = 0;
    if (w0 && w) {
      if (tw && Math.abs(tw - w0) >= 0.5) weightP = (w0 - w) / (w0 - tw);
      else if (o.dir === 'gain' || o.dir === 'athMass') weightP = (w - w0) / (w0 * 0.06);
      else if (o.dir === 'lose' || o.dir === 'recomp' || o.dir === 'athCut') weightP = (w0 - w) / (w0 * 0.1);
    }
    weightP = clamp(weightP, 0, 1);
    const trainP = clamp((o.trainings || 0) / (o.trainGoal || 40), 0, 1);
    const m = MIX[o.dir] || MIX.keep;
    const p = clamp(m[0] * weightP + m[1] * trainP, 0, 1);
    let stage = 0; for (let i = 0; i < STAGE_AT.length; i++) if (p >= STAGE_AT[i]) stage = i;
    const nextAt = stage < 4 ? STAGE_AT[stage + 1] : 1;
    return { p, stage, weightP, trainP, name: STAGE_NAMES[stage], toNext: stage < 4 ? Math.round((p - STAGE_AT[stage]) / (nextAt - STAGE_AT[stage]) * 100) : 100 };
  }
  // тренировочные дни: отмеченные в плане + дни с добавленной активностью
  function trainingDays(trDone, actLog) {
    const days = new Set();
    for (const k of Object.keys(trDone || {})) if (trDone[k]) days.add(k);
    for (const k of Object.keys(actLog || {})) { const it = actLog[k] && actLog[k].items; if (it && it.length) days.add(k); }
    return days.size;
  }

  // ---------- AvatarRewards: награды по уровню и этапам (отдельно от идентичности) ----------
  const GREETS = [
    { id: 'wave', label: 'Помахать', lv: 1 },
    { id: 'happy', label: 'Подпрыгнуть от радости', lv: 3 },
    { id: 'flex', label: 'Показать бицепс', lv: 4 },
    { id: 'dance', label: 'Станцевать', lv: 6 },
  ];
  const BADGES = [
    { id: 'st1', label: 'Первые изменения', need: (c) => c.stage >= 1 },
    { id: 'st2', label: 'Заметный прогресс', need: (c) => c.stage >= 2 },
    { id: 'st3', label: 'Новая форма', need: (c) => c.stage >= 3 },
    { id: 'st4', label: 'Цель близко', need: (c) => c.stage >= 4 },
    { id: 'tr10', label: '10 тренировок', need: (c) => c.trainings >= 10 },
    { id: 'tr30', label: '30 тренировок', need: (c) => c.trainings >= 30 },
    { id: 'lv5', label: 'Уровень 5', need: (c) => c.lvl >= 5 },
    { id: 'lv10', label: 'Уровень 10', need: (c) => c.lvl >= 10 },
  ];
  function rewards(c) {
    return {
      greets: GREETS.map((g) => ({ ...g, open: c.lvl >= g.lv })),
      badges: BADGES.map((b) => ({ id: b.id, label: b.label, open: !!b.need(c) })),
    };
  }
  const greetPose = (av, lvl) => { const g = GREETS.find((x) => x.id === (av && av.greet)); return g && lvl >= g.lv ? g.id : 'wave'; };

  // ---------- AvatarAnimation: переход телосложения по времени (не по кадрам) ----------
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const reducedMotion = () => { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; } };
  class BodyTween {
    constructor(onFrame, onDone) { this.onFrame = onFrame; this.onDone = onDone; this.raf = 0; this.cur = null; this.to = null; }
    // запускается только если цель реально изменилась
    start(from, to, ms) {
      if (this.to && same(this.to, to)) return false;
      this.stop();
      this.from = from; this.to = to; this.cur = from;
      if (reducedMotion() || !ms) { this.cur = to; this.onFrame(to, 1); this.finish(); return true; }
      const t0 = performance.now(); let last = 0;
      const step = (now) => {
        const k = clamp((now - t0) / ms, 0, 1), e = ease(k);
        this.cur = { fat: lerp(from.fat, to.fat, e), mus: lerp(from.mus, to.mus, e), t: lerp(from.t, to.t, e) };
        // кадр рисуем не чаще ~30 раз в секунду — этого достаточно для плавности и бережёт батарею
        if (k >= 1 || now - last >= 33) { last = now; this.onFrame(this.cur, k); }
        if (k < 1) this.raf = requestAnimationFrame(step); else this.finish();
      };
      this.raf = requestAnimationFrame(step);
      return true;
    }
    finish() { this.raf = 0; const d = this.onDone; this.from = null; if (d) d(this.to); }
    stop() { if (this.raf) cancelAnimationFrame(this.raf); this.raf = 0; }
    get running() { return !!this.raf; }
  }
  const same = (a, b) => a && b && Math.abs(a.fat - b.fat) < 1e-3 && Math.abs(a.mus - b.mus) < 1e-3 && Math.abs(a.t - b.t) < 1e-3;

  // ---------- AvatarRenderer: контракт и реализации ----------
  // Любой рендерер: mount(el) · render(params) · dispose(). params = { identity, body:{fat,mus,t}, outfit, pose }.
  // Бизнес-логика (этапы, награды, переходы) не зависит от того, какой рендерер подключён.
  const cfg = () => (typeof window !== 'undefined' && window.FORM_AVATAR) || {};
  const webglOk = (() => { let v = null; return () => { if (v !== null) return v; try { const c = document.createElement('canvas'); v = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { v = false; } return v; }; })();
  // какой рендерер использовать: GLB только если модель задана в настройках сервера и WebGL доступен
  const modelUrl = (g) => { const c = cfg(); return (c.models && c.models[g === 'f' ? 'f' : 'm']) || c.glb || null; };
  const rendererKind = (g) => (modelUrl(g) && webglOk() ? 'glb' : 'svg');

  // GLB/Three.js рендерер. Требования к модели — в AVATAR_MODEL.md. Загружается лениво, ресурсы
  // переиспользуются между экранами, освобождаются в dispose(). Если что-то не так — сообщает onFail,
  // и приложение остаётся на SVG.
  let threeP = null; const glbCache = new Map();
  function loadThree() {
    if (!threeP) {
      const c = cfg(), main = c.three || 'https://esm.sh/three@0.160.0', loader = c.gltfLoader || 'https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
      threeP = Promise.all([import(main), import(loader)]).then(([THREE, L]) => ({ THREE, GLTFLoader: L.GLTFLoader }));
      threeP.catch(() => { threeP = null; });
    }
    return threeP;
  }
  function loadGlb(url) {
    if (!glbCache.has(url)) glbCache.set(url, loadThree().then(({ GLTFLoader }) => new Promise((res, rej) => new GLTFLoader().load(url, res, undefined, rej))));
    return glbCache.get(url);
  }
  const MORPH = { fat: ['body_fat', 'fat'], mus: ['body_muscle', 'muscle'], t: ['body_definition', 'definition', 'tone'] };
  class GlbRenderer {
    constructor(opts) { this.opts = opts || {}; this.ready = false; this.params = null; this.dead = false; }
    async mount(el) {
      this.el = el;
      try {
        const { THREE } = await loadThree(); const gltf = await loadGlb(this.opts.url);
        if (this.dead) return;
        const w = el.clientWidth || 270, h = el.clientHeight || Math.round(w * 1.3);
        const r = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
        r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setSize(w, h); r.outputColorSpace = THREE.SRGBColorSpace;
        r.shadowMap.enabled = true;
        const scene = new THREE.Scene();
        const cam = new THREE.PerspectiveCamera(28, w / h, 0.1, 50);
        // мягкий студийный свет: ключевой, заполняющий, контровой
        const key = new THREE.DirectionalLight(0xfff1e6, 2.2); key.position.set(-1.5, 2.5, 2.5); key.castShadow = true; scene.add(key);
        scene.add(new THREE.HemisphereLight(0xdfe9ff, 0x2a2420, 0.9));
        const rim = new THREE.DirectionalLight(0xbfd8ff, 1.4); rim.position.set(2, 1.5, -2.5); scene.add(rim);
        const root = gltf.scene.clone(true); // клон: один загруженный ассет на все экраны
        scene.add(root);
        const box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
        // адаптивная камера: весь рост в кадре при любом соотношении сторон контейнера
        const fit = Math.max(size.y, size.x * h / w) * 0.55 / Math.tan((cam.fov * Math.PI / 180) / 2);
        // запас снизу: нижнюю часть области героя перекрывает карточка показателей
        cam.position.set(c.x, c.y - size.y * 0.06, c.z + fit * 1.22); cam.lookAt(c.x, c.y - size.y * 0.06, c.z);
        // вращение: горизонтальный свайп поворачивает персонажа вокруг вертикальной оси, после отпускания — плавный возврат к фронту
        const pivot = new THREE.Group(); pivot.position.set(c.x, 0, c.z); root.position.sub(new THREE.Vector3(c.x, 0, c.z)); scene.remove(root); pivot.add(root); scene.add(pivot);
        this.pivot = pivot; this.yaw = 0; this.drag = null;
        const cv = r.domElement; cv.style.touchAction = 'pan-y';
        cv.addEventListener('pointerdown', (e) => { this.drag = { x: e.clientX, y: e.clientY, yaw: this.yaw, on: false }; });
        cv.addEventListener('pointermove', (e) => { const d = this.drag; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y;
          if (!d.on && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { d.on = true; try { cv.setPointerCapture(e.pointerId); } catch (er) {} }
          if (d.on) { this.yaw = d.yaw + dx * 0.012; e.preventDefault(); } });
        const up = () => { this.drag = null; this.idleAt = performance.now(); };
        cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
        this.meshes = []; root.traverse((o) => { if (o.isMesh) { o.castShadow = true; if (o.morphTargetDictionary) this.meshes.push(o); } });
        this.mats = {}; root.traverse((o) => { if (o.isMesh && o.material && o.material.name) { const m = o.material = o.material.clone(); this.mats[m.name] = (this.mats[m.name] || []).concat(m); } });
        this.mixer = gltf.animations && gltf.animations.length ? new THREE.AnimationMixer(root) : null;
        this.clips = gltf.animations || [];
        Object.assign(this, { THREE, r, scene, cam, root, clock: new THREE.Clock() });
        el.innerHTML = ''; r.domElement.style.cssText = 'display:block;width:100%;height:100%'; el.appendChild(r.domElement);
        this.ready = true; if (this.params) this.render(this.params); if (this.opts.onReady) this.opts.onReady();
        const loop = () => { if (this.dead) return; this.raf = requestAnimationFrame(loop); if (document.hidden) return; const dt = Math.min(0.05, this.clock.getDelta()); if (this.mixer) this.mixer.update(dt);
          // через 2.5 с без касаний персонаж плавно поворачивается обратно лицом к пользователю
          if (!this.drag && this.idleAt && performance.now() - this.idleAt > 2500) this.yaw *= Math.pow(0.02, dt);
          if (this.opts.yaw != null && !this.drag) this.yaw = this.opts.yaw;
          this.pivot.rotation.y = this.yaw; r.render(scene, cam); };
        loop();
      } catch (e) { if (this.opts.onFail) this.opts.onFail(e); }
    }
    render(params) {
      this.params = params; if (!this.ready) return;
      const b = params.body || {};
      for (const m of this.meshes) for (const k of Object.keys(MORPH)) for (const nm of MORPH[k]) { const i = m.morphTargetDictionary[nm]; if (i != null) m.morphTargetInfluences[i] = clamp(b[k] || 0, 0, 1); }
      const id = params.identity || {}, col = (name, hex) => { for (const m of this.mats[name] || []) if (hex && m.color) m.color.set(hex); };
      const SKIN = ['#FCE5D6', '#F7D0B5', '#E8B48C', '#C0855E', '#86593E'], EYES = ['#C27A33', '#7AA552', '#62A6E0', '#8E6E58', '#3A2A20'];
      col('skin', SKIN[id.skin == null ? 1 : id.skin]); col('hair', id.hc); col('eyes', EYES[id.eye || 0]);
      const o = params.outfit || {}; col('top', o.topC); col('bottom', o.botC); col('shoes', o.shoeC);
      if (this.mixer && params.pose !== this._pose) {
        this._pose = params.pose; const clip = this.THREE.AnimationClip.findByName(this.clips, params.pose) || this.THREE.AnimationClip.findByName(this.clips, 'idle');
        if (clip) { const a = this.mixer.clipAction(clip); if (this._act && this._act !== a) this._act.fadeOut(0.3); a.reset().fadeIn(0.3).play(); this._act = a; }
      }
    }
    dispose() {
      this.dead = true; if (this.raf) cancelAnimationFrame(this.raf);
      if (this.ready) {
        this.root.traverse((o) => { if (o.isMesh && o.material) [].concat(o.material).forEach((m) => m.dispose()); });
        this.r.dispose(); try { this.r.forceContextLoss(); } catch (e) {}
        if (this.r.domElement && this.r.domElement.parentNode) this.r.domElement.parentNode.removeChild(this.r.domElement);
      }
    }
  }

  return { modelUrl, VERSION, SVG_MODEL, DIRS, START_PRESETS, STAGE_NAMES, GREETS, identity, migrate, direction, startBody, bodyAt, progress, trainingDays, rewards, greetPose, BodyTween, rendererKind, webglOk, GlbRenderer, same };
})();
try { window.FormAvatar = FormAvatar; } catch (e) {}
