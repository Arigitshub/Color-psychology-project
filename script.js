function analyzeColor() {
      const colorInput = document.getElementById('colorInput');
      const color = colorInput.value;
      
      if (!isValidHex(color)) {
        alert('Please enter a valid hex color code');
        return;
      }

      document.getElementById('colorSwatch').style.backgroundColor = color;
      
      const insights = getColorInsights(color);
      const recommendations = getRecommendations(color);

      document.getElementById('insights').innerHTML = `
        <h2>Psychological Insights</h2>
        <p>${insights}</p>
      `;

      document.getElementById('recommendations').innerHTML = `
        <h2>Usage Recommendations</h2>
        <p>${recommendations}</p>
      `;
    }

    function isValidHex(color) {
      return /^#([0-9A-F]{3}){1,2}$/i.test(color);
    }

    function getColorInsights(color) {
      const colorCategories = {
        'red': {
          insights: 'Red symbolizes passion, energy, and excitement. It can evoke feelings of urgency and increase heart rate.',
          recommendations: 'Use for call-to-action buttons, sports equipment, or energy-related products.'
        },
        'orange': {
          insights: 'Orange represents enthusiasm, warmth, and creativity. It stimulates social interaction and excitement.',
          recommendations: 'Use for entertainment platforms, children\'s products, or social media features.'
        },
        'yellow': {
          insights: 'Yellow signifies happiness, optimism, and hope. It can improve mental clarity and memory.',
          recommendations: 'Use for educational tools, smiley faces, or warning messages.'
        },
        'green': {
          insights: 'Green represents growth, nature, and harmony. It promotes balance and reduces eye strain.',
          recommendations: 'Use for environmental products, health applications, or financial dashboards.'
        },
        'blue': {
          insights: 'Blue symbolizes trust, stability, and professionalism. It can create a sense of calmness and security.',
          recommendations: 'Use for corporate websites, banking applications, or trust-building interfaces.'
        },
        'purple': {
          insights: 'Purple represents creativity, luxury, and wisdom. It can inspire artistic expression and problem-solving.',
          recommendations: 'Use for creative tools, luxury products, or educational platforms.'
        },
        'pink': {
          insights: 'Pink signifies love, kindness, and warmth. It can create a sense of comfort and relaxation.',
          recommendations: 'Use for fashion products, beauty applications, or social features.'
        },
        'black': {
          insights: 'Black represents power, elegance, and sophistication. It can convey authority and strength.',
          recommendations: 'Use for luxury products, professional services, or high-end fashion.'
        },
        'white': {
          insights: 'White symbolizes purity, cleanliness, and simplicity. It can create a sense of space and clarity.',
          recommendations: 'Use for minimalistic designs, healthcare products, or cleaning services.'
        },
        'gray': {
          insights: 'Gray represents neutrality, balance, and stability. It can create a sense of calmness and professionalism.',
          recommendations: 'Use for corporate websites, financial applications, or professional tools.'
        }
      };

      const colorValue = color.replace('#', '');
      const isLight = isColorLight(colorValue);

      if (isLight) {
        return colorCategories['white'].insights;
      } else {
        return colorCategories['black'].insights;
      }
    }

    function getRecommendations(color) {
      const colorValue = color.replace('#', '');
      const isLight = isColorLight(colorValue);

      if (isLight) {
        return 'Use for minimalistic designs, healthcare products, or cleaning services.';
      } else {
        return 'Use for luxury products, professional services, or high-end fashion.';
      }
    }

    function isColorLight(hex) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return (r * 0.299 + g * 0.587 + b * 0.114) > 125;
    }
