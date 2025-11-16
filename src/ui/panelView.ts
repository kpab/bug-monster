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

        const monstersHtml = monsters.map(m => this.getMonsterHtml(m, theme, webview)).join('');

        return `<!DOCTYPE html>
<html lang="en">
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
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
        }
        .header p {
            margin: 0;
            color: var(--vscode-descriptionForeground);
        }
        .stats {
            display: flex;
            gap: 15px;
            margin-bottom: 25px;
            flex-wrap: wrap;
        }
        .stat-item {
            padding: 12px 20px;
            background-color: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
            border-radius: 6px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .stat-icon {
            font-size: 18px;
        }
        .monsters-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 25px;
            margin-top: 20px;
        }
        .monster-card {
            border: 2px solid var(--vscode-panel-border);
            border-radius: 12px;
            padding: 20px;
            background-color: var(--vscode-sideBar-background);
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .monster-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.2);
            border-color: var(--vscode-focusBorder);
        }
        .monster-card.defeated {
            opacity: 0;
            transform: scale(0.3) rotate(360deg);
            transition: all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .monster-svg-container {
            width: 100%;
            height: 180px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 15px;
        }
        .monster-svg {
            max-width: 100%;
            max-height: 100%;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        .monster-svg-container.size-S .monster-svg { width: 120px; height: 120px; }
        .monster-svg-container.size-M .monster-svg { width: 150px; height: 150px; }
        .monster-svg-container.size-L .monster-svg { width: 170px; height: 170px; }
        .monster-svg-container.size-XL .monster-svg { width: 180px; height: 180px; }
        .monster-info {
            text-align: center;
        }
        .monster-type {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 8px;
        }
        .monster-size {
            color: var(--vscode-descriptionForeground);
            font-size: 13px;
            margin-bottom: 8px;
        }
        .monster-count {
            background-color: var(--vscode-errorForeground);
            color: white;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 8px;
            display: inline-block;
        }
        .monster-file {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-top: 8px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .actions {
            margin-bottom: 20px;
        }
        button {
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-right: 10px;
            font-weight: 500;
            transition: all 0.2s;
        }
        button:hover {
            background-color: var(--vscode-button-hoverBackground);
            transform: translateY(-2px);
        }
        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            color: var(--vscode-descriptionForeground);
        }
        .empty-state-icon {
            font-size: 100px;
            margin-bottom: 20px;
            animation: celebrate 1s ease-in-out;
        }
        .empty-state h2 {
            color: var(--vscode-foreground);
            margin: 10px 0;
        }
        @keyframes celebrate {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(-10deg) scale(1.1); }
            75% { transform: rotate(10deg) scale(1.1); }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚔️ Bug Monsters</h1>
        <p>Defeat the monsters by fixing your bugs!</p>
    </div>

    <div class="stats">
        <div class="stat-item">
            <span class="stat-icon">⚠️</span>
            <span>Errors: ${stats.errors}</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">🔔</span>
            <span>Warnings: ${stats.warnings}</span>
        </div>
        <div class="stat-item">
            <span class="stat-icon">✅</span>
            <span>Defeated: ${stats.defeated}</span>
        </div>
    </div>

    <div class="actions">
        <button onclick="clearAllMonsters()">🧹 Clear All Monsters</button>
    </div>

    <div class="monsters-container" id="monsters">
        ${monsters.length === 0 ? `
            <div class="empty-state">
                <div class="empty-state-icon">🎉</div>
                <h2>No Monsters Here!</h2>
                <p>All bugs have been defeated. Your code is clean!</p>
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

    private getMonsterHtml(monster: Monster, theme: string, webview: vscode.Webview): string {
        const svgUri = this.getMonsterSvgUri(monster.type, webview);
        const typeLabel = this.getTypeLabel(monster.type);
        const fileName = path.basename(monster.uri);

        return `
        <div class="monster-card" id="${monster.id}" onclick="openFile('${monster.uri}')">
            <div class="monster-svg-container size-${monster.size}">
                <img src="${svgUri}" alt="${typeLabel}" class="monster-svg" />
            </div>
            <div class="monster-info">
                <div class="monster-type">${typeLabel}</div>
                <div class="monster-size">Size: ${monster.size}</div>
                <div class="monster-count">${monster.count} issue${monster.count !== 1 ? 's' : ''}</div>
                <div class="monster-file">
                    📄 ${fileName}
                </div>
            </div>
        </div>`;
    }

    private getMonsterSvgUri(type: string, webview: vscode.Webview): string {
        const svgFiles: Record<string, string> = {
            'error': 'error.svg',
            'warning': 'warning.svg',
            'hint': 'hint.svg',
            'typeError': 'typeerror.svg',
            'referenceError': 'referenceerror.svg'
        };

        const svgFile = svgFiles[type] || 'error.svg';
        const svgPath = vscode.Uri.joinPath(
            this.extensionUri,
            'src',
            'ui',
            'webviewAssets',
            'monsters',
            svgFile
        );

        return webview.asWebviewUri(svgPath).toString();
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
