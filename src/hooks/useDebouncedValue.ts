import { useEffect, useState } from 'react';

/**
 * Возвращает значение, которое обновляется только после того,
 * как пользователь перестал его менять `delay` миллисекунд.
 * Нужен, чтобы не пересчитывать фильтры и не дёргать API на каждый символ.
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
