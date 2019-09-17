import FetchService from './fetchService';
console.warn = jest.fn();

describe('fetch service', () => {
    beforeEach(fetch.resetMocks);

    describe('call construction', () => {
        beforeEach(() => { fetch.mockResponseOnce(); });

        test('calls to url', async () => {
            const url = 'https://www.someplace.com/doTheThings';

            await FetchService.fetch(url);
            const fetchUrl = fetch.mock.calls[0][0];

            expect(fetchUrl).toEqual(url);
        });

        test('uses passed method', async () => {
            const method = 'GET';

            await FetchService.fetch("url", method);
            const fetchArgs = fetch.mock.calls[0][1];

            expect(fetchArgs.method).toEqual(method);
        });

        test('stringifies and appends body', async () => {
            const data = { body: "big shoulders" };

            await FetchService.fetch("url", "POST", data);
            const fetchArgs = fetch.mock.calls[0][1];

            expect(fetchArgs.body).toEqual(JSON.stringify(data));
        });

        test('appends signal to request', async () => {
            const controller = new AbortController();

            await FetchService.fetch("url", "GET", undefined, controller);
            const fetchArgs = fetch.mock.calls[0][1];

            expect(fetchArgs.signal).toEqual(controller.signal);
        });
    });

    describe('on success', () => {
        test('returns parsed response', async () => {
            const data = { gotThem: "datums" };
            fetch.mockResponseOnce(JSON.stringify(data));

            const response = await FetchService.fetch("url");

            expect(response).toEqual(data);
        });

        test('returns parsed response within timeout', async () => {
            const data = { gotThem: "datums" };
            fetch.mockResponseOnce(JSON.stringify(data));
            const response = await FetchService.timedFetch('url').catch(err => err);

            expect(response).toEqual(data);
        });
    });

    describe('error handling', () => {
        test('returns error response', async () => {
            var error = { name: "Spooky Error" };
            fetch.mockReject(error);
            const response = await FetchService.fetch('url').catch(err => err);
            expect(response).toEqual(error);
        });

        test('should return rejected promise for Abort Errors', async () => {
            var error = { name: "AbortError" };
            fetch.mockReject(error);

            const response = await FetchService.fetch('url').catch(err => err);

            expect(response).toEqual(error);
        });

        test('should handle timeout errors', async () => {
            fetch.mockResponseOnce(() => new Promise(resolve => setTimeout(() => resolve({ body: 'ok' }), 100)))
            const response = await FetchService.timedFetch('url', undefined, 0).catch(err => err);

            expect(response).toEqual({ name: "Timeout Error" });
        });
    });
});