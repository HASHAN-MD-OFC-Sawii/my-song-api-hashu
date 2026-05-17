const express = require('express');
const ytdl = require('@distube/ytdl-core'); // අලුත් ස්ථාවර පැකේජය
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/ytmp3', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: "කරුණාකර YouTube URL එකක් ලබාදෙන්න." });
    }

    try {
        // YouTube එකෙන් වීඩියෝ විස්තර ගැනීම (cookies හෝ වෙනත් බ්ලොක්වීම් මගහැරීමට)
        const info = await ytdl.getInfo(videoUrl, {
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });
        
        // Audio format එක තෝරාගැනීම
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });

        if (format && format.url) {
            return res.json({
                success: true,
                title: info.videoDetails.title,
                downloadUrl: format.url
            });
        } else {
            return res.status(500).json({ error: "Download link එක සෑදීමට නොහැකි විය." });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "API Error: " + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
