import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export const startWorker = () => {
    worker.start({
        onUnhandledRequest: 'bypass',
    })
}