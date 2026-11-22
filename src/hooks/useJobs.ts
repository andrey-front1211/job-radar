import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchJobs } from '../api/jobs';
import type { JobsState } from '../types';

const initialState: JobsState = {
  jobs: [],
  status: 'loading',
  isFallback: false,
  errorMessage: null,
};

/**
 * Загружает вакансии при монтировании и умеет перезапрашивать данные.
 * Запрос отменяется, если компонент размонтирован (защита от утечек и
 * от обновления состояния уже удалённого компонента).
 */
export function useJobs() {
  const [state, setState] = useState<JobsState>(initialState);
  const [requestId, setRequestId] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    let isActive = true;
    setState((prev) => ({ ...prev, status: 'loading', errorMessage: null }));

    fetchJobs(controller.signal).then((result) => {
      if (!isActive) return;
      setState({
        jobs: result.jobs,
        status: 'ready',
        isFallback: result.isFallback,
        errorMessage: result.errorMessage,
      });
    });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [requestId]);

  const reload = useCallback(() => setRequestId((id) => id + 1), []);

  return { ...state, reload };
}
