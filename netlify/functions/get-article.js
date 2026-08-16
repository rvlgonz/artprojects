const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event) {
    const slug = event.queryStringParameters.slug;

    if (!slug) {
        return { statusCode: 400, body: JSON.stringify({ error: "slug required" }) };
    }

    try {
        const { data, error } = await supabase
            .from("dans_articles")
            .select("*")
            .eq("slug", slug)
            .single();

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({ article: data })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};