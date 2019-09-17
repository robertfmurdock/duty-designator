const FetchService = {
     async get(timeout, url, controller) {
        return await this.timedFetch(timeout, url, "GET", undefined, controller);
    },

    async post(timeout, url, body, controller) {
        return await this.timedFetch(timeout, url, "POST", body, controller);
    },

    async timedFetch(timeout, url, method, body, controller) {
        const safeTimeout = timeout ? timeout : 5000;
        return await new Promise(async (resolve, reject) =>  {
            setTimeout(() => { reject({ name: "Timeout Error" }); }, safeTimeout);
            await this.fetch(url, method, body, controller).then(resolve, reject);
        });
    },

    async fetch(url, method, body, controller) {
        return await fetch(url, {
            method: method,
            body: JSON.stringify(body),
            signal: controller ? controller.signal : undefined
        })
            .catch(err => {
                if (err.name === "AbortError") { return Promise.reject(err); }

                console.warn(err);
                throw err
            })
            .then(response => {
                if (!response.ok) { throw response.status; }
                return response.text();
            })
            .then(text => text.length ? JSON.parse(text) : {});
    }
};

export default FetchService;