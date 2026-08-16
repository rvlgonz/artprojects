const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event) {
    try {
        const { data, error } = await supabase
            .from("dans_articles")
            .select("title, created_at, cat, tagline, article, slug")
            .order("created_at", { ascending: true });

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({ "dans_articles": data })
        };
    } catch (err) {
        console.log("Error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};