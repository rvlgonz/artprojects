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
        console.log("fileName:", fileName);
        console.log("contentType:", contentType);
        console.log("fileData length:", fileData ? fileData.length : "null");

        const buffer = Buffer.from(fileData, "base64");
        const filePath = `messages/${Date.now()}-${fileName}`;
        console.log("uploading to path:", filePath);

        const { error: uploadError } = await supabase.storage
            .from("audio-messages")
            .upload(filePath, buffer, { contentType });

        console.log("upload error:", uploadError);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from("audio-messages")
            .getPublicUrl(filePath);

        console.log("public url:", data.publicUrl);

        const { error: dbError } = await supabase
            .from("audio_messages")
            .insert([{ file_url: data.publicUrl, file_name: fileName }]);

        console.log("db error:", dbError);
        if (dbError) throw dbError;

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, url: data.publicUrl })
        };
    } catch (err) {
        console.log("Caught error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
