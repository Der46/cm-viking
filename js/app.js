(function () {
  'use strict';

  var QUESTS = window.VIKING_QUESTS;
  var I18N = window.I18N;
  var LANGS = window.I18N_LANGS;
  var NODES = [[50, 245], [140, 225], [230, 245], [320, 225], [410, 245],
               [410, 80], [320, 60], [230, 80], [140, 60], [50, 80]];
  var ICONS = {
    spins: 'spins', coins: 'coins', petxp: 'petxp', setBlast: 'bolt', coinCraze: 'bolt',
    magicalChest: 'chest', smallSeasonal: 'chest', bigSeasonal: 'chest', seasonalChest: 'chest',
    diamondSeasonal: 'chest', regularChest: 'chest', blueChest: 'chest', jokerChest: 'chest',
    joker: 'card', goldCard: 'card', diamondCard: 'card', goldenHammers: 'hammer', pinata: 'star',
    tokens: 'token', tokenBox: 'chest', gems: 'gem', redHammers: 'hammer'
  };

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 無痕模式等情況 */ } }
  };

  var introDone = false;
  var state = { lang: pickLang(), quest: QUESTS[0].id, tier: null, bar: 1 };

  function pickLang() {
    var saved = store.get('cslviking:lang');
    if (saved && I18N[saved]) return saved;
    var nav = (navigator.languages || [navigator.language || 'en']);
    for (var i = 0; i < nav.length; i++) {
      var l = nav[i].toLowerCase();
      if (l.indexOf('zh') === 0) return 'zh-TW';
      var base = l.split('-')[0];
      if (I18N[base]) return base;
    }
    return 'zh-TW';
  }

  function t(key, vars) {
    var s = (I18N[state.lang] && I18N[state.lang][key]) || I18N.en[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ''; });
    return s;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function icon(name) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  function $(id) { return document.getElementById(id); }

  function quest() { return QUESTS.filter(function (q) { return q.id === state.quest; })[0] || QUESTS[0]; }
  function tier() {
    var q = quest();
    return q.tiers.filter(function (x) { return x.id === state.tier; })[0] ||
      q.tiers.filter(function (x) { return x.default; })[0] ||
      q.tiers.filter(function (x) { return x.popular; })[0] || q.tiers[q.tiers.length - 1];
  }

  /* ---------- 數字 ---------- */
  function parseAmount(s) {
    var m = /^([\d.]+)\s*([KMBT]?)$/i.exec(s);
    if (!m) return 0;
    return parseFloat(m[1]) * ({ '': 1, K: 1e3, M: 1e6, B: 1e9, T: 1e12 })[m[2].toUpperCase()];
  }
  function fmtAmount(n) {
    if (n >= 1e12) return (Math.round(n / 1e10) / 100) + 'T';
    if (n >= 1e9) return Math.round(n / 1e9) + 'B';
    return String(n);
  }

  /* ---------- 文字 ---------- */
  function itemText(it) {
    var s = t('i_' + it.t, { v: it.v });
    if (it.p) s += ' ' + it.p;
    if (it.m) s += ' ' + t('minutes', { m: it.m });
    if (it.about) {
      var cjk = /^(zh|ja)/.test(state.lang);
      s += (cjk ? '（' : ' (') + t('aboutSpins', { v: it.about }) + (cjk ? '）' : ')');
    }
    return s;
  }
  function goalText(b) { return t(b.wheel ? 'goalWheel' : 'goalCoins', { v: b.goal }); }

  function ruleHTML(r) {
    if (r.kind === 'max') return '<p class="rule-line">' + esc(t(r.auto ? 'maxAuto' : 'maxBet')) + '</p>';
    if (r.kind === 'auto') {
      return '<p class="rule-line">' + esc(r.bet && r.bet > 1 ? t('autoBetN', { b: t('bet' + r.bet) }) : t('autoLowest')) + '</p>';
    }
    if (r.kind === 'range') {
      return '<p class="rule-line">' + esc(t('rangeBets', { a: t('bet' + r.from), b: t('bet' + r.to) })) + '</p>' +
        '<ul class="rule-notes"><li>' + esc(t('restartNote')) + '</li></ul>';
    }
    if (r.kind === 'free') return '<p class="rule-line">' + esc(t('freeSwitch')) + '</p>';
    if (r.kind === 'ladder') {
      var h = '<ol class="ladder' + (r.steps.length > 3 ? ' ladder-long' : '') + '">';
      r.steps.forEach(function (s, i) {
        var last = i === r.steps.length - 1;  // 最後一檔一律轉到出獎勵轉盤為止
        h += '<li class="rung' + (last ? ' rung-open' : '') + '">';
        h += '<span class="rung-bet"><span class="pips" aria-hidden="true">' +
          new Array(s[0] + 1).join('<i></i>') + '</span>' + esc(t('bet' + s[0])) + '</span>' +
          '<span class="rung-spins">' + esc(last ? t('untilBonus') : t('spinsN', { n: s[1] })) + '</span>' +
          (!last ? '<span class="raise">' + esc(t('raiseAfter', { n: s[1] })) + '</span>' : '') +
          '</li>';
      });
      h += '</ol><ul class="rule-notes">';
      if (r.cap) h += '<li class="note-cap">' + esc(t('capNote')) + '</li>';
      h += '<li>' + esc(t('restartNote')) + '</li></ul>';
      return h;
    }
    if (r.kind === 'choice') {
      var c = '<p class="rule-line">' + esc(t('pickByCoins')) + '</p><div class="choices">';
      r.options.forEach(function (o) {
        c += '<div class="choice"><h4>' + esc(t(o.when)) + '</h4>' + ruleHTML(o.rule) + '</div>';
      });
      return c + '</div>';
    }
    return '';
  }

  /* ---------- 渲染 ---------- */
  function renderStatic() {
    document.documentElement.lang = state.lang;
    document.title = t('siteTitle');
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    $('quest-tabs').setAttribute('aria-label', t('quests'));
    $('seal').setAttribute('aria-label', '大佬群CSL ' + t('madeBy'));
    $('year').textContent = new Date().getFullYear();
  }

  function renderLangSelect() {
    var sel = $('lang-select');
    sel.innerHTML = LANGS.map(function (l) {
      return '<option value="' + l[0] + '" lang="' + l[0] + '">' + l[1] + '</option>';
    }).join('');
    sel.value = state.lang;
  }

  function renderQuestTabs() {
    var h = QUESTS.map(function (q) {
      var on = q.id === state.quest;
      return '<button type="button" class="quest-tab" data-quest="' + q.id + '" aria-pressed="' + on + '">' +
        esc(q.name[state.lang] || q.title) + '</button>';
    }).join('');
    $('quest-tabs').innerHTML = h;
  }

  function renderHero() {
    var q = quest();
    var light = { enchanted: '#C9BAEE', event: '#E6C478', tribal: '#B4D293' };
    document.body.setAttribute('data-theme', q.theme || 'default');
    document.body.classList.toggle('tone-light', !!light[q.theme]);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', light[q.theme] || '#17112B');
    $('quest-title').textContent = q.title;
    document.querySelector('.path-hint').textContent = t({ gift: 'pathHintGift', crate: 'pathHintCrate' }[q.node] || 'pathHint');
    var local = q.name[state.lang];
    $('quest-local').textContent = local && local !== q.title ? local : '';
    $('quest-local').hidden = !$('quest-local').textContent;

    var cur = tier();
    $('tier-list').innerHTML = q.tiers.map(function (x) {
      var on = x.id === cur.id;
      return '<label class="tier tier-k-' + x.label + (on ? ' is-on' : '') + '">' +
        '<input type="radio" name="tier" value="' + x.id + '"' + (on ? ' checked' : '') + '>' +
        (x.popular ? '<span class="tier-pop">' + esc(t('mostPopular')) + '</span>' : '') +
        '<span class="tier-prize">' + icon('spins') + x.prize + '</span>' +
        (x.label ? '<span class="tier-name">' + esc(t(x.label)) + '</span>' : '') +
        (x.cards ? '<span class="tier-cards">' + esc(t('goldenCards', { n: x.cards })) + '</span>' : '') +
        '</label>';
    }).join('');
    $('tier-note').textContent = cur.note ? t(cur.note) : '';
    $('tier-note').hidden = !cur.note;
  }

  function renderPath() {
    var q = quest(), cur = tier();
    var wrap = $('path');
    wrap.querySelectorAll('.node').forEach(function (n) { n.remove(); });
    NODES.forEach(function (p, i) {
      var n = i + 1;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'node' + (n === state.bar ? ' is-on' : '') +
        (cur.bars && cur.bars[i].wheel ? ' is-wheel' : '') + (introDone ? ' no-anim' : '');
      b.style.left = (p[0] / 500 * 100) + '%';
      b.style.top = (p[1] / 310 * 100) + '%';
      b.style.setProperty('--potion', q.colors[i]);
      b.style.setProperty('--i', i);
      b.dataset.bar = n;
      b.setAttribute('aria-label', t('bar', { n: n }));
      if (n === state.bar) b.setAttribute('aria-current', 'step');
      b.innerHTML = '<svg class="flask" aria-hidden="true"><use href="#' + (q.node || 'bottle') + '"/></svg>' +
        '<span class="node-num" aria-hidden="true">' + n + '</span>';
      wrap.appendChild(b);
    });
  }

  function renderDetail() {
    var q = quest(), cur = tier(), n = state.bar;
    var color = q.colors[n - 1];
    var zone = $('detail');
    var rule = q.sequence.bars[n];
    var bar = cur.bars && cur.bars[n - 1];

    var h = '<article class="page" style="--potion:' + color + '">' +
      '<header class="page-head">' +
      '<div class="numeral" aria-hidden="true"><span>' + n + '</span></div>' +
      '<div class="page-title"><h2>' + esc(t('bar', { n: n })) + '</h2>';
    if (bar && bar.goal) {
      h += '<p class="goal">' + icon(bar.wheel ? 'wheel' : 'coins') +
        '<span><span class="sr-only">' + esc(t('goal')) + ': </span>' + esc(goalText(bar)) + '</span></p>';
    }
    h += '</div>';
    h += '</header><div class="page-body">' +
      '<section class="col-strategy"><h3>' + esc(t('strategy')) + '</h3>' + ruleHTML(rule) + '</section>' +
      '<section class="col-rewards"><h3>' + esc(n === 10 ? t('grandPrize') : t('rewards')) + '</h3>';
    if (bar) {
      h += '<ul class="loot">' + bar.rewards.map(function (it) {
        return '<li>' + icon(ICONS[it.t] || 'star') + '<span>' + esc(itemText(it)) + '</span></li>';
      }).join('') + '</ul>';
    } else {
      h += '<p class="empty">' + esc(t('noData')) + '</p>';
    }
    h += '</section></div>' +
      '<nav class="page-nav">' +
      '<button type="button" class="pg" data-step="-1"' + (n === 1 ? ' disabled' : '') + '>' + icon('left') + '<span>' + esc(t('prev')) + '</span></button>' +
      '<button type="button" class="pg" data-step="1"' + (n === 10 ? ' disabled' : '') + '><span>' + esc(t('next')) + '</span>' + icon('right') + '</button>' +
      '</nav></article>';
    zone.innerHTML = h;
  }

  function renderTable() {
    var q = quest(), cur = tier();
    var wrap = $('table-wrap');
    if (!cur.bars) {
      wrap.innerHTML = '<p class="empty empty-dark">' + esc(t('noData')) + '</p>';
      $('total').textContent = '';
      return;
    }
    var sum = 0, allGoals = true;
    var rows = cur.bars.map(function (b, i) {
      if (b.goal) sum += parseAmount(b.goal); else allGoals = false;
      var n = i + 1;
      return '<tr class="' + (n === state.bar ? 'is-on' : '') + '" style="--potion:' + q.colors[i] + '">' +
        '<th scope="row"><button type="button" class="row-btn" data-bar="' + n + '"><i class="dot"></i>' + esc(t('bar', { n: n })) + '</button></th>' +
        '<td class="td-goal">' + (b.goal ? '<strong>' + esc(b.goal) + '</strong>' : '<span class="no-goal">' + esc(t('noGoal')) + '</span>') +
        (b.wheel ? '<span class="wheel-tag">' + icon('wheel') + esc(t('wheelTag')) + '</span>' : '') + '</td>' +
        '<td class="td-loot">' + b.rewards.map(function (it) { return '<span>' + esc(itemText(it)) + '</span>'; }).join('') + '</td></tr>';
    }).join('');
    wrap.innerHTML = '<table><thead><tr><th scope="col">' + esc(t('colBar')) + '</th><th scope="col">' + esc(t('colGoal')) +
      '</th><th scope="col">' + esc(t('colRewards')) + '</th></tr></thead><tbody>' + rows + '</tbody></table>';
    $('total').innerHTML = allGoals ? esc(t('total')) + ' <strong>' + fmtAmount(sum) + '</strong>' : '';
  }

  function render() {
    renderStatic();
    renderQuestTabs();
    renderHero();
    renderPath();
    renderDetail();
    renderTable();
  }

  /* ---------- 網址 #quest/tier/bar ---------- */
  function readHash() {
    var p = location.hash.replace(/^#/, '').split('/');
    var alias = { viking: 'event' };  // 舊連結 #viking 仍可用
    if (alias[p[0]]) p[0] = alias[p[0]];
    if (p[0] && QUESTS.some(function (q) { return q.id === p[0]; })) state.quest = p[0];
    if (p[1]) state.tier = p[1];
    var n = parseInt(p[2], 10);
    if (n >= 1 && n <= 10) state.bar = n;
    state.tier = tier().id;
  }
  function writeHash() {
    history.replaceState(null, '', '#' + state.quest + '/' + state.tier + '/' + state.bar);
  }

  function goBar(n, focusDetail) {
    state.bar = Math.max(1, Math.min(10, n));
    writeHash();
    renderPath();
    renderDetail();
    renderTable();
    var page = $('detail').querySelector('.page');
    if (page && !reduceMotion()) { page.classList.add('flip'); }
    if (focusDetail) {
      $('detail').focus({ preventScroll: true });
      $('detail').scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    }
  }
  function reduceMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  /* ---------- 事件 ---------- */
  document.addEventListener('click', function (e) {
    var node = e.target.closest('.node');
    if (node) { goBar(+node.dataset.bar, window.innerWidth < 900); return; }
    var row = e.target.closest('.row-btn');
    if (row) { goBar(+row.dataset.bar, true); return; }
    var pg = e.target.closest('.pg');
    if (pg) { goBar(state.bar + (+pg.dataset.step), false); return; }
    var qt = e.target.closest('.quest-tab');
    if (qt) { state.quest = qt.dataset.quest; state.tier = null; state.tier = tier().id; state.bar = 1; writeHash(); render(); }
  });

  document.addEventListener('change', function (e) {
    if (e.target.id === 'lang-select') {
      state.lang = e.target.value;
      store.set('cslviking:lang', state.lang);
      render();
    } else if (e.target.name === 'tier') {
      state.tier = e.target.value;
      writeHash();
      render();
      var el = document.querySelector('input[name="tier"][value="' + state.tier + '"]');
      if (el) el.focus();
    }
  });

  window.addEventListener('hashchange', function () { readHash(); render(); });

  readHash();
  renderLangSelect();
  render();
  writeHash();
  document.body.classList.add('ready');
  introDone = true;
})();
