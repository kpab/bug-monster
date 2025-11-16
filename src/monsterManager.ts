import * as vscode from 'vscode';
import { Monster, MonsterType, MonsterSize, DiagnosticStats, MonsterDefeatEvent } from './types';

export class MonsterManager {
    private monsters: Map<string, Monster> = new Map();
    private nextId = 0;
    private onMonsterChangeEmitter = new vscode.EventEmitter<void>();
    private onMonsterDefeatEmitter = new vscode.EventEmitter<MonsterDefeatEvent>();

    public readonly onMonsterChange = this.onMonsterChangeEmitter.event;
    public readonly onMonsterDefeat = this.onMonsterDefeatEmitter.event;

    spawn(uri: string, diagnostics: vscode.Diagnostic[], type: MonsterType): Monster | null {
        const config = vscode.workspace.getConfiguration('bugMonsters');
        const maxMonsters = config.get<number>('maxMonsters', 5);

        if (this.monsters.size >= maxMonsters) {
            // Merge with existing monster of the same type
            const existing = Array.from(this.monsters.values()).find(
                m => m.type === type && m.uri === uri && !m.defeated
            );
            if (existing) {
                existing.count += diagnostics.length;
                existing.diagnostics.push(...diagnostics);
                existing.size = this.calculateSize(existing.count);
                this.onMonsterChangeEmitter.fire();
                return existing;
            }
            return null;
        }

        const monster: Monster = {
            id: `monster-${this.nextId++}`,
            type,
            size: this.calculateSize(diagnostics.length),
            count: diagnostics.length,
            uri,
            diagnostics,
            createdAt: new Date(),
            defeated: false
        };

        this.monsters.set(monster.id, monster);
        this.onMonsterChangeEmitter.fire();
        return monster;
    }

    defeat(monsterId: string): void {
        const monster = this.monsters.get(monsterId);
        if (monster && !monster.defeated) {
            monster.defeated = true;
            this.onMonsterDefeatEmitter.fire({
                monsterId: monster.id,
                type: monster.type,
                count: monster.count
            });

            // Remove after animation delay
            setTimeout(() => {
                this.monsters.delete(monsterId);
                this.onMonsterChangeEmitter.fire();
            }, 2000);
        }
    }

    defeatByUri(uri: string, count: number, type: MonsterType): void {
        const monstersForUri = Array.from(this.monsters.values())
            .filter(m => m.uri === uri && m.type === type && !m.defeated)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

        let remaining = count;
        for (const monster of monstersForUri) {
            if (remaining <= 0) break;

            if (monster.count <= remaining) {
                this.defeat(monster.id);
                remaining -= monster.count;
            } else {
                monster.count -= remaining;
                monster.size = this.calculateSize(monster.count);
                remaining = 0;
                this.onMonsterChangeEmitter.fire();
            }
        }
    }

    updateMonster(uri: string, diagnostics: vscode.Diagnostic[], type: MonsterType): void {
        const existing = Array.from(this.monsters.values()).find(
            m => m.uri === uri && m.type === type && !m.defeated
        );

        if (existing) {
            existing.count = diagnostics.length;
            existing.diagnostics = diagnostics;
            existing.size = this.calculateSize(diagnostics.length);
            this.onMonsterChangeEmitter.fire();
        }
    }

    getMonsters(): Monster[] {
        return Array.from(this.monsters.values()).filter(m => !m.defeated);
    }

    getMonsterById(id: string): Monster | undefined {
        return this.monsters.get(id);
    }

    clearAll(): void {
        const allMonsters = Array.from(this.monsters.values()).filter(m => !m.defeated);
        allMonsters.forEach(m => this.defeat(m.id));
    }

    private calculateSize(count: number): MonsterSize {
        if (count >= 10) return MonsterSize.XL;
        if (count >= 6) return MonsterSize.L;
        if (count >= 3) return MonsterSize.M;
        return MonsterSize.S;
    }

    getTotalStats(): { errors: number; warnings: number; hints: number; defeated: number } {
        const monsters = this.getMonsters();
        return {
            errors: monsters.filter(m => m.type === MonsterType.ERROR ||
                                         m.type === MonsterType.TYPE_ERROR ||
                                         m.type === MonsterType.REFERENCE_ERROR).length,
            warnings: monsters.filter(m => m.type === MonsterType.WARNING).length,
            hints: monsters.filter(m => m.type === MonsterType.HINT).length,
            defeated: Array.from(this.monsters.values()).filter(m => m.defeated).length
        };
    }
}
