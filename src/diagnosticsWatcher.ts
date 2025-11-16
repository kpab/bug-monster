import * as vscode from 'vscode';
import { MonsterManager } from './monsterManager';
import { MonsterType, DiagnosticStats } from './types';

export class DiagnosticsWatcher {
    private previousStats = new Map<string, DiagnosticStats>();
    private disposables: vscode.Disposable[] = [];
    private updateThrottle: NodeJS.Timeout | undefined;
    private pendingUpdates = new Set<string>();

    constructor(private monsterManager: MonsterManager) {
        this.initialize();
    }

    private initialize(): void {
        // Monitor diagnostics changes
        this.disposables.push(
            vscode.languages.onDidChangeDiagnostics(this.onDiagnosticsChanged.bind(this))
        );

        // Initial scan of existing diagnostics
        this.scanExistingDiagnostics();
    }

    private scanExistingDiagnostics(): void {
        const allDiagnostics = vscode.languages.getDiagnostics();
        for (const [uri, diagnostics] of allDiagnostics) {
            if (diagnostics.length > 0) {
                this.processDiagnostics(uri, diagnostics);
            }
        }
    }

    private onDiagnosticsChanged(event: vscode.DiagnosticChangeEvent): void {
        const config = vscode.workspace.getConfiguration('bugMonsters');
        if (!config.get<boolean>('enable', true)) {
            return;
        }

        // Throttle updates to prevent overwhelming the UI
        event.uris.forEach(uri => this.pendingUpdates.add(uri.toString()));

        if (this.updateThrottle) {
            clearTimeout(this.updateThrottle);
        }

        this.updateThrottle = setTimeout(() => {
            this.processPendingUpdates();
        }, 100);
    }

    private processPendingUpdates(): void {
        const uris = Array.from(this.pendingUpdates);
        this.pendingUpdates.clear();

        for (const uriString of uris) {
            const uri = vscode.Uri.parse(uriString);
            const diagnostics = vscode.languages.getDiagnostics(uri);
            this.processDiagnostics(uri, diagnostics);
        }
    }

    private processDiagnostics(uri: vscode.Uri, diagnostics: vscode.Diagnostic[]): void {
        const config = vscode.workspace.getConfiguration('bugMonsters');
        const showOnWarnings = config.get<boolean>('showOnWarnings', true);

        const newStats = this.calculateStats(diagnostics);
        const prevStats = this.previousStats.get(uri.toString()) || {
            errorCount: 0,
            warningCount: 0,
            hintCount: 0
        };

        // Handle errors
        this.handleDiagnosticTypeChange(
            uri,
            diagnostics,
            prevStats.errorCount,
            newStats.errorCount,
            vscode.DiagnosticSeverity.Error
        );

        // Handle warnings
        if (showOnWarnings) {
            this.handleDiagnosticTypeChange(
                uri,
                diagnostics,
                prevStats.warningCount,
                newStats.warningCount,
                vscode.DiagnosticSeverity.Warning
            );
        }

        // Handle hints (optional)
        this.handleDiagnosticTypeChange(
            uri,
            diagnostics,
            prevStats.hintCount,
            newStats.hintCount,
            vscode.DiagnosticSeverity.Hint
        );

        this.previousStats.set(uri.toString(), newStats);
    }

    private handleDiagnosticTypeChange(
        uri: vscode.Uri,
        allDiagnostics: vscode.Diagnostic[],
        prevCount: number,
        newCount: number,
        severity: vscode.DiagnosticSeverity
    ): void {
        const typeDiagnostics = allDiagnostics.filter(d => d.severity === severity);
        const monsterType = this.getMonsterType(severity, typeDiagnostics);

        if (newCount > prevCount) {
            // New diagnostics appeared - spawn monsters
            const newDiagnostics = typeDiagnostics.slice(prevCount);
            this.monsterManager.spawn(uri.toString(), newDiagnostics, monsterType);
        } else if (newCount < prevCount) {
            // Diagnostics fixed - defeat monsters
            const defeatedCount = prevCount - newCount;
            this.monsterManager.defeatByUri(uri.toString(), defeatedCount, monsterType);
        } else if (newCount > 0) {
            // Count same but might be different diagnostics - update
            this.monsterManager.updateMonster(uri.toString(), typeDiagnostics, monsterType);
        }
    }

    private calculateStats(diagnostics: vscode.Diagnostic[]): DiagnosticStats {
        return {
            errorCount: diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length,
            warningCount: diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length,
            hintCount: diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Hint).length
        };
    }

    private getMonsterType(
        severity: vscode.DiagnosticSeverity,
        diagnostics: vscode.Diagnostic[]
    ): MonsterType {
        if (severity === vscode.DiagnosticSeverity.Warning) {
            return MonsterType.WARNING;
        }
        if (severity === vscode.DiagnosticSeverity.Hint) {
            return MonsterType.HINT;
        }

        // Check for specific error types
        const messages = diagnostics.map(d => d.message.toLowerCase());
        if (messages.some(m => m.includes('typeerror') || m.includes('type error'))) {
            return MonsterType.TYPE_ERROR;
        }
        if (messages.some(m => m.includes('referenceerror') || m.includes('reference error') || m.includes('not defined'))) {
            return MonsterType.REFERENCE_ERROR;
        }

        return MonsterType.ERROR;
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
        if (this.updateThrottle) {
            clearTimeout(this.updateThrottle);
        }
    }
}
