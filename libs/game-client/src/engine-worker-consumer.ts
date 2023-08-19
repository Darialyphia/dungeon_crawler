export const createEngineWorkerConsumer = () => {
  console.log('Create engine worker');
  const state = ref<string>();

  const worker = new Worker(new URL('./engine-worker.ts', import.meta.url), {
    type: 'module'
  });
  const PLAYERID = 'player';

  worker.addEventListener('message', ({ data }) => {
    state.value = data[PLAYERID];
  });
  worker.postMessage({
    type: 'join',
    payload: { id: PLAYERID }
  });
  worker.postMessage({ type: 'start' });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      worker.postMessage({
        type: 'start'
      });
    } else {
      worker.postMessage({
        type: 'stop'
      });
    }
  });

  return {
    state,
    dispatch: (event: any) => {
      worker.postMessage(event);
    }
  };
};
