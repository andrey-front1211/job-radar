import type { Level } from '../types';
import { LEVEL_LABEL } from '../lib/format';

interface LevelBadgeProps {
  level: Level;
}

/** Бейдж грейда. Цвет кодирует уровень, но текст всегда дублирует смысл (не только цвет). */
export function LevelBadge({ level }: LevelBadgeProps) {
  return <span className={`badge badge--${level}`}>{LEVEL_LABEL[level]}</span>;
}
