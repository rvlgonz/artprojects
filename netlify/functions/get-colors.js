const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event) {
    const track = event.queryStringParameters.track;

    if (!track) {
        return { statusCode: 400, body: JSON.stringify({ error: "track required" }) };
    }

    try {
        const { data, error } = await supabase
            .from("color_submissions")
            .select("hex_color")
            .eq("track_title", track);

        if (error) throw error;

        const colors = data.map(row => row.hex_color);

        return {
            statusCode: 200,
            body: JSON.stringify({ colors })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};