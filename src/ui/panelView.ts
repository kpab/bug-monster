import * as vscode from 'vscode';
import * as path from 'path';
import { MonsterManager } from '../monsterManager';
import { Monster, MonsterDefeatEvent } from '../types';

export class MonsterPanelView {
    public static currentPanel: MonsterPanelView | undefined;
    private readonly panel: vscode.WebviewPanel;
    private disposables: vscode.Disposable[] = [];

    private constructor(
        panel: vscode.WebviewPanel,
        private readonly extensionUri: vscode.Uri,
        private readonly monsterManager: MonsterManager
    ) {
        this.panel = panel;

        // Set up panel content
        this.update();

        // Handle panel dispose
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

        // Listen to monster changes
        this.monsterManager.onMonsterChange(() => {
            this.update();
        });

        this.monsterManager.onMonsterDefeat((event) => {
            this.handleDefeat(event);
        });

        // Handle messages from the webview
        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'clearAll':
                        this.monsterManager.clearAll();
                        break;
                    case 'openFile':
                        this.openFile(message.uri);
                        break;
                }
            },
            null,
            this.disposables
        );
    }

    public static createOrShow(extensionUri: vscode.Uri, monsterManager: MonsterManager) {
        const column = vscode.ViewColumn.Two;

        // If we already have a panel, show it
        if (MonsterPanelView.currentPanel) {
            MonsterPanelView.currentPanel.panel.reveal(column);
            return;
        }

        // Create new panel
        const panel = vscode.window.createWebviewPanel(
            'bugMonstersPanel',
            'Bug Monsters',
            column,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'out'),
                    vscode.Uri.joinPath(extensionUri, 'src', 'ui', 'webviewAssets')
                ]
            }
        );

        MonsterPanelView.currentPanel = new MonsterPanelView(panel, extensionUri, monsterManager);
    }

    private update() {
        const config = vscode.workspace.getConfiguration('bugMonsters');
        const theme = config.get<string>('monsterTheme', 'fantasy');
        const animationSpeed = config.get<string>('animationSpeed', 'normal');

        this.panel.webview.html = this.getHtmlContent(theme, animationSpeed);
    }

    private handleDefeat(event: MonsterDefeatEvent) {
        this.panel.webview.postMessage({
            command: 'defeatMonster',
            monsterId: event.monsterId,
            type: event.type,
            count: event.count
        });
    }

    private openFile(uriString: string) {
        const uri = vscode.Uri.parse(uriString);
        vscode.window.showTextDocument(uri);
    }

    private getHtmlContent(theme: string, animationSpeed: string): string {
        const monsters = this.monsterManager.getMonsters();
        const stats = this.monsterManager.getTotalStats();

        const webview = this.panel.webview;
        const styleUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this.extensionUri, 'src', 'ui', 'webviewAssets', 'effects', 'styles.css')
        );

        const monstersHtml = monsters.map(m => this.getMonsterHtml(m, theme)).join('');

        return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bug Monsters</title>
    <link rel="stylesheet" href="${styleUri}">
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
        }
        .header {
            border-bottom: 2px solid var(--vscode-panel-border);
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        .stat-item {
            padding: 10px 15px;
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 5px;
        }
        .monsters-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .monster-card {
            border: 1px solid var(--vscode-panel-border);
            border-radius: 8px;
            padding: 15px;
            background-color: var(--vscode-sideBar-background);
            transition: transform 0.2s;
            cursor: pointer;
        }
        .monster-card:hover {
            transform: scale(1.05);
        }
        .monster-card.defeated {
            opacity: 0;
            transform: scale(0.5) rotate(180deg);
            transition: all 1s ease-out;
        }
        .monster-icon {
            font-size: 60px;
            text-align: center;
            margin-bottom: 10px;
            animation: float 3s ease-in-out infinite;
        }
        .monster-info {
            text-align: center;
        }
        .monster-type {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .monster-size {
            color: var(--vscode-descriptionForeground);
            font-size: 0.9em;
        }
        .monster-count {
            background-color: var(--vscode-errorForeground);
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 0.85em;
            margin-top: 5px;
            display: inline-block;
        }
        .actions {
            margin-top: 20px;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
        .empty-state {
            text-align: center;
            padding: 40px;
            color: var(--vscode-descriptionForeground);
        }
        .empty-state-icon {
            font-size: 80px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>👹 Bug Monsters</h1>
        <p>モンスターを倒してバグを退治しよう！</p>
    </div>

    <div class="stats">
        <div class="stat-item">
            🔴 Errors: ${stats.errors}
        </div>
        <div class="stat-item">
            🟡 Warnings: ${stats.warnings}
        </div>
        <div class="stat-item">
            ✅ Defeated: ${stats.defeated}
        </div>
    </div>

    <div class="actions">
        <button onclick="clearAllMonsters()">🧹 Clear All</button>
    </div>

    <div class="monsters-container" id="monsters">
        ${monsters.length === 0 ? `
            <div class="empty-state">
                <div class="empty-state-icon">🎉</div>
                <h2>No monsters here!</h2>
                <p>すべてのバグが退治されました。コードはクリーンです！</p>
            </div>
        ` : monstersHtml}
    </div>

    <script>
        const vscode = acquireVsCodeApi();

        function clearAllMonsters() {
            vscode.postMessage({ command: 'clearAll' });
        }

        function openFile(uri) {
            vscode.postMessage({ command: 'openFile', uri: uri });
        }

        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.command) {
                case 'defeatMonster':
                    const monsterCard = document.getElementById(message.monsterId);
                    if (monsterCard) {
                        monsterCard.classList.add('defeated');
                    }
                    break;
            }
        });
    </script>
</body>
</html>`;
    }

    private getMonsterHtml(monster: Monster, theme: string): string {
        const icon = this.getMonsterIcon(monster.type, monster.size, theme);
        const typeLabel = this.getTypeLabel(monster.type);
        const fileName = path.basename(monster.uri);

        return `
        <div class="monster-card" id="${monster.id}" onclick="openFile('${monster.uri}')">
            <div class="monster-icon">${icon}</div>
            <div class="monster-info">
                <div class="monster-type">${typeLabel}</div>
                <div class="monster-size">Size: ${monster.size}</div>
                <div class="monster-count">${monster.count} issues</div>
                <div class="monster-file" style="font-size: 0.8em; color: var(--vscode-descriptionForeground); margin-top: 5px;">
                    📄 ${fileName}
                </div>
            </div>
        </div>`;
    }

    private getMonsterIcon(type: string, size: string, theme: string): string {
        const sizeMultiplier = { S: 1, M: 1.2, L: 1.5, XL: 2 };

        const icons: Record<string, string> = {
            'error': '👾',
            'warning': '🐛',
            'hint': '💡',
            'typeError': '🦖',
            'referenceError': '👻'
        };

        return icons[type] || '👹';
    }

    private getTypeLabel(type: string): string {
        const labels: Record<string, string> = {
            'error': 'Error Monster',
            'warning': 'Warning Bug',
            'hint': 'Hint Spirit',
            'typeError': 'TypeError Beast',
            'referenceError': 'ReferenceError Wraith'
        };

        return labels[type] || 'Unknown Monster';
    }

    public dispose() {
        MonsterPanelView.currentPanel = undefined;

        this.panel.dispose();

        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
}
