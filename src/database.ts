/*
 * Note: This database is a combination of in-memory and file-based databases.
 *       The in-memory database is used for speed, but the file-based database
 *       is used for persistence.
 */

import * as fs from 'fs';

export class Database {
    private data: {};
    private filePath: string;

    constructor(filePath: string) {
        this.data = {};
        this.filePath = filePath;
    }

    public get(key: string): any {
        return this.data[key];
    }

    public set(key: string, value: any): void {
        this.data[key] = value;
    }

    public delete(key: string): void {
        delete this.data[key];
    }

    public clear(): void {
        this.data = {};
    }

    public find(callback: (key: string, value: any) => boolean): string {
        for (const key in this.data) {
            if (callback(key, this.data[key])) {
                return key;
            }
        }
        return null;
    }

    public findAll(callback: (key: string, value: any) => boolean): string[] {
        const keys: string[] = [];
        for (const key in this.data) {
            if (callback(key, this.data[key])) {
                keys.push(key);
            }
        }
        return keys;
    }

    public has(key: string): boolean {
        return this.data.hasOwnProperty(key);
    }

    public size(): number {
        return Object.keys(this.data).length;
    }

    public keys(): string[] {
        return Object.keys(this.data);
    }

    public values(): any[] {
        return Object.values(this.data);
    }

    public save(): void {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data));
    }

    public load(): void {
        if (fs.existsSync(this.filePath)) {
            this.data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
        } else {
            // No file exists, so create one.
            this.save();
        }
    }
}