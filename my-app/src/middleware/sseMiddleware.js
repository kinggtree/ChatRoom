const sseMiddleware = store => next => action => {
  if (action.type !== 'START_SSE_CONNECTION') {
    return next(action);
  }

  const eventSource = new EventSource('/api/serverSendNew');

  eventSource.onmessage = event => {
    const data = JSON.parse(event.data);
    store.dispatch({ type: 'newMessageReceived', payload: data.senderId });
  };

  eventSource.onerror = error => {
    console.error("SSE error:", error);
    store.dispatch({ type: 'SSE_ERROR', error });
  };

  return next(action);
};

export default sseMiddleware;
