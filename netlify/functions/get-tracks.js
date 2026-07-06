const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.handler = async function(event) {
    try {
        const { data, error } = await supabase
            .from("tracks")
            .select("title, file_name")
            .order("play_order", { ascending: true });

        if (error) throw error;

        const tracks = data.map(row => ({
            title: row.title,
            src: `${process.env.SUPABASE_URL}/storage/v1/object/public/calls/${row.file_name}`
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ tracks })
        };
    } catch (err) {
        console.log("Error:", err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};