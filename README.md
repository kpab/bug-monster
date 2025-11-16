# 👹 Bug Monsters - バグの可視化モンスター拡張

VS Code の Diagnostics（エラー・警告）情報をもとに、**バグをモンスターとして可視化**するエンタメ系拡張機能です。

## ✨ 特徴

- 🐛 **エラーをモンスター化**: エラーが発生すると画面にモンスターが出現
- ⚔️ **討伐アニメーション**: バグを修正するとモンスターが倒れるアニメーションが再生
- 📊 **リアルタイム監視**: VS Code の Diagnostics をリアルタイムで監視
- 🎮 **ゲーム的体験**: デバッグをゲーム感覚で楽しく
- 🎨 **カスタマイズ可能**: テーマやアニメーション速度を設定可能

## 🎯 使い方

### インストール

1. このリポジトリをクローン
2. `npm install` で依存関係をインストール
3. VS Code で F5 を押して拡張機能デバッグモードで起動

### 基本操作

1. **モンスターの出現**: コードにエラーや警告があると自動的にモンスターが出現します
2. **パネルを開く**: ステータスバーのモンスターアイコンをクリックするか、コマンドパレット（Ctrl/Cmd+Shift+P）から「Bug Monsters: Open Monster Panel」を実行
3. **モンスター討伐**: エラーを修正するとモンスターが倒れます
4. **全削除**: 「Bug Monsters: Clear All Monsters」コマンドで全モンスターを強制討伐

## 👾 モンスターの種類

| モンスター | 対応 | アイコン | 説明 |
|---------|------|---------|------|
| **Error Monster** | エラー | 👾 | 一般的なエラー |
| **TypeError Beast** | TypeError | 🦖 | 型エラー専用の巨獣 |
| **ReferenceError Wraith** | ReferenceError | 👻 | 参照エラーの亡霊 |
| **Warning Bug** | 警告 | 🐛 | 警告の小さな虫 |
| **Hint Spirit** | ヒント | 💡 | ヒントの光る精霊 |

## 🎨 モンスターのサイズ

モンスターはエラーの数に応じてサイズが変化します：

- **S サイズ**: 1〜2 件
- **M サイズ**: 3〜5 件
- **L サイズ**: 6〜9 件
- **XL サイズ**: 10 件以上

## ⚙️ 設定

設定画面（Settings）または `settings.json` で以下の設定が可能です：

```json
{
  // 拡張機能の有効/無効
  "bugMonsters.enable": true,

  // 最大モンスター表示数
  "bugMonsters.maxMonsters": 5,

  // 警告でもモンスターを表示
  "bugMonsters.showOnWarnings": true,

  // アニメーション速度（slow/normal/fast）
  "bugMonsters.animationSpeed": "normal",

  // モンスターテーマ（fantasy/cyber/cute）
  "bugMonsters.monsterTheme": "fantasy"
}
```

## 🎮 コマンド

拡張機能では以下のコマンドが利用できます：

- `Bug Monsters: Toggle Enable/Disable` - 拡張機能の有効/無効を切り替え
- `Bug Monsters: Open Monster Panel` - モンスターパネルを開く
- `Bug Monsters: Clear All Monsters` - すべてのモンスターを強制討伐

## 🏗️ アーキテクチャ

```
src/
├── extension.ts              # 拡張機能のエントリーポイント
├── types.ts                  # TypeScript 型定義
├── monsterManager.ts         # モンスターの状態管理
├── diagnosticsWatcher.ts     # Diagnostics 監視
└── ui/
    ├── panelView.ts          # Webview パネル
    └── webviewAssets/
        ├── effects/
        │   └── styles.css    # アニメーション CSS
        ├── monsters/         # モンスター画像（将来的に SVG 追加予定）
        └── scripts/          # Webview 用スクリプト
```

## 🧪 テスト方法

1. VS Code で本プロジェクトを開く
2. F5 を押してデバッグモードで起動
3. 新しい VS Code ウィンドウが開く
4. テスト用のファイルを作成し、意図的にエラーを入れてみる：

```typescript
// test.ts
const x: number = "string"; // TypeError が発生
console.log(undefinedVariable); // ReferenceError が発生
```

5. ステータスバーにモンスターアイコンが表示されることを確認
6. アイコンをクリックしてパネルを開く
7. エラーを修正してモンスターが消えることを確認

## 📝 開発状況

### ✅ 実装済み

- [x] 基本的な拡張機能構造
- [x] Diagnostics 監視機能
- [x] モンスター状態管理
- [x] Webview パネル UI
- [x] ステータスバー表示
- [x] 設定項目
- [x] コマンド実装
- [x] CSS アニメーション

### 🚧 今後の予定

- [ ] カスタム SVG モンスター画像
- [ ] より詳細なアニメーション
- [ ] 討伐履歴の永続化
- [ ] 日次レポート機能
- [ ] サウンドエフェクト
- [ ] マルチテーマ対応の強化

## 🤝 貢献

プルリクエストを歓迎します！バグ報告や機能リクエストは Issue でお願いします。

## 📄 ライセンス

MIT License

## 🎉 クレジット

このプロジェクトは、開発者のデバッグ体験をより楽しくすることを目指して作成されました。

---

**Happy Bug Hunting! 👹⚔️**
