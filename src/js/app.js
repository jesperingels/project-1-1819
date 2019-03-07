// API wrapper module
import{ API } from"../node_modules/oba-wrapper/js/index.js";

const scanButton = document.getElementById('scan');
const ARButton = document.getElementById('AR');
const loader = document.getElementById('loader');
const resetButton = document.getElementById('reset');

// Button events
resetButton.addEventListener('click', ()=>{
    document.location.reload();
});

scanButton.addEventListener('click', () => {
    scanButton.style.display = 'none';
    scanner.init();
});

const api = new API({
    key: "1e19898c87464e239192c8bfe422f280"
});

const data = {

    render: async (endpoint) => {
        const iterator = await api.createIterator(`search/${endpoint}`);

        if (!iterator) {
            alert('Code onbekend, probeer opnieuw!')
        } else {

            for await (const response of iterator) {

                console.log(response);

                // Hide loader
                loader.style.display = 'none';

                const bookTitle = response.titles.title._text;
                const bookInfo = document.querySelector('.book-info');
                const infoWrap = document.createElement('div');
                const elTitle = document.createElement('h2');
                const elImg = document.createElement('img');
                const imgLink = response.coverimages.coverimage[0]._text;

                // Disable scanner library
                document.getElementById("quagga-script").outerHTML = "";
                document.querySelector('video').style.display = 'none';
                document.querySelector('canvas').style.display = 'none';

                // Bind data to elements
                elTitle.textContent = bookTitle;
                elImg.src = imgLink.replace('size=70', 'size=300');
                bookInfo.style.display = 'flex';
                bookInfo.appendChild(infoWrap);
                infoWrap.appendChild(elTitle);
                infoWrap.appendChild(elImg);

                // Add styling
                ARButton.style.display = 'block';
                infoWrap.classList.add('book-content');


                if (response.identifiers["isbn-id"]._text === "=9789020415629") {
                    ARButton.addEventListener('click', AR.showTheCallOfTheWild);

                }
                else if(response.identifiers["isbn-id"][0]._text === "=9789000365043") {
                    ARButton.addEventListener('click', AR.showHawking);
                }
                else {
                    alert('wrong book')
                }
            }
        }
    }
};

const scanner = {

    init: () => {
        if(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
            Quagga.init({
                inputStream : {
                    name : "Live",
                    type : "LiveStream",
                    target: document.querySelector('body')
                },
                // Set barcode type
                decoder : {
                    readers : ["ean_reader"]
                }
            }, function(err) {
                if (err) {
                    console.log(err);
                    return
                }
                console.log("Initialization finished. Ready to start");
                Quagga.start();
            });

            // On detection of barcode
            Quagga.onDetected((res)=>{
                console.log(res.codeResult.code);

                // Start render data with barcode as parameter
                data.render(res.codeResult.code);
                // Show loader
                loader.style.display = 'flex';
                // Stop scanning for barcode
                Quagga.stop();
            });

        } else{
            console.log('err')
        }
    }

};

const AR = {
    showTheCallOfTheWild: () => {
        document.body.insertAdjacentHTML('afterbegin', '<a-scene embedded arjs=\'sourceType: webcam;\'> <a-assets> <video id="videoCall" src="src/video/callofthewild.mp4" autoplay loop="true"></video> </a-assets> <a-plane position=\'0 0 0\' rotation="90 0 180" scale="-4 3 0"> <a-video src="#videoCall"></a-video> </a-plane> <a-marker-camera preset=\'hiro\'></a-marker-camera></a-scene>');
        resetButton.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    showHawking: ()=>{
        document.body.insertAdjacentHTML('afterbegin', '<a-scene embedded arjs=\'sourceType: webcam;\'> <a-assets> <video id="videoHawk" src="src/video/hawking.mp4" autoplay loop="true"></video> </a-assets> <a-plane position=\'0 0 0\' rotation="90 0 180" scale="-4 3 0"> <a-video src="#videoHawk"></a-video> </a-plane> <a-marker-camera preset=\'hiro\'></a-marker-camera></a-scene>');
        resetButton.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
};







