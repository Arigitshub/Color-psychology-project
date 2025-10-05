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
const colorValueEl = document.getElementById('colorValue');
const colorNameEl = document.getElementById('colorName');
const toastEl = document.getElementById('toast');

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
};

// Emotion Palettes
const emotionPalettes = {
  calm: ["#4a6bff", "#6b8cff", "#8dadff", "#aecfff", "#cfe0ff"],
  energy: ["#ff4a4a", "#ff6b6b", "#ff8d8d", "#ffaeae", "#ffcfcf"],
  trust: ["#2d5be3", "#4a6bff", "#6b8cff", "#8dadff", "#aecfff"],
  creativity: ["#8a2be2", "#9e4bff", "#b26bff", "#c68bff", "#daabff"]
};

// Initialize App
function init() {
  // Set initial color
  updateColor(colorPicker.value);
  
  // Event Listeners
  colorPicker.addEventListener('input', (e) => {
    updateColor(e.target.value);
  });

  colorHexInput.addEventListener('input', (e) => {
    if (e.target.value.length === 7 && isValidHex(e.target.value)) {
      colorPicker.value = e.target.value;
      updateColor(e.target.value);
    }
  });

  analyzeBtn.addEventListener('click', () => {
    if (isValidHex(colorHexInput.value)) {
      updateColor(colorHexInput.value);
    } else {
      alert('Please enter a valid hex color code');
    }
  });

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

  colorSwatch.addEventListener('click', () => copyToClipboard(colorValueEl.textContent));
}

// Update color throughout the app
function updateColor(hex) {
  // Update inputs
  colorPicker.value = hex;
  colorHexInput.value = hex;
  
  // Update swatch
  colorSwatch.style.backgroundColor = hex;
  colorValueEl.textContent = hex;

  // Generate and display palette
  generateColorPalette(hex);
  
  // Analyze color
  analyzeColor(hex);
}

// Generate color palette
function generateColorPalette(baseColor) {
  colorPalette.innerHTML = '';
  
  // Create 5-color palette using chroma.js
  const palette = chroma.scale([baseColor, 'white']).mode('lch').colors(5);
  
  palette.forEach((color, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'palette-color';

    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;

    const code = document.createElement('span');
    code.className = 'color-code';
    code.textContent = color;

    wrapper.appendChild(colorBox);
    wrapper.appendChild(code);
    wrapper.addEventListener('click', () => copyToClipboard(color));
    colorPalette.appendChild(wrapper);
  });
}

// Analyze color and display results
function analyzeColor(hex) {
  const color = chroma(hex);
  const colorName = getColorName(color);
  const colorData = colorPsychology[colorName] || colorPsychology.blue;

  colorNameEl.textContent = colorData.name;

  // Update insights
  document.getElementById('insightsContent').innerHTML = `
    <h4>${colorData.name} Psychology</h4>
    <p>${colorData.insights}</p>
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
    const wrapper = document.createElement('div');
    wrapper.className = 'palette-color';

    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;

    const code = document.createElement('span');
    code.className = 'color-code';
    code.textContent = color;

    wrapper.appendChild(colorBox);
    wrapper.appendChild(code);
    wrapper.addEventListener('click', () => copyToClipboard(color));
    colorPalette.appendChild(wrapper);
  });
}

// Update accessibility info
function updateAccessibilityInfo(color) {
  const contrastWhite = chroma.contrast(color, 'white');
  const contrastBlack = chroma.contrast(color, 'black');
  const textColor = contrastWhite > contrastBlack ? 'white' : 'black';
  
  document.getElementById('accessibilityContent').innerHTML = `
    <div class="accessibility-grid">
      <div class="accessibility-item">
        <h4>Contrast Ratio</h4>
        <p>${contrastWhite.toFixed(2)}:1 (on white)</p>
        <p>${contrastBlack.toFixed(2)}:1 (on black)</p>
      </div>
      <div class="accessibility-item">
        <h4>Recommended Text</h4>
        <p style="color: ${textColor}; background-color: ${color}; padding: 0.5rem; border-radius: 4px;">
          ${textColor.toUpperCase()} text for best readability
        </p>
      </div>
      <div class="accessibility-item">
        <h4>WCAG Compliance</h4>
        <p>${contrastWhite >= 4.5 ? '✅' : '❌'} AA Normal Text</p>
        <p>${contrastWhite >= 7 ? '✅' : '❌'} AAA Normal Text</p>
      </div>
    </div>
  `;
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

// Validate hex color
function isValidHex(color) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
}

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2000);
}

function copyToClipboard(text) {
  if (!navigator.clipboard) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${text}`);
  });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);
