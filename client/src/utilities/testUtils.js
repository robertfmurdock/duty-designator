export async function waitUntil(untilFunction) {
    const start = new Date();
    while (!untilFunction() && (new Date() - start) < 300) {
        await yield25()
    }

    expect(untilFunction()).toBe(true);
}

function yield25() {
    return new Promise((resolve) => {
        setTimeout(resolve, 25)
    });
}