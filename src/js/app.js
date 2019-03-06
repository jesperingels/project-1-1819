import{ API } from"../node_modules/oba-wrapper/js/index.js";

const api = new API({
    key: "1e19898c87464e239192c8bfe422f280"
});
console.log(api);

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

const data = {

    req: async (string) => {
        const iterator = await api.createIterator(`search/${string}`);
        
        for await (const response of iterator) {
            console.log(response);
        }
    }
};


if(navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function'){
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
    // document.querySelector('#finder').style.setProperty("display","none");
    Quagga.onDetected((res)=>{
        console.log(res.codeResult.code);
        document.getElementById('text-container').textContent = res.codeResult.code;
        data.req(res.codeResult.code);
        Quagga.stop();
    });

    console.log(Quagga.onDetected.data);
}else{
    console.log('err')
}

// const req = {
//
// };



