# InspireX Season 2 — Premium Dark Mode Theme Prompt

You can use the following prompt to instruct an AI or a designer to recreate this exact "Industry-Level" premium aesthetic for future websites or applications.

---

## 🎨 System Prompt / Design Instructions

**Core Aesthetic & Vibe**
Create a highly cinematic, premium, dark-mode web application. The design should feel like a high-end tech conference, a modern web3 platform, or an advanced SaaS product. It must utilize glassmorphism, dynamic glowing neon accents, deep blacks, and a blueprint-like grid aesthetic. The UI must feel spacious, immersive, and "industry-level".

**1. Color Palette**
- **Backgrounds (The Ink System):** Deep, almost OLED blacks.
  - `Base`: `#09090B` (Pitch black with a tiny hint of blue/purple).
  - `Cards`: `#16161A` or ultra-thin white gradients (e.g., `rgba(255,255,255,0.03)`).
- **Accents (The Glow System):** 
  - `Primary Accent (Ember)`: `#0055FF` (Vibrant royal blue).
  - `Secondary Accent (Volt)`: `#00E5FF` (Electric cyan / neon teal).
- **Text (The Paper System):**
  - `Primary Text`: `#F4F1EC` (Soft off-white to reduce eye strain).
  - `Muted Text`: `#9B98A3` (Cool gray for secondary information).
- **Lines & Borders:**
  - `Subtle Borders`: `rgba(255,255,255,0.08)`.
  - `Highlight Edges`: `rgba(255,255,255,0.15)`.

**2. Typography System**
- **Headings & Massive Numbers (Display):** Use `Unbounded` (or a similar wide, ultra-modern sans-serif). Font weights should be extremely heavy (800-900). Use tight line-heights (0.9 to 1.1).
- **Body & Paragraphs (Sans):** Use `Inter`. Clean, readable, neutral.
- **Eyebrows, Metadata, & Labels (Mono/Tech):** Use `Syne` (or a similar technical/monospaced font). Heavy letter-spacing (e.g., `0.15em`), all-caps, and usually colored in the secondary accent.

**3. UI Components & Glassmorphism**
- **Cards & Grid Items:** Do not use flat, muddy gray backgrounds. Instead, use a true glassmorphic effect:
  - `background`: A very faint linear-gradient (e.g., top-left to bottom-right going from 3% white opacity to 0%).
  - `backdrop-filter`: Heavy blur (e.g., `blur(16px)`).
  - `border`: 1px solid at 8% white opacity, with a top edge at 15% white opacity to simulate an etched glass reflection.
- **Text Gradients:** Key metrics, massive numbers, or hero headlines should not be solid colors. Use a metallic gradient mask: `background: linear-gradient(135deg, #ffffff 30%, #00E5FF 100%); -webkit-background-clip: text; color: transparent;`.
- **Buttons:** 
  - Primary buttons should use a bold gradient (Royal Blue to Cyan) with an inner glow or shine effect.
  - Secondary buttons or tags should be pills with blurred backgrounds, subtle borders, and glowing dot indicators.

**4. Layout & Spacing**
- **Cinematic Framing:** Use expansive layouts (`max-width: 1600px` or wider for hero sections) rather than cramming everything into a narrow center column.
- **Symmetric Padding:** Use fluid, viewport-based padding (e.g., `clamp(24px, 5vw, 80px)`) to ensure the design breathes beautifully across all screen sizes.
- **Overlapping Elements:** Break the grid. Allow large visual elements (like 3D assets or huge typographic watermarks) to bleed off the edge of the screen or sit *behind* the foreground text using `z-index` layering.

**5. Animations & Micro-Interactions (UX)**
- **Hover States:** When hovering over cards, they should physically lift (`transform: translateY(-6px)`).
- **Glow Injection:** On hover, cards should fade in an inner radial gradient in the top-left corner (Cyan at 15% opacity fading to transparent) to simulate a light source activating. Drop shadows should shift from black to a soft, diffuse cyan (`rgba(0, 229, 255, 0.15)`).
- **Background Ambiance:** The background should feature a subtle, fixed blueprint grid pattern and slow-moving, massive, heavily blurred abstract orbs (one Royal Blue, one Cyan) to give the canvas depth and life.
