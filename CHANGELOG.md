# Change Log

All notable changes to the Bug Monsters extension will be documented in this file.

## [0.3.0] - 2024-11-16

### Added
- **Battlefield Layout**: All monsters now appear in a single shared battlefield space
  - Absolute positioning allows monsters to overlap naturally
  - Dark atmospheric background with gradients and inner shadows
  - 10 predefined positions distributed across the battlefield
  - 600px minimum height for epic monster battles
  - Semi-transparent monster cards with backdrop blur
- **Size-Specific SVG Variants**: XL monsters get special scary designs
  - error-xl.svg: Massive version with extra spikes, fangs, and claws
  - typeerror-xl.svg: Enlarged purple beast variant
  - referenceerror-xl.svg: Larger ghostly wraith
  - warning-xl.svg: Bigger bug variant
  - 10+ errors now spawn significantly more menacing monsters

### Removed
- **Clear All Monsters functionality**: Removed to keep focus on fixing bugs
  - Removed `clearAll` command from package.json
  - Removed clearAll button from monster panel
  - Monsters can only be defeated by fixing the actual bugs

### Changed
- Panel title updated to "Bug Monsters Battlefield"
- Defeat animation enhanced to 720° rotation
- Monster card sizes adjusted: S=130px, M=170px, L=210px, XL=250px
- Hover effect changed from translateY to scale(1.15) for better battlefield feel

### Technical
- Added `getMonsterPosition()` method for battlefield positioning
- Updated `getMonsterSvgUri()` to support size-specific SVG files
- Refactored `getMonsterHtml()` to accept position parameter

## [0.2.0] - 2024-11-16

### Added
- **Animated SVG Monsters**: Custom-designed SVG monsters for each error type
  - Error Monster: Red aggressive creature
  - TypeError Beast: Purple horned beast
  - ReferenceError Wraith: Blue ghostly wraith
  - Warning Bug: Yellow buzzing insect
  - Hint Spirit: Green glowing fairy
- **Enhanced Animations**: Sophisticated CSS animations
  - Breathing idle animation
  - Angry shake for error monsters
  - Spawn explosion effect
  - Improved defeat animation with blur and rotation
  - Power-up animation when monsters grow
- **Improved UI**: Better monster panel design
  - SVG monsters instead of emojis
  - Size-based scaling
  - Hover effects with elevation
  - Click to navigate to error location

### Changed
- **English-Only Interface**: All UI text converted to English
- **Better Status Bar**: Updated icons and tooltips
- **Enhanced Styling**: Improved visual design with drop shadows and glows

### Technical
- Refactored monster rendering to use SVG images
- Added webview URI handling for SVG assets
- Improved CSS with advanced animations
- Enhanced defeat animation timing and effects

## [0.1.0] - 2024-11-16

### Initial Release
- Real-time diagnostics monitoring
- Monster spawning system
- Monster classification (Error, TypeError, ReferenceError, Warning, Hint)
- Size-based scaling (S/M/L/XL)
- Webview panel UI
- Status bar integration
- Basic defeat animations
- Configuration settings
- Commands: toggle, openPanel
- Basic CSS animations

## [Unreleased]

### Planned Features
- Sound effects for spawn/defeat
- Persistent defeat history
- Daily/weekly reports
- Achievement system
- More monster themes (cyber, cute)
- Custom monster designs
- Multi-language support (optional)
