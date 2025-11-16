// Bug Monsters Extension - Test File
// このファイルで拡張機能をテストできます

// 🔴 Error Monster - TypeError Beast を召喚
const numberValue: number = "this is a string"; // Type error!

// 🔴 Error Monster - ReferenceError Wraith を召喚
console.log(undefinedVariable); // Reference error!

// 🟡 Warning Bug を召喚（ESLint が有効な場合）
var oldStyleVariable = "use let or const instead";

// 複数のエラーでモンスターがサイズアップ
const x: number = "error1";
const y: number = "error2";
const z: number = "error3";

// エラーを修正してモンスターを討伐！
// 例: const numberValue: string = "this is a string";

/*
テスト手順:
1. VS Code でこのファイルを開く
2. ステータスバーにモンスターアイコンが表示される
3. アイコンをクリックして Monster Panel を開く
4. エラーを修正してモンスターが倒れるアニメーションを確認
*/
