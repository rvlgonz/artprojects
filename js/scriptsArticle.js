document.addEventListener("DOMContentLoaded", function () {

    const FormTitleValue = FormTitle.value;
    const FormCategoryValue = FormCategory.value;
    const FormTaglineValue = FormTagline.value;
    const FormTextValue = FormText.value;
    const uploadPostBtn = document.getElementById("uploadPostBtn");
    const uploadStatus = document.getElementById("uploadStatus");

    if (uploadPostBtn) {
            uploadPostBtn.addEventListener("click", async function(e) {
            e.preventDefault();

            const FormTitleValue = FormTitle.value;
            const FormCategoryValue = FormCategory.value;
            const FormTaglineValue = FormTagline.value;
            const FormTextValue = FormText.value;
            const FormURLValue = FormURL.value;

            if (!FormTitleValue || !FormCategoryValue || !FormTaglineValue || !FormTextValue) {
                uploadStatus.textContent = "please fill out all fields.";
                uploadStatus.style.display = "block";
                return;
            }

            uploadStatus.textContent = "sending...";
            uploadStatus.style.display = "block";

            try {
                const response = await fetch("/.netlify/functions/submit-article", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
body: JSON.stringify({
    FormTitle: FormTitleValue,
    FormCategory: FormCategoryValue,
    FormTagline: FormTaglineValue,
    FormText: FormTextValue,
    FormURL: FormURLValue,
})
                });

                const data = await response.json();

                if (data.success) {
                    uploadStatus.textContent = "received. thank you.";
                    FormTitle.value = "";
                    FormTagline.value = "";
                    FormText.value = "";
                    FormCategory.value = "";
                    FormURL.value = "";
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