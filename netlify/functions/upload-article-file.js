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
        const { fileName, fileData } = JSON.parse(event.body);

        if (!fileName || !fileData) {
            return { statusCode: 400, body: JSON.stringify({ error: "fileName and fileData required" }) };
        }

        // fileData arrives as a data URL: "data:application/pdf;base64,...."
        const base64Payload = fileData.split(",")[1] || fileData;
        const buffer = Buffer.from(base64Payload, "base64");

        // Timestamp-prefix so two uploads with the same filename don't collide
        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const storagePath = `${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase
            .storage
            .from("policy_articles")
            .upload(storagePath, buffer, {
                contentType: "application/pdf",
                upsert: false
            });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase
            .storage
            .from("policy_articles")
            .getPublicUrl(storagePath);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, url: publicUrlData.publicUrl, path: storagePath })
        };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};