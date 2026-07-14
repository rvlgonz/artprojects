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
        const { FormEmail, FormText } = JSON.parse(event.body);
        const { error } = await supabase
            .from("contact_form")
            .insert([{ email: FormEmail, message: FormText }]);
        if (error) throw error;
        return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
