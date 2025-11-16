# ⚔️ Bug Monsters

> Transform your debugging experience! Watch as your bugs and errors manifest as animated monsters that you must defeat by fixing your code.

Bug Monsters is a VS Code extension that gamifies the debugging process by visualizing diagnostics (errors, warnings, and hints) as animated monster creatures. Fix your bugs to defeat the monsters!

## ✨ Features

- **🎨 Animated SVG Monsters**: Beautiful, custom-designed monsters for each error type
- **⚡ Real-time Monitoring**: Instantly spawns monsters when errors appear
- **⚔️ Defeat Animations**: Satisfying animations when you fix bugs
- **📊 Live Statistics**: Track errors, warnings, and defeated monsters
- **🎮 Size Progression**: Monsters grow larger as errors accumulate
- **🎯 Click to Navigate**: Click any monster to jump to the error in your code

## 👾 Monster Types

| Monster | Trigger | Description |
|---------|---------|-------------|
| **Error Monster** | General errors | Aggressive red creature with fangs and claws |
| **TypeError Beast** | Type errors | Large purple beast with horns |
| **ReferenceError Wraith** | Reference errors | Ghostly blue semi-transparent wraith |
| **Warning Bug** | Warnings | Small yellow buzzing bug |
| **Hint Spirit** | Hints | Friendly green glowing spirit |

## 📐 Monster Sizes

Monsters grow based on the number of issues:

- **S Size**: 1-2 issues
- **M Size**: 3-5 issues
- **L Size**: 6-9 issues
- **XL Size**: 10+ issues (extra angry!)

## 🚀 Getting Started

### Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Press `F5` in VS Code to launch the extension in debug mode
4. A new VS Code window will open with the extension loaded

### Usage

1. **Monsters Spawn**: Errors and warnings automatically spawn monsters
2. **View Panel**: Click the sword icon (⚔️) in the status bar to open the Monster Panel
3. **Defeat Monsters**: Fix your bugs to see the defeat animation
4. **Clear All**: Use the "Clear All Monsters" button or command to reset

## 🎮 Commands

Access these via the Command Palette (`Ctrl/Cmd+Shift+P`):

- `Bug Monsters: Toggle Enable/Disable` - Turn the extension on/off
- `Bug Monsters: Open Monster Panel` - View all active monsters
- `Bug Monsters: Clear All Monsters` - Defeat all monsters instantly

## ⚙️ Configuration

Customize Bug Monsters in your VS Code settings:

```json
{
  // Enable or disable the extension
  "bugMonsters.enable": true,

  // Maximum number of monsters to display simultaneously
  "bugMonsters.maxMonsters": 5,

  // Show monsters for warnings
  "bugMonsters.showOnWarnings": true,

  // Animation speed (slow/normal/fast)
  "bugMonsters.animationSpeed": "normal",

  // Visual theme (fantasy/cyber/cute)
  "bugMonsters.monsterTheme": "fantasy"
}
```

## 🧪 Testing

Want to see the extension in action?

1. Open the included `example-test.ts` file
2. You'll see type errors and reference errors
3. Monsters will appear in the status bar
4. Click the status bar to open the Monster Panel
5. Fix errors to watch monsters get defeated!

Example error code:
```typescript
const numberValue: number = "this is a string"; // Spawns TypeError Beast!
console.log(undefinedVariable); // Spawns ReferenceError Wraith!
```

## 🏗️ Architecture

```
src/
├── extension.ts              # Extension entry point
├── types.ts                  # TypeScript type definitions
├── monsterManager.ts         # Monster state management
├── diagnosticsWatcher.ts     # VS Code diagnostics monitoring
└── ui/
    ├── panelView.ts          # Webview panel implementation
    └── webviewAssets/
        ├── effects/
        │   └── styles.css    # Animation CSS
        └── monsters/         # SVG monster designs
            ├── error.svg
            ├── typeerror.svg
            ├── referenceerror.svg
            ├── warning.svg
            └── hint.svg
```

## 🎨 Monster Animations

Each monster features sophisticated SVG animations:

- **Idle Breathing**: Subtle breathing animation
- **Angry Shake**: Error monsters shake aggressively
- **Floating**: Gentle up-and-down movement
- **Spawn Explosion**: Dramatic entrance when appearing
- **Defeat Fade**: Spectacular exit when bugs are fixed
- **Growing Power-Up**: Flash and grow when errors increase

## 📝 Development

### Requirements

- VS Code 1.85.0 or higher
- Node.js and npm
- TypeScript 5.3+

### Build

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch
```

### Debug

1. Open the project in VS Code
2. Press `F5` to launch Extension Development Host
3. Test your changes in the new window

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- [ ] Add more monster designs
- [ ] Implement sound effects
- [ ] Create daily/weekly defeat reports
- [ ] Add achievement system
- [ ] Support for more diagnostic types
- [ ] Custom monster themes

## 📜 License

MIT License - See LICENSE file for details

## 🎉 Credits

Created to make debugging more engaging and fun. Because fixing bugs should feel like an epic battle!

---

**Happy Monster Hunting!** ⚔️👾

*Made with ❤️ for developers who want to turn debugging into an adventure*
