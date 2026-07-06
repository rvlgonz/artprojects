const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event) {
    console.log("Function called with method:", event.httpMethod);
    
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method not allowed" };
    }

    try {
        const body = JSON.parse(event.body);
        console.log("Received body:", body);
        console.log("SUPABASE_URL exists:", !!process.env.SUPABASE_URL);
        console.log("SUPABASE_ANON_KEY exists:", !!process.env.SUPABASE_ANON_KEY);

        const { track, color } = body;

        const { data, error } = await supabase
            .from("color_submissions")
            .insert([{ track_title: track, hex_color: color }]);

        console.log("Insert result - data:", data, "error:", error);

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (err) {
        console.log("Caught error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};