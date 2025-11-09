# UI Design Guide

**Purpose**: Practical guide to build professional UIs.

**Use this for**: Any web project.

---

## 1. Spacing

**Rule**: Use 8px as your base unit.

**Scale**:
```
4px  → Tight (icons, borders)
8px  → Base (small gaps)
16px → Standard (between elements)
24px → Large (between groups)
48px → Section breaks
96px → Between major sections
```

**How to use**:
- Padding inside components: 16px or 24px
- Gap between elements: 8px or 16px
- Margin between sections: 48px or 96px
- Keep it consistent everywhere

**Example**:
```jsx
<div className="p-6 space-y-4">  {/* 24px padding, 16px gaps */}
  <h2>Title</h2>
  <p>Content</p>
</div>
```

---

## 2. Typography

**Rule**: One font. Three weights max.

**Recommended**: System fonts (fast, free)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Type scale** (use these sizes only):
```
12px → Captions, labels
14px → Secondary text
16px → Body text (default)
20px → Small headings
24px → Medium headings
32px → Large headings
48px → Hero text
```

**Weights**:
- 400 (normal) → Body text
- 600 (semibold) → Emphasis
- 700 (bold) → Headings

**Line height**:
- Body: 1.6
- Headings: 1.2

**Max width for reading**: 65 characters (use `max-w-prose`)

**Example**:
```jsx
<h1 className="text-5xl font-bold">Main Heading</h1>
<h2 className="text-3xl font-semibold">Section Title</h2>
<p className="text-base leading-relaxed">Body text here.</p>
<p className="text-sm text-gray-600">Secondary info</p>
```

---

## 3. Colors

**Rule**: Start with gray. Add one brand color. Add semantic colors.

**Gray scale** (use for most UI):
```typescript
gray: {
  50:  '#fafafa',  // Subtle backgrounds
  200: '#e5e5e5',  // Borders
  500: '#737373',  // Secondary text
  900: '#171717',  // Primary text
}
```

**Brand color** (pick one):
```typescript
brand: {
  50:  '#f0f9ff',  // Light backgrounds
  500: '#0ea5e9',  // Main color
  600: '#0284c7',  // Hover state
}
```

**Semantic colors**:
```typescript
success: '#10b981',  // Green
error:   '#ef4444',  // Red
warning: '#f59e0b',  // Yellow
```

**Usage**:
- Background: white or gray-50
- Text: gray-900 (main), gray-600 (secondary)
- Borders: gray-200
- Primary actions: brand-500
- Hover: brand-600

**Contrast**: Minimum 4.5:1 for text (use [WebAIM checker](https://webaim.org/resources/contrastchecker/))

**Example**:
```jsx
<div className="bg-white border-gray-200 text-gray-900">
  <button className="bg-brand-500 hover:bg-brand-600 text-white">
    Click me
  </button>
</div>
```

---

## 4. Shadows

**Rule**: Use 3 levels max.

**Levels**:
```typescript
shadow-sm  → '0 1px 2px rgba(0,0,0,0.05)'      // Subtle cards
shadow-md  → '0 4px 6px rgba(0,0,0,0.1)'       // Default elevation
shadow-lg  → '0 10px 15px rgba(0,0,0,0.1)'     // Hover state
```

**When to use**:
- Cards: `shadow-sm`
- Modals/dropdowns: `shadow-lg`
- Buttons on hover: `shadow-md` → `shadow-lg`

**Dark mode**: Reduce shadow opacity by 50%

---

## 5. Border Radius

**Rule**: Pick 2-3 values. Use them consistently.

**Recommended**:
```typescript
rounded-md  → 8px   // Buttons, inputs
rounded-lg  → 12px  // Cards
rounded-xl  → 16px  // Large containers
```

**Example**:
```jsx
<button className="rounded-md">Button</button>
<div className="rounded-lg">Card</div>
```

---

## 6. Buttons

**Rule**: 3 variants. Clear hierarchy.

### Primary
Main actions. Use once per screen.

```jsx
<button className="
  px-6 py-3
  bg-brand-500 hover:bg-brand-600
  text-white font-semibold
  rounded-lg shadow-md
  transition-all duration-200
">
  Primary Action
</button>
```

### Secondary
Less important actions.

```jsx
<button className="
  px-6 py-3
  border-2 border-gray-300 hover:border-brand-500
  text-gray-700 hover:text-brand-600
  rounded-lg
  transition-all duration-200
">
  Secondary Action
</button>
```

### Ghost
Subtle actions.

```jsx
<button className="
  px-4 py-2
  text-brand-600 hover:bg-brand-50
  rounded-lg
  transition-all duration-200
">
  Ghost Action
</button>
```

**All buttons**:
- Min height: 44px (for touch)
- Include focus state
- Disable with `opacity-50 cursor-not-allowed`

---

## 7. Forms

**Rules**:
- Labels above inputs
- Clear focus states
- Show errors inline
- Mark required fields with *

**Input**:
```jsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Email <span className="text-red-500">*</span>
  </label>

  <input
    type="email"
    className="
      w-full px-4 py-3
      border border-gray-300 rounded-lg
      focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10
      transition-all duration-200
    "
    placeholder="you@example.com"
  />

  {/* Error */}
  <p className="text-sm text-red-600">Invalid email</p>

  {/* Helper */}
  <p className="text-sm text-gray-600">We won't spam you</p>
</div>
```

**Checkbox**:
```jsx
<label className="flex items-center gap-3 cursor-pointer">
  <input type="checkbox" className="w-5 h-5" />
  <span>I agree to terms</span>
</label>
```

---

## 8. Cards

**Rule**: White background. Subtle border. Shadow on hover.

```jsx
<div className="
  bg-white
  border border-gray-200
  rounded-lg
  p-6
  shadow-sm hover:shadow-lg
  transition-all duration-300
">
  <h3 className="text-xl font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

**With hover lift**:
```jsx
className="hover:-translate-y-1"
```

---

## 9. Layout

**Container widths**:
```css
640px  → Forms, narrow content
768px  → Blog posts
1024px → Dashboards (recommended)
1280px → Wide layouts
```

**Center content**:
```jsx
<div className="container mx-auto px-6 max-w-4xl">
  {/* Content */}
</div>
```

**Grid patterns**:
```jsx
{/* 1 column mobile, 3 desktop */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

{/* Stack mobile, side-by-side desktop */}
<div className="flex flex-col md:flex-row gap-4">
```

---

## 10. Responsive Design

**Breakpoints**:
```
sm:  640px  → Phone landscape
md:  768px  → Tablet
lg:  1024px → Laptop
xl:  1280px → Desktop
```

**Mobile first**: Start with mobile, add `md:` and `lg:` for larger screens.

**Patterns**:
```jsx
{/* Responsive text */}
<h1 className="text-4xl md:text-6xl">

{/* Hide on mobile */}
<div className="hidden md:block">Desktop only</div>

{/* Show on mobile only */}
<div className="md:hidden">Mobile only</div>

{/* Responsive padding */}
<div className="px-4 md:px-8 lg:px-12">
```

**Touch targets**: Min 44px height/width on mobile

---

## 11. States

Design these for every component:

### Empty State
```jsx
<div className="text-center py-16">
  <svg className="w-24 h-24 mx-auto text-gray-400 mb-4">
    {/* Icon */}
  </svg>
  <h3 className="text-xl font-semibold mb-2">No data yet</h3>
  <p className="text-gray-600 mb-6">Get started by adding an item</p>
  <button>Add Item</button>
</div>
```

### Loading State
```jsx
{/* Skeleton */}
<div className="space-y-3 animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>

{/* Spinner */}
<div className="flex justify-center">
  <div className="animate-spin h-8 w-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
</div>
```

### Error State
```jsx
<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
  <div className="flex gap-3">
    <svg className="w-5 h-5 text-red-500">!</svg>
    <div>
      <h4 className="font-semibold text-red-900">Error</h4>
      <p className="text-sm text-red-700">Something went wrong. Try again.</p>
    </div>
  </div>
</div>
```

### Success State
```jsx
<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
  <div className="flex gap-3">
    <svg className="w-5 h-5 text-green-500">✓</svg>
    <p className="text-sm font-medium text-green-900">Saved successfully!</p>
  </div>
</div>
```

---

## 12. Animations

**Rule**: Fast. Subtle. Purposeful.

**Timing**:
- 150ms → Micro-interactions (button hover)
- 200ms → Standard (most transitions)
- 300ms → Noticeable (modal open)

**Easing**: Use `ease-out` for entering, `ease-in` for exiting

**Common animations**:

```css
/* Fade in */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

**Usage**:
```jsx
{/* Button hover */}
<button className="transition-all duration-200 hover:-translate-y-0.5">

{/* Card entrance */}
<div className="animate-fade-in">

{/* Stagger list items */}
<div
  className="animate-slide-up"
  style={{ animationDelay: `${index * 100}ms` }}
>
```

**Respect user preference**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 13. Dark Mode

**Setup** (using next-themes):

```jsx
// 1. Wrap app with ThemeProvider
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class">
  {children}
</ThemeProvider>

// 2. Add toggle button
'use client';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

// 3. Update components
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

**Tips**:
- Reduce shadow opacity in dark mode
- Use `bg-white/5` for subtle surfaces
- Test contrast in both modes

---

## 14. Icons

**Rules**:
- Use one icon set (Heroicons, Lucide)
- Match icon size to text height
- Keep stroke width consistent (2px)
- Align icons left of text

**Usage**:
```jsx
import { ChartBarIcon } from '@heroicons/react/24/outline'

<div className="flex items-center gap-2">
  <ChartBarIcon className="w-5 h-5" />
  <span>Analytics</span>
</div>
```

**Icon-only buttons**: Add `aria-label`
```jsx
<button aria-label="Close">
  <XIcon className="w-5 h-5" />
</button>
```

---

## 15. Tables

**Structure**:
```jsx
<table className="w-full">
  <thead className="bg-gray-50 border-b border-gray-200">
    <tr>
      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
        Name
      </th>
      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
        Amount
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-200">
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-900">Item</td>
      <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">$1,234</td>
    </tr>
  </tbody>
</table>
```

**Rules**:
- Right-align numbers
- Use monospace font for numbers
- Add hover state to rows
- Keep header sticky for long tables

---

## 16. Charts

**Styling** (using Recharts):

```jsx
<LineChart data={data}>
  <CartesianGrid
    strokeDasharray="3 3"
    stroke="#e5e5e5"
    vertical={false}
  />

  <XAxis
    dataKey="month"
    stroke="#9ca3af"
    style={{ fontSize: 12 }}
    tickLine={false}
  />

  <YAxis
    stroke="#9ca3af"
    style={{ fontSize: 12 }}
    tickLine={false}
    axisLine={false}
  />

  <Tooltip content={<CustomTooltip />} />

  <Line
    type="monotone"
    dataKey="value"
    stroke="#0ea5e9"
    strokeWidth={3}
    dot={{ fill: '#0ea5e9', r: 4 }}
  />
</LineChart>
```

**Custom tooltip**:
```jsx
function CustomTooltip({ active, payload, label }) {
  if (!active) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-lg font-bold text-brand-600">{payload[0].value}</p>
    </div>
  );
}
```

---

## 17. Accessibility

**Checklist**:
- [ ] Semantic HTML (`<nav>`, `<main>`, `<button>`)
- [ ] Heading hierarchy (h1 → h2 → h3)
- [ ] Alt text for images
- [ ] Labels for form inputs
- [ ] ARIA labels for icon buttons
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Focus states visible
- [ ] Color contrast 4.5:1 minimum
- [ ] Skip to content link

**Focus states**:
```css
button:focus-visible,
input:focus-visible {
  outline: 2px solid #0ea5e9;
  outline-offset: 2px;
}
```

**Skip link**:
```jsx
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to content
</a>
```

---

## 18. Performance

**Code splitting**:
```jsx
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton />,
  ssr: false,
});
```

**Image optimization**:
```jsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={1200}
  height={800}
  alt="Hero"
  priority  // Above fold only
/>
```

**Font optimization**:
```jsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

**Targets**:
- Lighthouse score: 90+
- First paint: < 1.5s
- Bundle size: < 200KB

---

## Quick Reference

### Spacing
```
gap-2  → 8px
gap-4  → 16px
gap-6  → 24px
p-6    → 24px padding
py-24  → 96px vertical
```

### Text
```
text-sm     → 14px
text-base   → 16px
text-xl     → 20px
text-4xl    → 36px
font-semibold → 600
font-bold   → 700
```

### Colors
```
text-gray-600      → Secondary text
text-gray-900      → Primary text
bg-white           → Background
bg-brand-500       → Brand color
border-gray-200    → Borders
```

### Layout
```
container mx-auto px-6
max-w-4xl
grid grid-cols-1 md:grid-cols-3 gap-6
flex items-center justify-between
```

### Responsive
```
sm:  → Phone landscape (640px)
md:  → Tablet (768px)
lg:  → Laptop (1024px)
```

---

## Checklist Before Shipping

### Visual
- [ ] Consistent spacing throughout
- [ ] Readable text (16px+ for body)
- [ ] Clear visual hierarchy
- [ ] Professional look in screenshots

### Functional
- [ ] Works on mobile
- [ ] Fast loading (< 3s)
- [ ] Keyboard navigable
- [ ] Error states handled

### Polish
- [ ] All images have alt text
- [ ] Meta tags added
- [ ] Favicon added
- [ ] Loading states smooth

---

## Tools

**Design**:
- [Figma](https://figma.com) - Mockups
- [Tailwind UI](https://tailwindui.com) - Components
- [Heroicons](https://heroicons.com) - Icons

**Colors**:
- [Coolors](https://coolors.co) - Palettes
- [Contrast Checker](https://webaim.org/resources/contrastchecker/) - A11y

**Testing**:
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance
- [WAVE](https://wave.webaim.org) - Accessibility

---

## Summary

**Good design is**:
1. Simple
2. Consistent
3. Fast
4. Accessible

**Start with**:
1. Gray colors
2. System fonts
3. 8px spacing
4. Basic components

**Add later**:
1. Brand colors
2. Custom fonts
3. Animations
4. Advanced features

**Remember**: Ship fast. Iterate. Perfect is the enemy of done.
