// Cloudflare Pages Function for TTS API
export async function onRequestPost(context) {
    try {
        const { text } = await context.request.json();

        if (!text) {
            return new Response(JSON.stringify({ error: 'Text is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${context.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'tts-1',
                voice: 'nova',
                input: text
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('OpenAI TTS Error:', error);
            return new Response(JSON.stringify({ error: 'TTS API call failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const audioData = await response.arrayBuffer();

        return new Response(audioData, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioData.byteLength.toString()
            }
        });

    } catch (error) {
        console.error('Function Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
