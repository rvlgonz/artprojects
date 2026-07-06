const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method not allowed" };
    }

    try {
        const { fileName, fileData, contentType } = JSON.parse(event.body);

        const buffer = Buffer.from(fileData, "base64");
        const filePath = `messages/${Date.now()}-${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("audio-messages")
            .upload(filePath, buffer, { contentType });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from("audio-messages")
            .getPublicUrl(filePath);

        const { error: dbError } = await supabase
            .from("audio_messages")
            .insert([{ file_url: data.publicUrl, file_name: fileName }]);

        if (dbError) throw dbError;

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, url: data.publicUrl })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
