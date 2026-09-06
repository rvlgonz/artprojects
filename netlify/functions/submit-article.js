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
        const { FormTitle, FormCategory, FormTagline, FormText, FormFile, FormURL } = JSON.parse(event.body);
        const { error } = await supabase
            .from("policy_articles")
            .insert([{ title: FormTitle, cat: FormCategory, tagline: FormTagline, article: FormText, file: FormFile, slug: FormURL.toLowerCase().replace(/\s+/g, '-') }]);
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
