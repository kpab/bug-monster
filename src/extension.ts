import * as vscode from 'vscode';
import { MonsterManager } from './monsterManager';
import { DiagnosticsWatcher } from './diagnosticsWatcher';
import { MonsterPanelView } from './ui/panelView';

let monsterManager: MonsterManager;
let diagnosticsWatcher: DiagnosticsWatcher;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    console.log('Bug Monsters extension is now active!');

    // Initialize monster manager
    monsterManager = new MonsterManager();

    // Create status bar item
    statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        100
    );
    statusBarItem.command = 'bugMonsters.openPanel';
    context.subscriptions.push(statusBarItem);

    // Update status bar on monster changes
    monsterManager.onMonsterChange(() => {
        updateStatusBar();
    });

    // Initialize diagnostics watcher
    const config = vscode.workspace.getConfiguration('bugMonsters');
    if (config.get<boolean>('enable', true)) {
        diagnosticsWatcher = new DiagnosticsWatcher(monsterManager);
    }

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('bugMonsters.toggle', () => {
            toggleExtension(context);
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('bugMonsters.openPanel', () => {
            MonsterPanelView.createOrShow(context.extensionUri, monsterManager);
        })
    );


    // Listen to configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('bugMonsters.enable')) {
                const config = vscode.workspace.getConfiguration('bugMonsters');
                if (config.get<boolean>('enable', true)) {
                    if (!diagnosticsWatcher) {
                        diagnosticsWatcher = new DiagnosticsWatcher(monsterManager);
                    }
                } else {
                    if (diagnosticsWatcher) {
                        diagnosticsWatcher.dispose();
                    }
                }
            }
        })
    );

    // Show welcome message
    const hasShownWelcome = context.globalState.get('bugMonsters.hasShownWelcome', false);
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage(
            '⚔️ Bug Monsters is ready! Your errors will appear as monsters. Click the status bar to view them!',
            'Open Monster Panel'
        ).then(selection => {
            if (selection === 'Open Monster Panel') {
                vscode.commands.executeCommand('bugMonsters.openPanel');
            }
        });
        context.globalState.update('bugMonsters.hasShownWelcome', true);
    }

    updateStatusBar();
}

function toggleExtension(context: vscode.ExtensionContext) {
    const config = vscode.workspace.getConfiguration('bugMonsters');
    const currentState = config.get<boolean>('enable', true);
    config.update('enable', !currentState, vscode.ConfigurationTarget.Global);

    if (!currentState) {
        vscode.window.showInformationMessage('⚔️ Bug Monsters enabled!');
    } else {
        vscode.window.showInformationMessage('Bug Monsters disabled');
        monsterManager.clearAll();
    }
}

function updateStatusBar() {
    const stats = monsterManager.getTotalStats();
    const totalMonsters = stats.errors + stats.warnings + stats.hints;

    if (totalMonsters > 0) {
        const errorIcon = stats.errors > 0 ? '⚠️' : '';
        const warningIcon = stats.warnings > 0 ? '🔔' : '';
        statusBarItem.text = `⚔️ ${errorIcon}${stats.errors} ${warningIcon}${stats.warnings}`;
        statusBarItem.tooltip = `Bug Monsters: ${stats.errors} error${stats.errors !== 1 ? 's' : ''}, ${stats.warnings} warning${stats.warnings !== 1 ? 's' : ''}\nClick to view monster panel`;
        statusBarItem.show();
    } else {
        statusBarItem.text = '⚔️ All Clear';
        statusBarItem.tooltip = 'Bug Monsters: No bugs detected!';
        statusBarItem.show();
    }
}

export function deactivate() {
    if (diagnosticsWatcher) {
        diagnosticsWatcher.dispose();
    }
    if (statusBarItem) {
        statusBarItem.dispose();
    }
}
