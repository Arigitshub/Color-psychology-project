import chroma from 'chroma-js';

// DOM Elements
const colorPicker = document.getElementById('primaryColor');
const colorHexInput = document.getElementById('colorHex');
const analyzeBtn = document.getElementById('analyzeBtn');
const colorSwatch = document.getElementById('colorSwatch');
const colorPalette = document.getElementById('colorPalette');
const paletteButtons = document.querySelectorAll('.palette-btn');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const paletteModeSelect = document.getElementById('paletteMode');
const themeToggleBtn = document.getElementById('themeToggle');
const colorNameEl = document.getElementById('colorName');
const colorValueEl = document.getElementById('colorValue');
const copyHexBtn = document.getElementById('copyHexBtn');
const savePaletteBtn = document.getElementById('savePaletteBtn');
const shareLinkBtn = document.getElementById('shareLinkBtn');
const exportPaletteBtn = document.getElementById('exportPaletteBtn');
const savedPalettesContainer = document.getElementById('savedPalettes');
const clearSavedBtn = document.getElementById('clearSavedBtn');
const toastEl = document.getElementById('toast');
const harmonyContent = document.getElementById('harmonyContent');
const strategyContent = document.getElementById('strategyContent');
const paletteMetaEl = document.getElementById('paletteMeta');

const STORAGE_KEY = 'colorMind.saves';
let currentPaletteColors = [];
let currentHex = colorPicker ? colorPicker.value : '#4a6bff';

// Color Psychology Data
const colorPsychology = {
  red: {
    name: "Red",
    insights: "Red evokes strong emotions like passion, energy, and urgency. It increases heart rate and creates a sense of excitement. In design, red commands attention and is often used for warnings or calls to action.",
    recommendations: "Use red sparingly for important elements like error messages or primary buttons. Avoid using red for health or financial applications as it can create anxiety. Works well in food, entertainment, and clearance sales contexts.",
    emotions: ["passion", "energy", "danger", "love", "anger"],
    palette: ["#ff0000", "#ff6b6b", "#ff9e9e", "#ffd3d3", "#fff0f0"]
  },
  blue: {
    name: "Blue",
    insights: "Blue is associated with trust, stability, and calmness. It's the most universally preferred color and is often used by corporations and financial institutions. Blue can suppress appetite and promote productivity.",
    recommendations: "Ideal for corporate websites, healthcare, and technology. Use darker blues for professionalism and lighter blues for approachability. Avoid in food-related contexts as it's unappetizing.",
    emotions: ["trust", "calm", "security", "productivity", "intelligence"],
    palette: ["#0000ff", "#6b6bff", "#9e9eff", "#d3d3ff", "#f0f0ff"]
  },
  green: {
    name: "Green",
    insights: "Green represents nature, growth, and harmony. It's the easiest color for the eyes to process and is often associated with environmentalism and finance. Green has a balancing, calming effect while still representing growth.",
    recommendations: "Perfect for environmental, health, and financial applications. Use bright greens for calls to action in eco-friendly contexts. Darker greens convey luxury and stability.",
    emotions: ["growth", "harmony", "freshness", "environment", "wealth"],
    palette: ["#00ff00", "#6bff6b", "#9eff9e", "#d3ffd3", "#f0fff0"]
  },
  yellow: {
    name: "Yellow",
    insights: "Yellow is the color of happiness, optimism, and creativity. It grabs attention but can cause eye fatigue. Bright yellow stimulates mental activity while softer yellows are comforting.",
    recommendations: "Use for highlighting important information or creating a cheerful atmosphere. Avoid large areas of bright yellow. Works well in children's products, creative tools, and summer themes.",
    emotions: ["happiness", "energy", "warmth", "caution", "creativity"],
    palette: ["#ffff00", "#ffff6b", "#ffff9e", "#ffffd3", "#fffff0"]
  },
  purple: {
    name: "Purple",
    insights: "Purple combines the stability of blue and the energy of red. It's associated with luxury, creativity, and spirituality. Historically linked to royalty, purple can add a sense of premium quality.",
    recommendations: "Great for beauty, creative, and luxury products. Use deep purples for premium feel and lighter purples for feminine or creative contexts. Avoid in mass-market products targeting men.",
    emotions: ["luxury", "creativity", "mystery", "spirituality", "wisdom"],
    palette: ["#800080", "#a06ba0", "#c09ec0", "#e0d3e0", "#f0f0f0"]
  }
  ,
  orange: {
    name: "Orange",
    insights: "Orange blends the energy of red and the happiness of yellow. It conveys enthusiasm, friendliness, and confidence, and is often used for calls to action where urgency is less severe than red.",
    recommendations: "Use for promotions, onboarding, and friendly CTAs. Works well in sports, food, and entertainment. Avoid overuse in professional/financial contexts.",
    emotions: ["enthusiasm", "friendliness", "confidence", "warmth"],
    palette: ["#ff7a00", "#ff9a3d", "#ffb874", "#ffd1a6", "#ffe8d6"]
  },
  teal: {
    name: "Teal",
    insights: "Teal merges the calming nature of blue with the renewal qualities of green. It signals sophistication, clarity, and balance.",
    recommendations: "Good for wellness, technology, and creative brands. Works well as a secondary color for calming accents.",
    emotions: ["balance", "clarity", "sophistication", "refreshing"],
    palette: ["#008c8c", "#1aa3a3", "#33baba", "#66d1d1", "#b3ebeb"]
  },
  pink: {
    name: "Pink",
    insights: "Pink communicates compassion, playfulness, and romance. Softer pinks feel nurturing; hot pinks feel energetic and youthful.",
    recommendations: "Great for lifestyle, beauty, and social apps. Use brighter pinks sparingly for CTAs; use soft pinks for backgrounds.",
    emotions: ["compassion", "playfulness", "romance", "youth"],
    palette: ["#ff4fa3", "#ff7abd", "#ffa1d0", "#ffc6e2", "#ffe6f3"]
  },
  brown: {
    name: "Brown",
    insights: "Brown suggests stability, reliability, and craftsmanship. It is grounded and earthy, often used for natural and artisanal brands.",
    recommendations: "Use for outdoor, food, and craft products. Pair with cream or white for warmth.",
    emotions: ["stability", "earthy", "comfort", "craft"],
    palette: ["#6b4f3b", "#876650", "#a47e66", "#c19885", "#e0c7b0"]
  },
  gray: {
    name: "Gray",
    insights: "Gray conveys neutrality, balance, and modernity. It recedes well, allowing accent colors to lead.",
    recommendations: "Use as UI neutrals and backgrounds. Ensure sufficient contrast for text and interactive states.",
    emotions: ["neutral", "balanced", "modern", "formal"],
    palette: ["#6b7280", "#9ca3af", "#d1d5db", "#e5e7eb", "#f3f4f6"]
  },
  black: {
    name: "Black",
    insights: "Black communicates elegance, power, and luxury. It can feel heavy; pair with contrast for readability.",
    recommendations: "Ideal for luxury and minimal aesthetics. Use generous spacing and contrast.",
    emotions: ["elegance", "power", "authority", "mystery"],
    palette: ["#000000", "#111111", "#1f2937", "#374151", "#4b5563"]
  },
  white: {
    name: "White",
    insights: "White symbolizes clarity, simplicity, and cleanliness. It provides breathing room and amplifies other colors.",
    recommendations: "Use for clean layouts and whitespace. Avoid low-contrast light text on white.",
    emotions: ["clarity", "simplicity", "space", "purity"],
    palette: ["#ffffff", "#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db"]
  }
};

// Emotion Palettes
const emotionPalettes = {
  calm: ["#4a6bff", "#6b8cff", "#8dadff", "#aecfff", "#cfe0ff"],
  energy: ["#ff4a4a", "#ff6b6b", "#ff8d8d", "#ffaeae", "#ffcfcf"],
  trust: ["#2d5be3", "#4a6bff", "#6b8cff", "#8dadff", "#aecfff"],
  creativity: ["#8a2be2", "#9e4bff", "#b26bff", "#c68bff", "#daabff"],
  luxury: ["#0f0f10", "#221f1f", "#3b2f4a", "#6a4c93", "#d4af37"]
};

const colorStrategies = {
  red: {
    archetype: 'The Activator',
    tone: ['Bold', 'Decisive', 'Urgent'],
    industries: ['E-commerce promos', 'Fitness & sport', 'Food delivery'],
    taglines: [
      'Turn urgency into action.',
      'Fuel adrenaline-packed experiences.',
      'Design for conversion at first glance.'
    ],
    ctas: ['Claim your spot', 'Start your trial', 'Boost performance'],
    pairings: ['Ground with charcoal for drama.', 'Soften with sandstone neutrals.', 'Add neon accents for tech energy.'],
    guidance: 'Use red when you need immediate attention and momentum. Contrast is critical—balance energetic elements with generous whitespace.'
  },
  orange: {
    archetype: 'The Cheerleader',
    tone: ['Optimistic', 'Playful', 'Approachable'],
    industries: ['Onboarding flows', 'Entertainment', 'Community apps'],
    taglines: [
      'Turn curiosity into commitment.',
      'Welcome users with warmth.',
      'Build communities that buzz.'
    ],
    ctas: ['Get started', 'Join the fun', 'See what\'s new'],
    pairings: ['Use deep navy for mature contrast.', 'Pair with cream for lifestyle brands.', 'Blend with pink for youthful vibes.'],
    guidance: 'Orange thrives in moments that should feel friendly yet focused. Support it with confident typography and rounded UI elements.'
  },
  yellow: {
    archetype: 'The Optimist',
    tone: ['Inventive', 'Bright', 'Uplifting'],
    industries: ['Education', 'Productivity', 'Kids & family'],
    taglines: [
      'Design for delightful clarity.',
      'Bring sunlight into complex workflows.',
      'Encourage discovery through positivity.'
    ],
    ctas: ['Explore lessons', 'Unlock insights', 'Create something new'],
    pairings: ['Anchor with slate gray for legibility.', 'Add teal for fresh contrast.', 'Blend with coral for creative storytelling.'],
    guidance: 'Balance yellow with structured layouts and high-contrast text. Use it sparingly to highlight key actions or celebrate wins.'
  },
  green: {
    archetype: 'The Growth Partner',
    tone: ['Restorative', 'Balanced', 'Assured'],
    industries: ['Wellness & health', 'Fintech', 'Sustainability'],
    taglines: [
      'Design experiences around renewal.',
      'Make progress feel sustainable.',
      'Bring calm momentum to data-heavy flows.'
    ],
    ctas: ['See your impact', 'Track progress', 'Request a demo'],
    pairings: ['Pair with midnight blue for premium calm.', 'Layer with beige for organic brands.', 'Use chrome accents for innovation.'],
    guidance: 'Green reassures users that growth is possible. Use layered gradients and organic shapes to emphasize progress and clarity.'
  },
  teal: {
    archetype: 'The Mindful Innovator',
    tone: ['Clarifying', 'Balanced', 'Insightful'],
    industries: ['Digital health', 'SaaS dashboards', 'Creative tooling'],
    taglines: [
      'Turn complex data into calm confidence.',
      'Blend empathy with innovation.',
      'Design clarity without losing character.'
    ],
    ctas: ['Visualize now', 'Run the demo', 'Guide me'],
    pairings: ['Accent with coral for personality.', 'Ground with graphite for authority.', 'Use lilac for modern wellness branding.'],
    guidance: 'Teal bridges logic and emotion. Support it with precise spacing, soft gradients, and plenty of negative space.'
  },
  blue: {
    archetype: 'The Trusted Guide',
    tone: ['Reliable', 'Calming', 'Strategic'],
    industries: ['Finance', 'B2B SaaS', 'Healthcare'],
    taglines: [
      'Build credibility at every click.',
      'Create confidence through clarity.',
      'Design the calm in complex decisions.'
    ],
    ctas: ['Schedule a consult', 'Start planning', 'Secure your spot'],
    pairings: ['Combine with mint for fresh fintech.', 'Layer with white for institutional trust.', 'Add orange micro-accents to signal action.'],
    guidance: 'Blue thrives in systems that demand trust. Use it consistently in navigation, backgrounds, and voice to keep users anchored.'
  },
  purple: {
    archetype: 'The Visionary',
    tone: ['Imaginative', 'Luxurious', 'Expressive'],
    industries: ['Beauty & fashion', 'Creative tech', 'Premium services'],
    taglines: [
      'Design for magnetic storytelling.',
      'Elevate premium journeys.',
      'Blend artistry with intelligence.'
    ],
    ctas: ['Book a preview', 'See the collection', 'Start crafting'],
    pairings: ['Ground with black for high fashion.', 'Add rose gold metallics.', 'Mix with cyan for futuristic moods.'],
    guidance: 'Purple rewards bold typography and cinematic imagery. Introduce motion and depth to amplify its premium energy.'
  },
  pink: {
    archetype: 'The Community Builder',
    tone: ['Nurturing', 'Playful', 'Inclusive'],
    industries: ['Lifestyle apps', 'Beauty & wellness', 'Social platforms'],
    taglines: [
      'Design spaces that feel personal.',
      'Encourage self-expression.',
      'Celebrate progress with warmth.'
    ],
    ctas: ['Share your story', 'Celebrate wins', 'Create together'],
    pairings: ['Contrast with midnight blue for sophistication.', 'Combine with lavender for softness.', 'Layer with lime for unexpected pop.'],
    guidance: 'Pink invites belonging. Combine with rounded components, thoughtful microcopy, and inclusive imagery to reinforce community.'
  },
  brown: {
    archetype: 'The Craftsman',
    tone: ['Grounded', 'Reliable', 'Textured'],
    industries: ['Artisanal goods', 'Outdoors', 'Food & beverage'],
    taglines: [
      'Design trust into every tactile detail.',
      'Highlight craftsmanship and heritage.',
      'Bring warmth to digital storytelling.'
    ],
    ctas: ['Explore the process', 'Meet the makers', 'Taste the difference'],
    pairings: ['Pair with cream for cozy balance.', 'Use forest green for sustainable narratives.', 'Add copper for refined warmth.'],
    guidance: 'Brown rewards tactile UI—think layered shadows, realistic textures, and serif typography for authenticity.'
  },
  gray: {
    archetype: 'The Systems Thinker',
    tone: ['Neutral', 'Refined', 'Methodical'],
    industries: ['Product design systems', 'Enterprise apps', 'Editorial'],
    taglines: [
      'Let functionality lead with clarity.',
      'Highlight hierarchy through restraint.',
      'Design timeless digital foundations.'
    ],
    ctas: ['Open the playbook', 'Explore components', 'View guidelines'],
    pairings: ['Add electric blue for focus.', 'Use blush accents for warmth.', 'Layer with black for brutalist aesthetics.'],
    guidance: 'Gray keeps teams aligned. Lean on typographic rhythm, high contrast states, and adaptive elevation to avoid monotony.'
  },
  black: {
    archetype: 'The Icon',
    tone: ['Dramatic', 'Confident', 'Minimal'],
    industries: ['Luxury ecommerce', 'High-end tech', 'Editorial'],
    taglines: [
      'Design experiences that feel cinematic.',
      'Let premium details take the spotlight.',
      'Deliver elegance with precision.'
    ],
    ctas: ['View the campaign', 'Discover the drop', 'Experience the suite'],
    pairings: ['Use stark white for contrast.', 'Introduce metallics sparingly.', 'Blend with deep emerald for rare luxury.'],
    guidance: 'Black magnifies sophistication. Use disciplined grids, generous spacing, and restrained animation for maximum impact.'
  },
  white: {
    archetype: 'The Minimalist',
    tone: ['Pure', 'Open', 'Lightweight'],
    industries: ['Product marketing', 'Portfolio sites', 'Health & wellness'],
    taglines: [
      'Design calm into every pixel.',
      'Let content take center stage.',
      'Amplify focus through airy layouts.'
    ],
    ctas: ['View the story', 'Start exploring', 'Try the experience'],
    pairings: ['Introduce charcoal typography.', 'Add glassmorphism effects for depth.', 'Use mint or lilac for gentle highlights.'],
    guidance: 'White creates breathing room. Support it with precise alignment, micro-interactions, and a confident typographic scale.'
  }
};

// Initialize App
function init() {
  restoreTheme();

  const initialState = parseInitialState();
  const startingHex = initialState.color || currentHex;

  if (paletteModeSelect && initialState.mode) {
    paletteModeSelect.value = initialState.mode;
  }

  if (colorPicker && startingHex) {
    colorPicker.value = startingHex;
  }

  updateColor(startingHex);
  
  // Event Listeners
  if (colorPicker) {
    colorPicker.addEventListener('input', (e) => {
      updateColor(e.target.value);
    });
  }

  if (colorHexInput) {
    colorHexInput.addEventListener('input', (e) => {
      const raw = e.target.value.trim();
      if (raw.length === 6 && isValidHex(raw)) {
        const hex = normalizeHex(raw);
        if (colorPicker) colorPicker.value = hex;
        updateColor(hex);
      }
    });

    colorHexInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const raw = colorHexInput.value.trim();
        if (isValidHex(raw)) {
          const normalized = normalizeHex(raw);
          if (colorPicker) colorPicker.value = normalized;
          updateColor(normalized);
        } else {
          showToast('Use a valid 3 or 6 digit hex code.');
        }
      }
    });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const raw = colorHexInput ? colorHexInput.value.trim() : '';
      if (isValidHex(raw)) {
        updateColor(normalizeHex(raw));
      } else {
        showToast('Please enter a valid hex color code.');
      }
    });
  }

  paletteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const emotion = btn.dataset.emotion;
      applyEmotionPalette(emotion);
    });
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      switchTab(tab);
    });
  });

  if (paletteModeSelect) {
    paletteModeSelect.addEventListener('change', () => {
      generateColorPalette(currentHex);
      updateShareState(currentHex);
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  if (copyHexBtn) {
    copyHexBtn.addEventListener('click', () => {
      const success = copyToClipboard(currentHex.toUpperCase());
      showToast(success ? `Copied ${currentHex.toUpperCase()}` : 'Copy failed. Try again.');
    });
  }

  if (exportPaletteBtn) {
    exportPaletteBtn.addEventListener('click', () => {
      if (!currentPaletteColors.length) {
        showToast('Generate a palette first.');
        return;
      }
      const css = formatAsCssVariables(currentPaletteColors);
      const success = copyToClipboard(css);
      showToast(success ? 'Palette copied as CSS variables.' : 'Copy failed. Try again.');
    });
  }

  if (savePaletteBtn) {
    savePaletteBtn.addEventListener('click', saveCurrentPalette);
  }

  if (shareLinkBtn) {
    shareLinkBtn.addEventListener('click', () => {
      const url = buildShareableUrl(currentHex);
      const success = copyToClipboard(url);
      showToast(success ? 'Share link copied to clipboard.' : 'Unable to copy share link.');
    });
  }

  if (savedPalettesContainer) {
    savedPalettesContainer.addEventListener('click', handleSavedPaletteAction);
    renderSavedPalettes();
  }

  if (clearSavedBtn) {
    clearSavedBtn.addEventListener('click', clearSavedPalettes);
  }

  if (harmonyContent) {
    harmonyContent.addEventListener('click', (event) => {
      const target = event.target.closest('[data-color]');
      if (!target) return;
      const selected = normalizeHex(target.dataset.color);
      if (colorPicker) colorPicker.value = selected;
      updateColor(selected);
      showToast(`Switched to ${selected.toUpperCase()}`);
    });
  }

  if (colorSwatch) {
    colorSwatch.addEventListener('click', () => {
      const success = copyToClipboard(currentHex.toUpperCase());
      showToast(success ? `Copied ${currentHex.toUpperCase()}` : 'Copy failed. Try again.');
    });
  }

  window.addEventListener('hashchange', () => {
    const state = parseInitialState();
    if (!state.color) return;
    if (paletteModeSelect && state.mode) {
      paletteModeSelect.value = state.mode;
    }
    if (colorPicker) colorPicker.value = state.color;
    updateColor(state.color);
  });
}

// Update color throughout the app
function updateColor(hex) {
  if (!hex) return;
  const normalized = normalizeHex(hex);
  currentHex = normalized;

  if (colorPicker) colorPicker.value = normalized;
  if (colorHexInput) colorHexInput.value = normalized.replace('#', '').toLowerCase();
  if (colorSwatch) colorSwatch.style.backgroundColor = normalized;

  const chromaColor = chroma(normalized);
  const colorName = getColorName(chromaColor);

  if (colorNameEl) colorNameEl.textContent = capitalize(colorName);
  if (colorValueEl) colorValueEl.textContent = normalized.toUpperCase();
  
  generateColorPalette(normalized);
  analyzeColor(normalized);
  updateHarmonyContent(chromaColor);
  updateStrategyContent(colorName, normalized);
  updateShareState(normalized);
}

// Generate color palette
function generateColorPalette(baseColor) {
  const mode = paletteModeSelect ? paletteModeSelect.value : 'tints';
  const colors = buildPaletteFromMode(baseColor, mode);
  renderPaletteColors(colors, `${formatModeLabel(mode)} palette`);
}

function buildPaletteFromMode(baseColor, mode) {
  const base = chroma(baseColor);
  const hue = base.get('hsl.h') || 0;
  switch (mode) {
    case 'shades':
      return chroma.scale([base, '#000000']).mode('lch').colors(5);
    case 'monochrome':
      return chroma.scale([base.desaturate(2), base, base.saturate(2)]).mode('lch').colors(5);
    case 'complementary': {
      const comp = base.set('hsl.h', (hue + 180) % 360);
      return chroma.scale([base, comp]).mode('lch').colors(5);
    }
    case 'analogous': {
      const a1 = base.set('hsl.h', (hue + 30) % 360);
      const a2 = base.set('hsl.h', (hue + 330) % 360);
      return [a2.hex(), base.hex(), a1.hex(), base.brighten(0.75).hex(), base.darken(0.75).hex()];
    }
    case 'triadic': {
      const t1 = base.set('hsl.h', (hue + 120) % 360);
      const t2 = base.set('hsl.h', (hue + 240) % 360);
      return [base.hex(), t1.hex(), t2.hex(), base.brighten(0.5).hex(), base.darken(0.5).hex()];
    }
    case 'split-complementary': {
      const s1 = base.set('hsl.h', (hue + 150) % 360);
      const s2 = base.set('hsl.h', (hue + 210) % 360);
      return [base.hex(), s1.hex(), s2.hex(), base.brighten(0.5).hex(), base.darken(0.5).hex()];
    }
    case 'tints':
    default:
      return chroma.scale([base, '#ffffff']).mode('lch').colors(5);
  }
}

function renderPaletteColors(colors, metaLabel) {
  if (!colorPalette) return;
  const normalized = colors.slice(0, 5).map(color => chroma(color).hex());
  currentPaletteColors = normalized;

  colorPalette.innerHTML = '';

  normalized.forEach((colorHex) => {
    const wrap = document.createElement('div');
    wrap.className = 'palette-color';

    const box = document.createElement('div');
    box.className = 'color-box';
    box.style.backgroundColor = colorHex;
    box.setAttribute('role', 'button');
    box.setAttribute('tabindex', '0');
    box.setAttribute('aria-label', `Use ${colorHex.toUpperCase()} as the primary color`);
    const handleSelect = () => updateColor(colorHex);
    box.addEventListener('click', handleSelect);
    box.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleSelect();
      }
    });

    const code = document.createElement('span');
    code.className = 'color-code';
    code.textContent = colorHex.toUpperCase();
    code.setAttribute('role', 'button');
    code.setAttribute('tabindex', '0');
    code.title = 'Copy hex value';
    const handleCopy = () => {
      const success = copyToClipboard(colorHex.toUpperCase());
      showToast(success ? `Copied ${colorHex.toUpperCase()}` : 'Copy failed. Try again.');
    };
    code.addEventListener('click', handleCopy);
    code.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleCopy();
      }
    });

    wrap.appendChild(box);
    wrap.appendChild(code);
    colorPalette.appendChild(wrap);
  });

  if (paletteMetaEl && metaLabel) {
    paletteMetaEl.textContent = `${currentPaletteColors.length} colors · ${metaLabel}`;
  }
}

function formatModeLabel(mode) {
  if (!mode) return 'Palette';
  return mode.split('-').map(part => capitalize(part)).join(' ');
}

// Analyze color and display results
function analyzeColor(hex) {
  const color = chroma(hex);
  const colorName = getColorName(color);
  const colorData = colorPsychology[colorName] || colorPsychology.blue;
  
  // Update insights
  document.getElementById('insightsContent').innerHTML = `
    <h4>${colorData.name} Psychology</h4>
    <p>${colorData.insights}</p>
    <div class="metrics" style="margin-top: 0.75rem; color: var(--text-light); font-family: monospace; font-size: 0.95rem;">
      <div>HEX: ${hex.toUpperCase()}</div>
      <div>RGB: ${color.rgb().map(n => Math.round(n)).join(', ')}</div>
      <div>HSL: ${(() => { const hsl = color.hsl(); const h = Math.round(hsl[0]||0); const s = Math.round((hsl[1]||0)*100); const l = Math.round((hsl[2]||0)*100); return `${h}, ${s}%, ${l}%`; })()}</div>
      <div>Luminance: ${color.luminance().toFixed(3)}</div>
      <div>Temp: ${getTemperatureLabel(color)}</div>
    </div>
    <div class="emotion-tags">
      ${colorData.emotions.map(e => `<span class="tag">${e}</span>`).join('')}
    </div>
  `;
  
  // Update recommendations
  document.getElementById('recommendationsContent').innerHTML = `
    <h4>Design Applications</h4>
    <p>${colorData.recommendations}</p>
    <div class="example-palette">
      ${colorData.palette.map(c => `<div style="background-color: ${c}" title="${c}"></div>`).join('')}
    </div>
  `;
  
  // Update accessibility
  updateAccessibilityInfo(color);
  
  // Update education
  updateEducationContent(colorName);
}

// Get color name from hex
function getColorName(color) {
  const hue = color.get('hsl.h');
  if (hue < 15 || hue > 345) return 'red';
  if (hue < 45) return 'orange';
  if (hue < 70) return 'yellow';
  if (hue < 160) return 'green';
  if (hue < 200) return 'teal';
  if (hue < 260) return 'blue';
  if (hue < 290) return 'purple';
  if (hue < 330) return 'pink';
  return 'red';
}

// Apply emotion palette
function applyEmotionPalette(emotion) {
  const palette = emotionPalettes[emotion];
  if (!palette) return;
  
  // Update primary color
  updateColor(palette[0]);
  
  // Update palette display
  colorPalette.innerHTML = '';
  palette.forEach(color => {
    const colorBox = document.createElement('div');
    colorBox.style.backgroundColor = color;
    colorBox.title = color;
    colorPalette.appendChild(colorBox);
  });
}

// Update education content
function updateEducationContent(colorName) {
  const colorData = colorPsychology[colorName] || colorPsychology.blue;
  
  document.getElementById('educationContent').innerHTML = `
    <div class="education-section">
      <h4>Understanding ${colorData.name}</h4>
      <p>${getColorEducation(colorName)}</p>
    </div>
    <div class="psychology-facts">
      <h4>Psychological Facts</h4>
      <ul>
        ${getColorFacts(colorName).map(fact => `<li>${fact}</li>`).join('')}
      </ul>
    </div>
  `;
}

// Get color education
function getColorEducation(colorName) {
  const education = {
    red: "Red is the first color humans perceive after black and white. It's the most emotionally intense color, raising blood pressure and respiration rate. In nature, red is both a warning (poison) and an attraction (ripe fruit).",
    blue: "Blue is the world's favorite color, preferred by about 40% of people globally. It's associated with trust, dependability, and commitment. Blue light has been shown to reduce stress and lower blood pressure.",
    green: "Green is the most restful color for the human eye. It symbolizes renewal and growth. Hospitals often use green because it relaxes patients. In color therapy, green is used to help with anxiety and depression.",
    yellow: "Yellow is the most visible color from a distance, which is why it's used for taxis and road signs. It stimulates mental activity but can be overpowering if overused. Babies cry more in yellow rooms.",
    purple: "Purple was the most expensive dye in ancient times, made from sea snails. It represents creativity and imagination. Studies show purple is the color most associated with vanity and extravagance."
  };
  
  return education[colorName] || education.blue;
}

// Get color facts
function getColorFacts(colorName) {
  const facts = {
    red: [
      "Red can make food taste sweeter",
      "Sports teams wearing red have a higher win rate",
      "Red cars are more likely to be pulled over"
    ],
    blue: [
      "Blue streetlights reduce crime and suicide rates",
      "Blue is the rarest color in nature",
      "People are more productive in blue rooms"
    ],
    green: [
      "Green improves reading ability",
      "The human eye can distinguish more shades of green than any other color",
      "Green is associated with wealth in the US"
    ],
    yellow: [
      "Yellow is the first color infants recognize",
      "Yellow rooms make people lose their temper more often",
      "Yellow is the most fatiguing color to the eye"
    ],
    purple: [
      "Purple is the color most associated with royalty",
      "Only two national flags contain purple",
      "Purple is the rarest color in heraldry"
    ]
  };
  
  return facts[colorName] || facts.blue;
}

// Switch tabs
function switchTab(tab) {
  tabButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  
  tabContents.forEach(content => {
    content.classList.toggle('active', content.dataset.tab === tab);
  });
}

// Enhanced helpers (override + additions)
function isValidHex(color) {
  return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(String(color).trim());
}

function normalizeHex(input) {
  let c = String(input).trim().replace(/^#/, '');
  if (c.length === 3) c = c.split('').map(ch => ch + ch).join('');
  return '#' + c.toLowerCase();
}

function copyToClipboard(text) {
  try {
    navigator.clipboard && navigator.clipboard.writeText(text);
  } catch (_) {
    const t = document.createElement('textarea');
    t.value = text; document.body.appendChild(t); t.select();
    document.execCommand('copy'); document.body.removeChild(t);
  }
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function getTemperatureLabel(color) {
  const h = color.get('hsl.h') || 0;
  const warm = (h <= 60) || (h >= 330) || (h > 60 && h < 90);
  return warm ? 'Warm' : 'Cool';
}

// Theme helpers
function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

function restoreTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
}

// Override accessibility renderer with improved WCAG details
function updateAccessibilityInfo(color) {
  const contrastWhite = chroma.contrast(color, 'white');
  const contrastBlack = chroma.contrast(color, 'black');
  const textColor = contrastWhite > contrastBlack ? 'white' : 'black';

  const html = `
    <div class="accessibility-grid">
      <div class="accessibility-item">
        <h4>Contrast Ratio</h4>
        <p>${contrastWhite.toFixed(2)}:1 on white</p>
        <p>${contrastBlack.toFixed(2)}:1 on black</p>
      </div>
      <div class="accessibility-item">
        <h4>Recommended Text</h4>
        <p style="color: ${textColor}; background-color: ${color}; padding: 0.5rem; border-radius: 4px;">
          ${textColor.toUpperCase()} text for best readability
        </p>
      </div>
      <div class="accessibility-item">
        <h4>WCAG Compliance</h4>
        <p>${contrastWhite >= 4.5 ? '✓' : '✗'} AA (normal) on white</p>
        <p>${contrastWhite >= 3 ? '✓' : '✗'} AA (large) on white</p>
        <p>${contrastBlack >= 4.5 ? '✓' : '✗'} AA (normal) on black</p>
        <p>${contrastBlack >= 3 ? '✓' : '✗'} AA (large) on black</p>
      </div>
    </div>`;

  document.getElementById('accessibilityContent').innerHTML = html;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);

