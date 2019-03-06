import{ API } from"../node_modules/oba-wrapper/js/index.js";

//Imagine the functions toJson, cleanJSON and
//renderToDocument exist, and do what their
//name says.

// (async () => {
//     const iterator = await api.createIterator("search/9781472209344"
//     );
//     for await (const response of iterator) {
//         console.log(response);
//     }
// })();
const scan = document.getElementById('scan');
const head = document.querySelector('head');


scan.addEventListener('click', () => {

    //use css custom property?
    scan.style.display = 'none';

     function insertHTML() {
        head.insertAdjacentHTML('afterbegin', '<script id="quagga-script" src="src/node_modules/quagga/dist/quagga.min.js"></script>');
        // quagga.addEventListener('onload', scanner.init);

         const quagga = document.querySelector('script[id="quagga-script"]');
         console.log(quagga);

         // debugger;

         if (quagga) {
             scanner.init();
         } else {
             console.log('script not loaded');
         }
    }

    insertHTML();

});

const api = new API({
    key: "1e19898c87464e239192c8bfe422f280"
});
console.log(api);

const data = {

    req: async (endpoint) => {
        const iterator = await api.createIterator(`search/${endpoint}`);

        for await (const response of iterator) {
            console.log(response)
            // document.getElementById('text-container').textContent = response.titles.short-title._text
        }
    }
};

const scanner = {

    init: () => {
        console.log('init scanner');
        if(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function' && document.getElementById('quagga-script')) {
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
                data.req(res.codeResult.code);
                Quagga.stop();
            });

            console.log(Quagga.onDetected.data);

        } else{
            console.log('err')
        }
    }

};






