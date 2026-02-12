import { useEffect, useRef } from 'react';

interface UseSSECallbacks {
  onLog: (chunk: string) => void;
  onDone: (status: string) => void;
}

export function useSSE(jobId: string | number | undefined, status: string, { onLog, onDone }: UseSSECallbacks): void {
  const callbacksRef = useRef({ onLog, onDone });
  callbacksRef.current = { onLog, onDone };

  useEffect(() => {
    if (status !== 'running') return;

    const es = new EventSource(`/api/jobs/${jobId}/log`);

    es.onmessage = (e) => {
      callbacksRef.current.onLog(JSON.parse(e.data));
    };

    es.addEventListener('done', (e) => {
      es.close();
      callbacksRef.current.onDone((e as MessageEvent).data || 'done');
    });

    es.onerror = () => {
      es.close();
      callbacksRef.current.onDone('disconnected');
    };

    return () => es.close();
  }, [jobId, status]);
}
