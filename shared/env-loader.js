async function loadEnv() {
    try {
        const response = await fetch('.env');
        if (!response.ok) throw new Error('No .env file found');
        const text = await response.text();
        const env = {};
        text.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) env[key.trim()] = value.trim();
        });
        return env;
    } catch (e) {
        console.warn('Could not load .env file. Fallback to hardcoded keys if available.');
        return {};
    }
}
