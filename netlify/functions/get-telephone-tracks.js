const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event) {
    try {
        const { data, error } = await supabase.storage
            .from("telephone_messages")
            .list("", { sortBy: { column: "name", order: "asc" } });

        if (error) throw error;

        const tracks = data
            .filter(file => file.name.endsWith(".mp3"))
            .map((file, i) => ({
                title: `Message ${i + 1}`,
                src: `${process.env.SUPABASE_URL}/storage/v1/object/public/telephone_messages/${file.name}`
            }));

        return {
            statusCode: 200,
            body: JSON.stringify({ tracks })
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};