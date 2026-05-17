const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/ytmp3', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: "කරුණාකර YouTube URL එකක් ලබාදෙන්න. (?url=...)" });
    }

    try {
        // YouTube වීඩියෝ එකේ විස්තර ලබා ගැනීම
        const info = await ytdl.getInfo(videoUrl);
        
        // හොඳම Audio Format එක තෝරාගැනීම
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly', quality: 'highestaudio' });

        if (format && format.url) {
            // බොට් එකට කියවිය හැකි පරිදි JSON එකක් හරහා download ලින්ක් එක යැවීම
            return res.json({
                success: true,
                title: info.videoDetails.title,
                downloadUrl: format.url
            });
        } else {
            return res.status(500).json({ error: "Direct download link එකක් සෑදීමට නොහැකි විය." });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "දෝෂයක් සිදු විය: " + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
