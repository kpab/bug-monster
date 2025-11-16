import * as vscode from 'vscode';

export enum MonsterType {
    ERROR = 'error',
    WARNING = 'warning',
    HINT = 'hint',
    TYPE_ERROR = 'typeError',
    REFERENCE_ERROR = 'referenceError'
}

export enum MonsterSize {
    S = 'S',
    M = 'M',
    L = 'L',
    XL = 'XL'
}

export interface Monster {
    id: string;
    type: MonsterType;
    size: MonsterSize;
    count: number;
    uri: string;
    diagnostics: vscode.Diagnostic[];
    createdAt: Date;
    defeated: boolean;
}

export interface DiagnosticStats {
    errorCount: number;
    warningCount: number;
    hintCount: number;
}

export interface BugMonstersConfig {
    enable: boolean;
    maxMonsters: number;
    showOnWarnings: boolean;
    animationSpeed: 'slow' | 'normal' | 'fast';
    monsterTheme: 'fantasy' | 'cyber' | 'cute';
}

export interface MonsterDefeatEvent {
    monsterId: string;
    type: MonsterType;
    count: number;
}
