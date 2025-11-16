# Change Log

All notable changes to the Bug Monsters extension will be documented in this file.

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
- Commands: toggle, openPanel, clearAll
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
