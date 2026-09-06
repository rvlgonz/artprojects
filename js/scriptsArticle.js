document.addEventListener("DOMContentLoaded", function () {

    const uploadArticleBtn = document.getElementById("uploadArticleBtn");
    const uploadPostBtn = document.getElementById("uploadPostBtn");
    const uploadStatus = document.getElementById("uploadStatus");
    const FormFileURL = document.getElementById("FormFileURL"); // hidden field, holds the uploaded PDF's URL

// Step 1: upload the PDF itself
    if (uploadArticleBtn) {
        uploadArticleBtn.addEventListener("click", async function (e) {
            e.preventDefault();

            const file = FormFile.files[0];
            if (!file) {
                uploadStatus.textContent = "please choose a PDF first.";
                uploadStatus.style.display = "block";
                return;
            }

            const MAX_FILE_SIZE_BYTES = 4.5 * 1024 * 1024; // 4.5MB, see note below
            if (file.size > MAX_FILE_SIZE_BYTES) {
                const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                uploadStatus.textContent = `file is too large (${sizeMB}MB). please upload a PDF under 4.5MB.`;
                uploadStatus.style.display = "block";
                FormFile.value = ""; // clear the bad selection so they have to reselect
                return;
            }

            uploadStatus.textContent = "uploading file...";
            uploadStatus.style.display = "block";

            try {
                const base64Data = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error("File read failed"));
                    reader.readAsDataURL(file);
                });

                const response = await fetch("/.netlify/functions/upload-article-file", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fileName: file.name, fileData: base64Data })
                });

                const data = await response.json();

                if (data.success) {
                    FormFileURL.value = data.url;
                    uploadStatus.textContent = "file uploaded.";
                } else {
                    uploadStatus.textContent = "file upload failed. try again.";
                    console.error("Upload error:", data.error);
                }
            } catch (err) {
                uploadStatus.textContent = "file upload failed. try again.";
                console.error("Upload failed:", err);
            }
        });
    }

    // Step 2: submit the article, now including the uploaded file's URL
    if (uploadPostBtn) {
        uploadPostBtn.addEventListener("click", async function (e) {
            e.preventDefault();

            const FormTitleValue = FormTitle.value;
            const FormCategoryValue = FormCategory.value;
            const FormTaglineValue = FormTagline.value;
            const FormTextValue = FormText.value;
            const FormURLValue = FormURL.value;
            const FormFileValue = FormFileURL.value; // storage URL, not the raw <input type="file"> value

            if (!FormTitleValue || !FormCategoryValue || !FormTaglineValue || !FormURLValue) {
                uploadStatus.textContent = "please fill out all required fields.";
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
                        FormFile: FormFileValue,
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
                    FormFile.value = "";
                    FormFileURL.value = "";
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