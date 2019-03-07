// API wrapper module
import{ API } from"../node_modules/oba-wrapper/js/index.js";

const scanButton = document.getElementById('scan');
const ARButton = document.getElementById('AR');
const loader = document.getElementById('loader');
// const head = document.querySelector('head');


scanButton.addEventListener('click', async () => {

    //use css custom property?
    scanButton.style.display = 'none';

    // loadScript("src/node_modules/quagga/dist/quagga.min.js", scanner.init);

    // await insertHTML();

    scanner.init();


});



// function loadScript(url, callback) {
//     // Adding the script tag to the head as suggested before
//     const head = document.head;
//     const script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = url;
//
//     // Then bind the event to the callback function.
//     // There are several events for cross browser compatibility.
//     script.onreadystatechange = callback;
//     script.onload = callback;
//
//     // Fire the loading
//     head.appendChild(script);
// }

const api = new API({
    key: "1e19898c87464e239192c8bfe422f280"
});
console.log(api);

const data = {

    render: async (endpoint) => {
        const iterator = await api.createIterator(`search/${endpoint}`);
        // const iterator = await api.createIterator(`search/9789020415629`);

        if (!iterator) {
            alert('Code onbekend, probeer opnieuw!')
        } else {

            for await (const response of iterator) {

                console.log(response);

                loader.style.display = 'none';

                const bookTitle = response.titles.title._text;
                const bookInfo = document.querySelector('.book-info');
                const infoWrap = document.createElement('div');
                const elTitle = document.createElement('h2');
                const elImg = document.createElement('img');
                const imgLink = response.coverimages.coverimage[0]._text;


                document.getElementById("quagga-script").outerHTML = "";
                document.querySelector('video').style.display = 'none';
                document.querySelector('canvas').style.display = 'none';

                elTitle.textContent = bookTitle;
                elImg.src = imgLink.replace('size=70', 'size=300');

                bookInfo.style.display = 'flex';
                bookInfo.appendChild(infoWrap);
                infoWrap.appendChild(elTitle);
                infoWrap.appendChild(elImg);

                ARButton.style.display = 'block';
                infoWrap.classList.add('book-content');

                // console.log(response.identifiers["isbn-id"]._text);
                // console.log(response.identifiers["isbn-id"]._text === "=9789020415629")

                if (response.identifiers["isbn-id"]._text === "=9789020415629") {
                    ARButton.addEventListener('click', AR.showTheCallOfTheWild);
                }
                else if(response.identifiers["isbn-id"][0]._text === "=9789000365043") {
                    ARButton.addEventListener('click', AR.showHawking);
                }
                else {
                    // console.log('wrong book');
                    alert('wrong book')
                }
            }
        }
    }
};

const scanner = {

    init: () => {
        console.log('init scanner');
        if(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
            Quagga.init({
                inputStream : {
                    name : "Live",
                    type : "LiveStream",
                    target: document.querySelector('body')    // Or '#yourElement' (optional)
                },
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

            console.log(Quagga.onDetected.data);

        } else{
            console.log('err')
        }
    }

};

const AR = {
    showTheCallOfTheWild: () => {
        document.body.insertAdjacentHTML('afterbegin', '<a-scene embedded arjs=\'sourceType: webcam;\'> <a-assets> <video id="video" src="src/video/callofthewild.mp4" autoplay loop="true"></video> </a-assets> <a-plane position=\'3 0 0\' rotation="90 0 180" scale="4 3 0"> <a-video src="#video"></a-video> </a-plane> <a-marker preset=\'hiro\'></a-marker></a-scene>');
        // if(document.querySelector("a-marker-camera").object3D.visible === false) {
        //         //     document.querySelector('a-plane').style.display = 'none';
        //         // } else {
        //         //     document.querySelector('a-plane').style.display = 'block';
        //         // }
    },

    showHawking: ()=>{
        document.body.insertAdjacentHTML('afterbegin', '<a-scene embedded arjs=\'sourceType: webcam;\'> <a-assets> <video id="video" src="src/video/hawking.mp4" autoplay loop="true"></video> </a-assets> <a-plane position=\'3 0 0\' rotation="90 0 180" scale="4 3 0"> <a-video src="#video"></a-video> </a-plane> <a-marker-camera preset=\'hiro\'></a-marker-camera></a-scene>');
    }
};







