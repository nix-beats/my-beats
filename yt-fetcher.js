// Open-Source Public Invidious Instances (IP Bypass System)
const instances = [
    "https://invidious.nerdvpn.de",
    "https://inv.tux.pizza",
    "https://vid.puffyan.us",
    "https://invidious.drgns.space"
];

async function getYouTubeAudioUrl(videoId) {
    for (let instance of instances) {
        try {
            const response = await fetch(`${instance}/api/v1/videos/${videoId}`);
            if (!response.ok) continue;
            
            const data = await response.json();
            const adaptiveFormats = data.adaptiveFormats || [];
            
            // Extract Audio stream (Ogg/WebM/AAC)
            const audioStream = adaptiveFormats.find(format => format.mimeType.startsWith('audio/'));
            
            if (audioStream && audioStream.url) {
                return audioStream.url;
            }
        } catch (e) {
            console.warn(`Instance failed: ${instance}, trying next...`);
        }
    }
    throw new Error("Unable to fetch audio. Try another song.");
}
