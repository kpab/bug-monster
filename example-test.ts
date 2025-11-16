// Bug Monsters Extension - Test File
// Use this file to test the extension features

// 🔴 Spawn an Error Monster - TypeError Beast
const numberValue: number = "this is a string"; // Type error!

// 🔴 Spawn a ReferenceError Wraith
console.log(undefinedVariable); // Reference error!

// 🟡 Spawn a Warning Bug (if ESLint is enabled)
var oldStyleVariable = "use let or const instead";

// Multiple errors make monsters grow in size
const x: number = "error1";
const y: number = "error2";
const z: number = "error3";

// Fix errors to defeat the monsters!
// Example fix: const numberValue: string = "this is a string";

/*
Testing Instructions:
1. Open this file in VS Code with the Bug Monsters extension active
2. Monster icons will appear in the status bar (⚔️)
3. Click the status bar icon to open the Monster Panel
4. See the animated SVG monsters representing each error
5. Fix an error to watch the defeat animation
6. Try adding more errors to see monsters grow in size

Monster Types You'll See:
- TypeError Beast (purple): Type mismatches
- ReferenceError Wraith (blue ghost): Undefined variables
- Warning Bug (yellow): ESLint/compiler warnings

Tips:
- Hover over monsters in the panel to see error details
- Click a monster card to jump to the error location
- Use "Clear All Monsters" button to reset
*/
