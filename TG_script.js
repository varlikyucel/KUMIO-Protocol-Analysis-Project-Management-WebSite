document.addEventListener("DOMContentLoaded", function () {
  fetch("TG-fileList.xlsx")
    .then((response) => response.arrayBuffer())
    .then((data) => {
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const anchorElements = document.querySelectorAll("#TG-fileList li a"); // Target only anchor elements
      const paragraphCanvas = document.getElementById("paragraphCanvas");
      let isHoveringOverPopup = false;
      let hidePopupTimeout;

      // Handle mouse entering an anchor element
      anchorElements.forEach(function (linkElement) {
        linkElement.addEventListener("mouseenter", function (event) {
          clearTimeout(hidePopupTimeout); // Clear any pending popup hide action

          const listItemText = linkElement.textContent.trim();
          const paragraph = jsonData.find((p) => p.id === listItemText);
          if (paragraph) {
            // Clear the existing content in the popup
            paragraphCanvas.innerHTML = "";

            // Create the video element dynamically
            const video = document.createElement("video");
            video.src = `../videos/TG/${listItemText}.mp4`; // Assuming the ID is the video name
            video.controls = true;
            video.style.width = "100%"; // Make video fill the width of the text box
            video.style.height = "auto"; // Maintain the aspect ratio

            // Append video and text description to the paragraphCanvas
            paragraphCanvas.appendChild(video);

            const description = document.createElement("p");
            description.textContent = paragraph.description;
            paragraphCanvas.appendChild(description);

            // Position the popup near the cursor
            paragraphCanvas.style.left = event.pageX + 15 + "px";
            paragraphCanvas.style.top = event.pageY + 15 + "px";

            paragraphCanvas.style.display = "block"; // Show the popup
          }
        });

        // Handle mouse leaving the anchor element
        linkElement.addEventListener("mouseleave", function () {
          hidePopupTimeout = setTimeout(function () {
            if (!isHoveringOverPopup) {
              paragraphCanvas.style.display = "none"; // Hide the popup
            }
          }, 300); // Delay to ensure the popup doesn't disappear immediately
        });
      });

      // Handle mouse entering the popup itself
      paragraphCanvas.addEventListener("mouseenter", function () {
        clearTimeout(hidePopupTimeout); // Clear the timeout to prevent hiding
        isHoveringOverPopup = true; // Keep the popup open
      });

      // Handle mouse leaving the popup
      paragraphCanvas.addEventListener("mouseleave", function () {
        isHoveringOverPopup = false; // Set to false when leaving the popup
        hidePopupTimeout = setTimeout(function () {
          paragraphCanvas.style.display = "none"; // Hide the popup when leaving it
        }, 300); // Delay to ensure it doesn't disappear immediately
      });
    })
    .catch((error) =>
      console.error("Error fetching or parsing Excel file:", error)
    );
});
