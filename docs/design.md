# Professional UI Design Guide

> A comprehensive guide to building world-class, professional web applications with aesthetics inspired by Stripe, Plaid, Linear, and Vercel.

**Purpose**: This document serves as both a design philosophy guide and a practical implementation reference for creating polished, professional UIs.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Design System Foundations](#design-system-foundations)
3. [Layout & Structure](#layout--structure)
4. [Typography](#typography)
5. [Color & Contrast](#color--contrast)
6. [Components](#components)
7. [Interactivity & States](#interactivity--states)
8. [Data Presentation](#data-presentation)
9. [Motion & Animations](#motion--animations)
10. [Responsive Design](#responsive-design)
11. [Dark Mode](#dark-mode)
12. [Performance & Polish](#performance--polish)
13. [Quick Reference](#quick-reference)

---

## Design Philosophy

### Core Principles

**1. Clarity Over Cleverness**
- Every element serves a purpose
- Remove anything that doesn't add value
- Make the interface self-explanatory

**2. Confidence Through Simplicity**
- Less is more, but with impact
- Use whitespace strategically
- Don't fear empty space

**3. Delightful Details**
- Subtle animations that feel polished
- Micro-interactions that provide feedback
- Consistent, thoughtful touches throughout

**4. Information Hierarchy**
- Guide the user's eye naturally
- One primary action per screen
- Clear visual weight for importance

**5. Professional, Not Boring**
- Sophisticated without being stuffy
- Modern without being trendy
- Timeless rather than dated

### Design Goals

- **First Impressions Matter**: Landing pages that compete with top-tier SaaS
- **Trust & Credibility**: Design that conveys professionalism
- **User Delight**: Polished interactions and animations
- **Scalability**: Systems that grow with the product

---

## Design System Foundations

### Why Design Systems Matter

A design system ensures:
- **Consistency** across all screens and components
- **Speed** in development and iteration
- **Quality** through reusable, tested patterns
- **Scalability** as the product grows

### Building Your Design System

1. **Start with tokens** (colors, spacing, typography)
2. **Define components** (buttons, inputs, cards)
3. **Document everything** (when to use what)
4. **Iterate based on usage** (refine over time)

---

## Layout & Structure

### Principles

1. **Use a fixed spacing scale** (4px or 8px increments)
2. **Group related elements** together; separate unrelated ones clearly
3. **Maintain consistent vertical rhythm** between sections
4. **Add padding inside containers** — no content should touch edges
5. **Apply consistent spacing** inside all components (buttons, cards, modals)
6. **Use a uniform grid system** for alignment and rhythm
7. **Avoid overcrowding** or too many elements in a single row

### Spacing Scale (8px Base)

```typescript
// Recommended spacing scale
spacing: {
  '0': '0',
  '1': '4px',     // 0.25rem - Tight spacing
  '2': '8px',     // 0.5rem  - Base unit
  '3': '12px',    // 0.75rem - Small gaps
  '4': '16px',    // 1rem    - Standard spacing
  '5': '20px',    // 1.25rem - Medium gaps
  '6': '24px',    // 1.5rem  - Section spacing
  '8': '32px',    // 2rem    - Large gaps
  '10': '40px',   // 2.5rem  - XL gaps
  '12': '48px',   // 3rem    - Component spacing
  '16': '64px',   // 4rem    - Section breaks
  '20': '80px',   // 5rem    - Major sections
  '24': '96px',   // 6rem    - Page sections
}
```

### Container System

```css
/* Content containers for different layouts */
.container-sm  { max-width: 640px;  }  /* Forms, narrow content */
.container-md  { max-width: 768px;  }  /* Articles, blog posts */
.container-lg  { max-width: 1024px; }  /* Dashboards, main content */
.container-xl  { max-width: 1280px; }  /* Wide layouts, grids */
.container-2xl { max-width: 1536px; }  /* Full-width sections */
```

### Vertical Rhythm

```css
/* Consistent spacing between sections */
--section-spacing: 96px;      /* Between major sections */
--component-spacing: 48px;    /* Between related groups */
--element-spacing: 24px;      /* Between elements */
--compact-spacing: 12px;      /* For dense layouts */
```

### Layout Patterns

#### Hero Section
```jsx
<section className="relative overflow-hidden py-24 md:py-32">
  {/* Background gradient (optional) */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50" />

  {/* Content */}
  <div className="container-xl mx-auto px-6 relative">
    <div className="max-w-3xl">
      <h1 className="text-6xl md:text-7xl font-bold mb-6">
        Your headline here
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Supporting description text
      </p>
      {/* CTA buttons */}
    </div>
  </div>
</section>
```

#### Bento Grid (For features)
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Large feature card */}
  <div className="md:col-span-2 lg:row-span-2">
    Large feature
  </div>

  {/* Medium cards */}
  <div>Medium feature</div>
  <div>Medium feature</div>
  <div className="md:col-span-2">Wide feature</div>
</div>
```

---

## Typography

### Principles

1. **Choose one font family** with up to 3 weights (regular, medium, bold)
2. **Define a clear type scale** (e.g., 14, 16, 20, 24, 32)
3. **Use hierarchy** via size, weight, and color — not just size
4. **Keep line height comfortable** (1.4–1.6 for body)
5. **Limit body text width** to 45–75 characters (optimal reading)
6. **Use Sentence case** consistently across the UI
7. **Keep secondary text visually distinct** (lighter, smaller, or muted)
8. **Avoid all-caps or thin fonts** for long content

### Type Scale

```typescript
fontSize: {
  // Body text
  'xs':   ['0.75rem',  { lineHeight: '1.5' }],   // 12px
  'sm':   ['0.875rem', { lineHeight: '1.5' }],   // 14px
  'base': ['1rem',     { lineHeight: '1.6' }],   // 16px - Default
  'lg':   ['1.125rem', { lineHeight: '1.6' }],   // 18px

  // Headings
  'xl':  ['1.25rem',  { lineHeight: '1.4' }],    // 20px
  '2xl': ['1.5rem',   { lineHeight: '1.3' }],    // 24px
  '3xl': ['1.875rem', { lineHeight: '1.3' }],    // 30px
  '4xl': ['2.25rem',  { lineHeight: '1.2' }],    // 36px
  '5xl': ['3rem',     { lineHeight: '1.1' }],    // 48px

  // Display (for hero/marketing)
  '6xl': ['3.75rem', { lineHeight: '1.1' }],     // 60px
  '7xl': ['4.5rem',  { lineHeight: '1' }],       // 72px
  '8xl': ['6rem',    { lineHeight: '1' }],       // 96px
}

fontWeight: {
  normal:    '400',
  medium:    '500',
  semibold:  '600',
  bold:      '700',
  extrabold: '800',
}
```

### Typography Usage

```jsx
// Headlines (bold, high impact)
<h1 className="text-5xl font-bold text-gray-900">
  Main Headline
</h1>

// Section titles (semibold, clear hierarchy)
<h2 className="text-3xl font-semibold text-gray-900">
  Section Title
</h2>

// Body text (regular, readable)
<p className="text-base text-gray-700 leading-relaxed">
  Body content with good line height
</p>

// Secondary/caption text (smaller, muted)
<p className="text-sm text-gray-600">
  Supporting or secondary information
</p>

// Code/monospace (when needed)
<code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
  code snippet
</code>
```

### Reading Experience

- **Max width**: `max-w-prose` (65ch) for long-form content
- **Line height**: 1.6-1.8 for body, 1.2-1.4 for headings
- **Letter spacing**: Slightly tighter for large displays (`tracking-tight`)
- **Contrast**: Minimum 4.5:1 for body, 7:1 for headings (WCAG AA)

---

## Color & Contrast

### Principles

1. **Use a limited palette** — derive shades from base colors
2. **Keep neutral backgrounds** so accent colors stand out
3. **Maintain strong contrast** for readability and accessibility
4. **Don't rely on color alone** — pair with icons or text labels
5. **Avoid decorative or purposeless colors** and patterns
6. **Use gradients purposefully** — only when they improve clarity or aesthetics

### Color System

#### Neutral Palette (Foundation)
```typescript
colors: {
  gray: {
    0:   '#ffffff',  // Pure white
    50:  '#fafafa',  // Backgrounds
    100: '#f5f5f5',  // Subtle backgrounds
    200: '#e5e5e5',  // Borders
    300: '#d4d4d4',  // Borders (emphasized)
    400: '#a3a3a3',  // Disabled text
    500: '#737373',  // Secondary text
    600: '#525252',  // Primary text (dark mode)
    700: '#404040',  // Headings (dark mode)
    800: '#262626',  // Backgrounds (dark mode)
    900: '#171717',  // Primary text (light mode)
    950: '#0a0a0a',  // Black
  }
}
```

#### Brand Colors
```typescript
colors: {
  brand: {
    50:  '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Primary brand color
    600: '#0284c7',  // Primary hover
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  }
}
```

#### Semantic Colors
```typescript
colors: {
  success: {
    50:  '#f0fdf4',
    500: '#10b981',  // Success actions/states
    600: '#059669',  // Success hover
  },
  warning: {
    50:  '#fffbeb',
    500: '#f59e0b',  // Warning states
    600: '#d97706',
  },
  error: {
    50:  '#fef2f2',
    500: '#ef4444',  // Error states
    600: '#dc2626',
  },
  info: {
    50:  '#eff6ff',
    500: '#3b82f6',  // Info states
    600: '#2563eb',
  }
}
```

#### Accent Colors (Optional)
```typescript
colors: {
  accent: {
    purple: '#8b5cf6',
    pink:   '#ec4899',
    orange: '#f97316',
    teal:   '#14b8a6',
  }
}
```

### Gradient System

```css
/* Premium gradients */
.gradient-primary {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
}

.gradient-sunset {
  background: linear-gradient(135deg, #f97316 0%, #ec4899 100%);
}

.gradient-purple {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
}

/* Subtle background gradients */
.gradient-mesh {
  background:
    radial-gradient(at 0% 0%, rgba(14, 165, 233, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.1) 0px, transparent 50%);
}

/* Gradient text (for emphasis) */
.gradient-text {
  background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### Semantic Color Usage

```typescript
// Define semantic tokens for consistency
{
  // Text hierarchy
  'text-primary':   'gray-900',  // Main content
  'text-secondary': 'gray-600',  // Supporting text
  'text-tertiary':  'gray-500',  // Captions, labels
  'text-disabled':  'gray-400',  // Disabled state

  // Backgrounds
  'bg-primary':   'white',       // Main background
  'bg-secondary': 'gray-50',     // Subtle sections
  'bg-tertiary':  'gray-100',    // Cards, elevated

  // Borders
  'border-primary':   'gray-200',  // Default borders
  'border-secondary': 'gray-300',  // Emphasized borders
  'border-focus':     'brand-500', // Focus states

  // Actions
  'action-primary':       'brand-500',  // Primary CTAs
  'action-primary-hover': 'brand-600',
  'action-secondary':     'gray-600',   // Secondary actions
}
```

### Accessibility

- **Minimum contrast ratios**:
  - Body text: 4.5:1 (WCAG AA)
  - Large text (18px+): 3:1
  - Headings: 7:1 (WCAG AAA)
  - Interactive elements: 3:1

- **Test your colors**: Use tools like [Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Don't rely on color alone**: Always pair with text, icons, or patterns

---

## Components

### Design Principles

1. **Reuse components** — avoid one-off solutions
2. **Keep style rules consistent** (radius, shadow, spacing, casing)
3. **Design all states** — default, hover, active, disabled, focus
4. **Prioritize consistency** over novelty

### Border & Surface System

#### Border Radius
```typescript
borderRadius: {
  'none': '0',
  'sm':   '0.25rem',  // 4px  - Small elements (badges)
  'md':   '0.5rem',   // 8px  - Buttons, inputs
  'lg':   '0.75rem',  // 12px - Cards
  'xl':   '1rem',     // 16px - Large containers
  '2xl':  '1.5rem',   // 24px - Hero sections
  'full': '9999px',   // Circular
}
```

#### Shadows (Elevation System)
```typescript
boxShadow: {
  'xs':  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'sm':  '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'md':  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'lg':  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'xl':  '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Colored shadows (for emphasis)
  'brand':    '0 4px 14px 0 rgba(14, 165, 233, 0.25)',
  'brand-lg': '0 20px 40px -10px rgba(14, 165, 233, 0.3)',

  // Inset shadows (for depth)
  'inner':    'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  'inner-lg': 'inset 0 4px 8px 0 rgb(0 0 0 / 0.1)',
}
```

### Buttons

#### Principles
1. **Minimum tap/click size**: 44px height
2. **Keep button heights consistent** within a layout
3. **Clear hierarchy**: Primary, Secondary, Tertiary
4. **Subtle hover and active states** — consistent across all buttons
5. **Always include visible focus states** for keyboard users
6. **Disabled buttons** should look inactive but readable

#### Button Variants

```jsx
// Primary button - Solid, high emphasis
<button className="
  px-6 py-3
  bg-brand-500 hover:bg-brand-600
  text-white font-semibold
  rounded-lg
  shadow-md hover:shadow-lg
  transform hover:-translate-y-0.5
  transition-all duration-200
  focus:outline-none focus:ring-4 focus:ring-brand-500/20
  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
">
  Primary Action
</button>

// Secondary button - Outlined, medium emphasis
<button className="
  px-6 py-3
  border-2 border-gray-300 hover:border-brand-500
  text-gray-700 hover:text-brand-600 font-semibold
  rounded-lg
  bg-white hover:bg-gray-50
  transition-all duration-200
  focus:outline-none focus:ring-4 focus:ring-brand-500/20
">
  Secondary Action
</button>

// Tertiary/Ghost button - Text-based, low emphasis
<button className="
  px-4 py-2
  text-brand-600 hover:text-brand-700 font-medium
  hover:bg-brand-50
  rounded-lg
  transition-all duration-200
  focus:outline-none focus:ring-4 focus:ring-brand-500/20
">
  Tertiary Action
</button>

// Danger button - For destructive actions
<button className="
  px-6 py-3
  bg-red-500 hover:bg-red-600
  text-white font-semibold
  rounded-lg
  shadow-md hover:shadow-lg
  transition-all duration-200
  focus:outline-none focus:ring-4 focus:ring-red-500/20
">
  Delete
</button>
```

### Forms & Inputs

#### Principles
1. **Keep labels close** — typically above inputs
2. **Use clear, sentence-case labels** — don't rely on placeholders alone
3. **Make labels clickable** for checkboxes and radios
4. **Size inputs relative to expected content** length
5. **Indicate required fields** with symbols, not just color
6. **Provide inline hints** or format examples
7. **Show actionable error messages** inline
8. **Keep form actions aligned** and ordered consistently

#### Input Field
```jsx
<div className="space-y-2">
  <label
    htmlFor="email"
    className="block text-sm font-medium text-gray-700"
  >
    Email address
    <span className="text-red-500">*</span>
  </label>

  <input
    id="email"
    type="email"
    className="
      w-full px-4 py-3
      border border-gray-300 rounded-lg
      bg-white text-gray-900
      placeholder:text-gray-400
      focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10
      disabled:bg-gray-100 disabled:cursor-not-allowed
      transition-all duration-200
    "
    placeholder="you@example.com"
  />

  {/* Helper text */}
  <p className="text-sm text-gray-600">
    We'll never share your email
  </p>

  {/* Error state */}
  <p className="text-sm text-red-600">
    Please enter a valid email address
  </p>
</div>
```

#### Checkbox/Radio
```jsx
<label className="flex items-center gap-3 cursor-pointer">
  <input
    type="checkbox"
    className="
      w-5 h-5
      border-gray-300 rounded
      text-brand-500 focus:ring-brand-500/20
      cursor-pointer
    "
  />
  <span className="text-base text-gray-700">
    I agree to the terms and conditions
  </span>
</label>
```

### Cards

```jsx
<div className="
  group
  relative overflow-hidden
  bg-white border border-gray-200 rounded-xl
  p-6
  shadow-sm hover:shadow-lg
  hover:border-brand-500
  transition-all duration-300
">
  {/* Optional: Gradient overlay on hover */}
  <div className="
    absolute inset-0
    bg-gradient-to-br from-brand-500/0 to-purple-500/0
    group-hover:from-brand-500/5 group-hover:to-purple-500/5
    transition-all duration-300
  " />

  {/* Content */}
  <div className="relative">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      Card Title
    </h3>
    <p className="text-gray-600">
      Card description or content
    </p>
  </div>
</div>
```

### Stat Cards

```jsx
<div className="
  group
  bg-white border border-gray-200 rounded-xl
  p-6
  shadow-sm hover:shadow-lg hover:border-brand-500
  transition-all duration-300
">
  {/* Icon with colored background */}
  <div className="
    inline-flex items-center justify-center
    w-12 h-12 mb-4
    bg-brand-100 rounded-lg
  ">
    <svg className="w-6 h-6 text-brand-600">
      {/* Icon */}
    </svg>
  </div>

  {/* Label */}
  <p className="text-sm font-medium text-gray-600 mb-1">
    Total Users
  </p>

  {/* Value */}
  <p className="text-4xl font-bold text-gray-900">
    12,345
  </p>

  {/* Trend (optional) */}
  <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
    <svg className="w-4 h-4">↑</svg>
    <span>12% vs last month</span>
  </div>
</div>
```

### Navigation Header

```jsx
<header className="
  sticky top-0 z-50
  border-b border-gray-200
  bg-white/80 backdrop-blur-lg
  transition-all duration-200
">
  <div className="container-xl mx-auto px-6">
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
        <span className="text-lg font-bold text-gray-900">
          Brand
        </span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <a href="#" className="text-sm font-medium text-gray-700 hover:text-brand-600">
          Features
        </a>
        <a href="#" className="text-sm font-medium text-gray-700 hover:text-brand-600">
          Docs
        </a>
        <a href="#" className="text-sm font-medium text-gray-700 hover:text-brand-600">
          Pricing
        </a>
      </nav>

      {/* CTA */}
      <button className="px-4 py-2 bg-brand-500 text-white font-medium rounded-lg">
        Get Started
      </button>
    </div>
  </div>
</header>
```

### Icons

1. **Stick to one icon set** with consistent stroke and style (e.g., Heroicons, Lucide)
2. **Match icon size to text height** for inline icons
3. **Keep icon placement consistent** (e.g., always left of text)
4. **Avoid decorative or mixed-style icons**
5. **Use consistent stroke width** (typically 1.5px or 2px)

---

## Interactivity & States

### System States

#### Principles
1. **Design all states** — empty, loading, success, error
2. **Empty states should guide users** on what to do next
3. **Prefer skeletons or progress indicators** over spinners alone
4. **Provide immediate feedback** after any action
5. **Write specific, fixable error messages**
6. **Avoid dead ends** — always suggest the next step

#### Empty State
```jsx
<div className="
  text-center py-16
  bg-gradient-to-br from-gray-50 to-gray-100
  rounded-xl border border-gray-200
">
  {/* Icon or illustration */}
  <div className="mb-6">
    <svg className="w-24 h-24 mx-auto text-gray-400">
      {/* Empty state icon */}
    </svg>
  </div>

  {/* Message */}
  <h3 className="text-xl font-semibold text-gray-900 mb-2">
    No data yet
  </h3>
  <p className="text-gray-600 mb-6">
    Get started by creating your first item
  </p>

  {/* Action */}
  <button className="px-6 py-3 bg-brand-500 text-white font-medium rounded-lg">
    Create Item
  </button>
</div>
```

#### Loading State (Skeleton)
```jsx
<div className="space-y-4 animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
</div>

/* Add shimmer effect */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.shimmer {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```

#### Error State
```jsx
<div className="
  p-4 rounded-lg
  bg-red-50 border border-red-200
">
  <div className="flex items-start gap-3">
    <svg className="w-5 h-5 text-red-500 mt-0.5">
      {/* Error icon */}
    </svg>
    <div>
      <h4 className="text-sm font-semibold text-red-900">
        Error occurred
      </h4>
      <p className="text-sm text-red-700 mt-1">
        Specific error message with actionable steps
      </p>
      <button className="text-sm text-red-600 underline mt-2">
        Try again
      </button>
    </div>
  </div>
</div>
```

#### Success State
```jsx
<div className="
  p-4 rounded-lg
  bg-green-50 border border-green-200
">
  <div className="flex items-center gap-3">
    <svg className="w-5 h-5 text-green-500">
      {/* Checkmark icon */}
    </svg>
    <p className="text-sm font-medium text-green-900">
      Successfully saved!
    </p>
  </div>
</div>
```

### Focus States

**Always provide visible focus states** for keyboard navigation:

```css
/* Global focus styles */
button:focus-visible,
input:focus-visible,
a:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}

/* Or use ring utilities */
.focus-visible:outline-none
.focus-visible:ring-4
.focus-visible:ring-brand-500/20
```

---

## Data Presentation

### Principles

1. **Use subtle row shading or dividers** for readability
2. **Make headers stand out** through weight or background color
3. **Right-align numbers** for easy comparison
4. **Maintain consistent column widths** and row heights
5. **Keep table spacing even** across related views

### Tables

```jsx
<div className="overflow-x-auto rounded-lg border border-gray-200">
  <table className="w-full">
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Name
        </th>
        <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Amount
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Status
        </th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 text-sm text-gray-900">
          Item name
        </td>
        <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">
          $1,234.56
        </td>
        <td className="px-6 py-4 text-sm">
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Active
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Charts & Data Visualization

```jsx
// Example with Recharts
<div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
  {/* Header */}
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-lg font-semibold text-gray-900">
        Chart Title
      </h3>
      <p className="text-sm text-gray-600 mt-1">
        Supporting description
      </p>
    </div>

    <button className="text-sm text-brand-600 hover:text-brand-700">
      Export
    </button>
  </div>

  {/* Chart */}
  <div className="h-80">
    <LineChart data={data}>
      {/* Styled chart components */}
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="#e5e7eb"
        vertical={false}
      />

      <XAxis
        dataKey="month"
        stroke="#9ca3af"
        style={{ fontSize: '12px', fontWeight: 500 }}
        tickLine={false}
      />

      <YAxis
        stroke="#9ca3af"
        style={{ fontSize: '12px', fontWeight: 500 }}
        tickLine={false}
        axisLine={false}
      />

      <Tooltip content={<CustomTooltip />} />

      <Line
        type="monotone"
        dataKey="value"
        stroke="#0ea5e9"
        strokeWidth={3}
        dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  </div>
</div>
```

---

## Motion & Animations

### Principles

1. **Keep animations short** (200–300ms) and consistent
2. **Use motion to explain flow or hierarchy** — not for decoration
3. **Apply one easing and duration system** across the product
4. **Favor direct manipulation** (drag, click-to-edit) when possible
5. **Respect user preferences** (`prefers-reduced-motion`)

### Animation Timing

```typescript
// Consistent timing system
transitionDuration: {
  'fast':     '150ms',  // Micro-interactions
  'base':     '200ms',  // Default
  'medium':   '300ms',  // Noticeable transitions
  'slow':     '500ms',  // Complex animations
}

transitionTimingFunction: {
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',     // Entering
  'ease-in':  'cubic-bezier(0.4, 0, 1, 1)',     // Exiting
  'ease':     'cubic-bezier(0.4, 0, 0.2, 1)',   // Both
}
```

### Common Animations

```typescript
// Tailwind config
keyframes: {
  // Fade in
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },

  // Slide up
  'slide-up': {
    '0%': { opacity: '0', transform: 'translateY(10px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },

  // Scale in
  'scale-in': {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },

  // Shimmer (for loading states)
  'shimmer': {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
}

animation: {
  'fade-in': 'fade-in 0.3s ease-out',
  'slide-up': 'slide-up 0.3s ease-out',
  'scale-in': 'scale-in 0.2s ease-out',
  'shimmer': 'shimmer 1.5s infinite',
}
```

### Usage Examples

```jsx
// Page load (staggered fade-in)
<div
  className="animate-fade-in"
  style={{ animationDelay: `${index * 100}ms` }}
>
  Content
</div>

// Button interactions
<button className="
  transform transition-all duration-200
  hover:-translate-y-0.5 hover:shadow-lg
  active:scale-95
">
  Click me
</button>

// Card hover
<div className="
  transition-all duration-300
  hover:shadow-xl hover:-translate-y-1
">
  Card content
</div>
```

### Respect Reduced Motion

```css
/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Responsive Design

### Principles

1. **Design mobile-first**, then scale up
2. **Use flexible grids** (flex/grid) — avoid fixed widths
3. **Define clear breakpoints** (mobile, tablet, desktop)
4. **Reflow layouts intelligently** — don't just shrink
5. **Keep key actions visible** on small screens
6. **Scale typography and spacing** with relative units (`em`, `rem`)

### Breakpoints

```typescript
screens: {
  'sm':  '640px',   // Mobile landscape, small tablets
  'md':  '768px',   // Tablets
  'lg':  '1024px',  // Laptops
  'xl':  '1280px',  // Desktops
  '2xl': '1536px',  // Large desktops
}
```

### Responsive Patterns

#### Typography
```jsx
<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
  Responsive headline
</h1>
```

#### Layout
```jsx
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="flex-1">Column 1</div>
  <div className="flex-1">Column 2</div>
</div>

// Grid: 1 column mobile, 2 tablet, 3 desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>
```

#### Spacing
```jsx
// Responsive padding and margin
<div className="px-4 py-8 md:px-8 md:py-12 lg:px-12 lg:py-16">
  Content
</div>
```

#### Show/Hide
```jsx
// Hide on mobile, show on desktop
<div className="hidden md:block">
  Desktop navigation
</div>

// Show on mobile, hide on desktop
<div className="md:hidden">
  Mobile menu button
</div>
```

### Touch Optimization

- **Minimum tap target**: 44x44px (already in base styles)
- **Increase spacing** between interactive elements on mobile
- **Swipeable interfaces** for carousels and cards
- **Pull-to-refresh** for data-heavy apps
- **Avoid hover-only interactions** on touch devices

---

## Dark Mode

### Implementation Strategy

#### 1. Define Dark Mode Colors

```css
/* CSS Variables approach */
:root {
  --bg-primary: #ffffff;
  --text-primary: #171717;
  --border-primary: #e5e5e5;
}

:root.dark {
  --bg-primary: #0a0a0a;
  --text-primary: #fafafa;
  --border-primary: #262626;
}
```

#### 2. Tailwind Dark Mode

```jsx
// Using dark: variant
<div className="
  bg-white dark:bg-gray-900
  text-gray-900 dark:text-white
  border-gray-200 dark:border-gray-800
">
  Content adapts to theme
</div>
```

#### 3. Theme Toggle

```jsx
'use client';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

### Dark Mode Adjustments

- **Reduce shadow intensity** in dark mode
- **Use semi-transparent overlays** for depth
- **Adjust chart colors** for dark backgrounds
- **Test color contrast** in both modes
- **Use opacity for subtle differences** (e.g., `bg-white/5`)

---

## Performance & Polish

### Performance Optimizations

#### 1. Code Splitting
```jsx
// Dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

#### 2. Image Optimization
```jsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={800}
  placeholder="blur"
  blurDataURL="data:image/..."
  priority={isAboveFold}
  className="rounded-lg"
/>
```

#### 3. Font Optimization
```jsx
// Use next/font for automatic optimization
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});
```

#### 4. Lazy Loading
```jsx
// Lazy load below-the-fold content
<div className="lazy-load">
  {isVisible && <HeavyContent />}
</div>
```

### Polish Details

#### 1. Accessibility Checklist
- [ ] Semantic HTML elements (`<nav>`, `<main>`, `<section>`)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text for all images
- [ ] ARIA labels for icon-only buttons
- [ ] Keyboard navigation support
- [ ] Focus states for all interactive elements
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Screen reader announcements for dynamic content
- [ ] Skip to content link
- [ ] Reduced motion support

#### 2. SEO Best Practices
```jsx
// Next.js metadata
export const metadata: Metadata = {
  title: 'Your App - Description',
  description: 'Detailed description for search engines',
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    title: 'Your App',
    description: 'Description for social sharing',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

#### 3. Favicon & App Icons
```html
<!-- Complete icon set -->
<link rel="icon" type="image/x-icon" href="/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
```

#### 4. Loading Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: 90+ (all categories)
- **Bundle Size**: < 200KB (JS)

---

## Quick Reference

### Common Utility Classes

```jsx
// Layout
flex items-center justify-between
grid grid-cols-3 gap-6
container mx-auto px-6

// Spacing
p-6 px-4 py-8 mb-4 mt-8
space-y-4 gap-6

// Typography
text-2xl font-bold text-gray-900
text-sm font-medium text-gray-600
leading-relaxed tracking-tight

// Colors
bg-white text-gray-900
bg-brand-500 text-white
border-gray-200

// Borders & Shadows
border border-gray-200 rounded-lg
shadow-md hover:shadow-lg

// Transitions
transition-all duration-200
hover:scale-105 active:scale-95

// Responsive
hidden md:block
md:flex-row lg:grid-cols-3
```

### Component Checklist

When creating a component, ensure:
- [ ] All states designed (default, hover, active, disabled, focus, error)
- [ ] Responsive on all screen sizes
- [ ] Accessible (ARIA, keyboard nav, focus states)
- [ ] Consistent with design system (colors, spacing, typography)
- [ ] Animations are subtle and fast (200-300ms)
- [ ] Loading and error states included
- [ ] Dark mode variant (if applicable)

### Design Review Checklist

Before shipping:
- [ ] **Visual Quality**: Looks professional in screenshot
- [ ] **Performance**: Lighthouse 90+ in all categories
- [ ] **Accessibility**: WCAG AA compliance
- [ ] **Responsive**: Works smoothly on mobile, tablet, desktop
- [ ] **Consistency**: Follows design system throughout
- [ ] **Polish**: Micro-interactions and animations feel smooth
- [ ] **Content**: Clear, actionable copy
- [ ] **States**: All edge cases handled (empty, error, loading)

---

## Design Inspiration

### Study These Companies

- **Stripe**: Gradients, shadows, animations, documentation
- **Plaid**: Input fields, card design, trust signals
- **Linear**: Dark mode, micro-interactions, speed, polish
- **Vercel**: Landing pages, gradients, hero sections
- **Raycast**: Attention to detail, marketing pages

### Tools & Resources

**Design Tools**
- [Figma](https://figma.com) - Design and prototyping
- [Tailwind UI](https://tailwindui.com) - Component library
- [shadcn/ui](https://ui.shadcn.com) - Component library

**Color & Typography**
- [Realtime Colors](https://realtimecolors.com) - Color palette testing
- [Coolors](https://coolors.co) - Color scheme generator
- [Fonts In Use](https://fontsinuse.com) - Typography inspiration

**Accessibility**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE](https://wave.webaim.org) - Accessibility evaluation

**Learning Resources**
- [Refactoring UI](https://refactoringui.com) - Design for developers
- [Laws of UX](https://lawsofux.com) - Psychology and UX

---

## Final Thoughts

**Key Principles to Remember:**

1. **Consistency beats novelty** — stick to your design system
2. **Start simple** — you can always add complexity later
3. **Users don't notice good design** — they notice bad design
4. **Details matter** — polish separates good from great
5. **Test with real users** — assumptions can be wrong

**Recommended Implementation Order:**

1. **Design tokens** (colors, typography, spacing) — Foundation
2. **Core components** (buttons, inputs, cards) — Building blocks
3. **Layout patterns** (containers, grids) — Structure
4. **Micro-interactions** (hover states, animations) — Polish
5. **Responsive design** (mobile, tablet, desktop) — Accessibility
6. **Performance optimization** (code splitting, images) — Speed

**Ship incrementally. Iterate based on feedback. Perfect is the enemy of good.**

---

*This design guide is a living document. Update it as you learn and as your design system evolves.*
