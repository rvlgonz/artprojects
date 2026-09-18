exports.handler = async function(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method not allowed" };
    }
    try {
        const { password } = JSON.parse(event.body);
        const valid = password === process.env.SUBMIT_PASSWORD;
        return { statusCode: 200, body: JSON.stringify({ valid }) };
    } catch (err) {
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};