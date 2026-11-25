/**
 * Копирует собранный одностраничный билд в preview/demo.html.
 * Это удобно, чтобы открыть демо локально или приложить одним файлом
 * (например, отправить рекрутёру без деплоя).
 */
import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'dist/index.html');
const target = resolve(root, 'preview/demo.html');

await mkdir(dirname(target), { recursive: true });
await copyFile(source, target);
console.log(`demo -> ${target}`);
