 const trashItems = [
        "Coffee cup",
        "Concrete",
        "Cup",
        "Dirty food container",
        "Dirty Plate",
        "Plastic Fork",
        "Plastic Knife",
        "Plastic Spoon",
        "Wrapper",
        "Stick",
        "Pizza Topper"
    ];
      const recyclableItems= [
        "Bottle Cap",
        "Cardbard",
        "Foil",
        "Foil food container",
        "Paper Box",
        "Plastic bottle",
        "Plastic Container"
    ];
      const compostItems = [
        "Napkin",
        "Paper food container"
    ];

        const URL = "https://teachablemachine.withgoogle.com/models/PweO859QY/";

        let model, webcam, maxPredictions;

        async function init() {
            const modelURL = URL + "model.json";
            const metadataURL = URL + "metadata.json";

            model = await tmImage.load(modelURL, metadataURL);
            maxPredictions = model.getTotalClasses();

            const flip = true;
            webcam = new tmImage.Webcam(200, 200, flip);
            await webcam.setup();
            await webcam.play();

            document.getElementById("webcam-container").appendChild(webcam.canvas);
            window.requestAnimationFrame(loop); // Start the loop for live preview
        }

        async function loop() {
            webcam.update();
            window.requestAnimationFrame(loop);
        }

        async function captureImage() {
            webcam.update(); // Update the webcam frame
            const prediction = await model.predict(webcam.canvas);
            displayHighestPrediction(prediction);

        }

        function showBinImages(itemType) {
           const binImagesDiv = document.getElementById("bin-images");
            binImagesDiv.style.visibility = "visible"; // Make bin images visible

            // Clear any previous bin images
            binImagesDiv.innerHTML = '';

           // Determine which bin image to show based on the item type
             let binImageSrc = '';
            if (itemType === 'Recyclable') {
              binImageSrc = '/images/Recyclable.jpg';
             } else if (itemType === 'Compostable') {
             binImageSrc = '/images/compost.jpg';
             } else if (itemType === 'Trash') {
            binImageSrc = '/images/trash.jpg';
             }

    const binImg = document.createElement("img");
    binImg.src = binImageSrc;
    binImg.alt = `${itemType} Bin`;
    binImagesDiv.appendChild(binImg);
}

         function displayHighestPrediction(predictions) {
           let highestPrediction = predictions[0];


           for (let i = 1; i < predictions.length; i++) {
             if (predictions[i].probability > highestPrediction.probability) {
               highestPrediction = predictions[i];
             }
           }
            // prints and determains if trash, recycling, or compost here
           if (highestPrediction.probability > 0.5) {
             if (recyclableItems.includes(highestPrediction.className)) {
               document.getElementById("label-container").innerHTML =
                 `Prediction: ${highestPrediction.className} - Recyclable! Probability: ${highestPrediction.probability.toFixed(2)}`;
               clearImages();
               showBinImages('Recyclable');
               showItemImage(highestPrediction.className);
             } else if (trashItems.includes(highestPrediction.className)){
               document.getElementById("label-container").innerHTML =
                 `Prediction: ${highestPrediction.className} - Trash. Probability: ${highestPrediction.probability.toFixed(2)}`;
               clearImages();
               showBinImages('Trash');
               showItemImage(highestPrediction.className);
             } else if (compostItems.includes(highestPrediction.className)) {
                 document.getElementById("label-container").innerHTML =
                 `Prediction: ${highestPrediction.className} - <span class="compostable-word">Compostable!</span> Probability: ${highestPrediction.probability.toFixed(2)}`;
                clearImages();
                showItemImage(highestPrediction.className);
                showBinImages('Compostable');
}
           } else {
             document.getElementById("label-container").innerHTML =
               "Please take a new picture.";
             clearImages();
           }
         }

      function showButton()
        {
          {document.getElementById("button2").style.visibility="visible";}
          {document.getElementById("button1").style.visibility="hidden";}
        }
        function clearImages() {
        document.getElementById("item-images").innerHTML = '';
        document.getElementById("bin-images").style.visibility = "hidden";
        }

      function showItemImage(className) {
          const itemImagesDiv = document.getElementById("item-images");

          itemImagesDiv.innerHTML = '';

          let itemImageSrc = `/images/${className}.jpg`;

          // Create an image element and append it
          const itemImg = document.createElement("img");
          itemImg.src = itemImageSrc;
          itemImg.alt = className;
          itemImagesDiv.appendChild(itemImg);
      }



