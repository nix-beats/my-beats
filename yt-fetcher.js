// Reliable & Fast YouTube Audio Fetcher Engine
async function getYouTubeAudioUrl(videoId) {
    const endpoints = [
        `https://api.piped.video/streams/${videoId}`,
        `https://pipedapi.kavin.rocks/streams/${videoId}`,
        `https://invidious.nerdvpn.de/api/v1/videos/${videoId}`,
        `https://inv.tux.pizza/api/v1/videos/${videoId}`
    ];

    for (let url of endpoints) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 sec timeout

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) continue;

            const data = await response.json();

            // Piped API Audio Streams
            if (data.audioStreams && data.audioStreams.length > 0) {
                return data.audioStreams[0].url;
            }

            // Invidious Adaptive Audio Streams
            if (data.adaptiveFormats) {
                const audioStream = data.adaptiveFormats.find(f => f.mimeType && f.mimeType.startsWith('audio/'));
                if (audioStream && audioStream.url) return audioStream.url;
            }
        } catch (e) {
            console.warn(`Failed endpoint: ${url}`);
        }
    }
    throw new Error("Unable to fetch audio");
}
