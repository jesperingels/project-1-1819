// API wrapper module
import{ API } from"../node_modules/oba-wrapper/js/index.js";

const scanButton = document.getElementById('scan');
const ARButton = document.getElementById('AR');
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

// function insertHTML() {
//     head.insertAdjacentHTML('afterbegin', '<script id="quagga-script" src="src/node_modules/quagga/dist/quagga.min.js"></script>');
//
//     // const quaggaScript = document.querySelector('script[id="quagga-script"]');
//     //
//     //
//     // console.log(Quagga);
//     //
//     // window.addEventListener('load', scanner.init);
//     //
//     // // debugger;
//     //
//     // if (quagga) {
//     //     scanner.init();
//     // } else {
//     //     console.log('script not loaded');
//     // }
// }

// require.defined("my/awesome/defined/module");

const api = new API({
    key: "1e19898c87464e239192c8bfe422f280"
});
console.log(api);

const data = {

    render: async (endpoint) => {
        const iterator = await api.createIterator(`search/${endpoint}`);
        // const iterator = await api.createIterator(`search/9789020415629`);

        for await (const response of iterator) {

            console.log(response);

            const bookTitle = response.titles.title._text;
            const bookInfo = document.querySelector('.book-info');
            const infoWrap = document.createElement('div');
            const elTitle = document.createElement('h2');

            document.getElementById("quagga-script").outerHTML = "";
            document.querySelector('video').style.display = 'none';
            document.querySelector('canvas').style.display = 'none';

            elTitle.textContent = bookTitle;

            bookInfo.style.display = 'flex';
            bookInfo.appendChild(infoWrap);
            infoWrap.appendChild(elTitle);

            ARButton.style.display = 'block';

            if (response.identifiers.isbn-id._text === "=9789020415629") {
                ARButton.addEventListener('click', AR.showTheCallOfTheWild);
            } else {
                console.log('wrong book');
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

            Quagga.onDetected((res)=>{
                console.log(res.codeResult.code);

                data.render(res.codeResult.code);

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
        document.body.insertAdjacentHTML('afterbegin', '<a-scene embedded arjs=\'sourceType: webcam;\'> <a-assets> <video id="video" src="src/video/callofthewild.mp4" autoplay loop="true"></video> <img id="tower" src="src/img/watchtower.jpg"> </a-assets> <a-plane position=\'0 0 0\' rotation="90 0 180"> <a-video src="#video"></a-video> </a-plane> <a-marker-camera preset=\'hiro\'></a-marker-camera></a-scene>')
    }
};







