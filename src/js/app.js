import{ API } from"../node_modules/oba-wrapper/js/index.js";
import Quagga from "../node_modules/quagga";

const api = new API({
    key: "1e19898c87464e239192c8bfe422f280"
});
console.log(api);
//Imagine the functions toJson, cleanJSON and
//renderToDocument exist, and do what their
//name says.

(async () => {
    const iterator = await api.createIterator(
        "search/classification:prentenboek"
    );
    for await (const response of iterator) {
        console.log(response);
    }
})();

Quagga.init({
    inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#yourElement')    // Or '#yourElement' (optional)
    },
    decoder : {
        readers : ["code_128_reader"]
    }
}, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
});