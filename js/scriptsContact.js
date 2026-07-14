document.addEventListener("DOMContentLoaded", function () {

    const commentInput = document.getElementById("commentInput");
    const emailInput = document.getElementById("emailInput");
    const uploadCommentBtn = document.getElementById("uploadCommentBtn");
    const uploadStatus = document.getElementById("uploadStatus");

    if (uploadCommentBtn) {
        uploadCommentBtn.addEventListener("click", async function() {
            const commentValue = commentInput.value;
            const emailValue = emailInput.value;

            if (!commentValue || !emailValue) {
                uploadStatus.textContent = "please fill out all fields.";
                uploadStatus.style.display = "block";
                return;
            }

            uploadStatus.textContent = "sending...";
            uploadStatus.style.display = "block";

            try {
                const response = await fetch("/.netlify/functions/submit-contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        FormEmail: emailValue,
                        FormText: commentValue
                    })
                });

                const data = await response.json();

                if (data.success) {
                    uploadStatus.textContent = "received. thank you.";
                    commentInput.value = "";
                    emailInput.value = "";
                } else {
                    uploadStatus.textContent = "something went wrong. try again.";
                    console.error("Submit error:", data.error);
                }
            } catch (err) {
                uploadStatus.textContent = "something went wrong. try again.";
                console.error("Submit failed:", err);
            }
        });
    }
});