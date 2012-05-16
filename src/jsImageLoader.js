/**
 * new js imagePreloader
 */
var jsImagePreloader = function () {
    this.request = null;
    this.imageId = null;
    this.progressBar = null;
};
/**
 * loading an image
 */
jsImagePreloader.prototype.loadImage = function () {
    this.request = new XMLHttpRequest();

    (function (jsImgO) {
        jsImgO.request.onloadstart = function () {
            jsImgO.showProgressBar();
        };
        jsImgO.request.onprogress = function (e) {
            jsImgO.updateProgressBar(e);
        };
        jsImgO.request.onload = function () {

        };
        jsImgO.request.onloadend = function () {
            var png = new pngreader(jsImgO.request.responseText);
            jsImgO.showImage();
        };
        jsImgO.request.open("GET", 'img/testImage.png', true);
        jsImgO.request.overrideMimeType('text/plain; charset=x-user-defined');
        jsImgO.request.send(null);
    })(this);
};

jsImagePreloader.prototype.showProgressBar = function () {
    this.progressBar = document.createElement("progress");
    this.progressBar.id = 'prod';
    this.progressBar.value = 0;
    this.progressBar.max = 100;
    this.progressBar.removeAttribute("value");
    document.body.appendChild(this.progressBar);
};

jsImagePreloader.prototype.updateProgressBar = function (e) {
    if (e.lengthComputable)
        this.progressBar.value = e.loaded / e.total * 100;
    else
        this.progressBar.removeAttribute("value");
};

/**
 * shows an image
 *
 * return here only the base64 encoded content and throw it to the canvas
 */
jsImagePreloader.prototype.showImage = function () {
    var imageElement = new Image();
   // imageElement.setAttribute('style' , "display:block");
    imageElement.setAttribute('id', 'checkMe');
    this.hideProgressBar();
    (function (fbObj){
        //wait if the image in base64encoded is loaded by the dom and send the message
        imageElement.onload = function () {

        };
    })(this);
    imageElement.src = "data:image/png;base64," + this.base64Encode(this.request.responseText);
    imageElement.width ="400";
    document.body.appendChild(imageElement);

};

jsImagePreloader.prototype.hideProgressBar = function () {
    $('#prod').hide();
    document.body.removeChild(this.progressBar);
};



jsImagePreloader.prototype.base64Encode = function (inputStr) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var outputStr = "";
    var i = 0;
    while (i < inputStr.length) {
        //all three "& 0xff" added below are there to fix a known bug
        //with bytes returned by xhr.responseText
        var byte1 = inputStr.charCodeAt(i++) & 0xff;
        var byte2 = inputStr.charCodeAt(i++) & 0xff;
        var byte3 = inputStr.charCodeAt(i++) & 0xff;

        var enc1 = byte1 >> 2;
        var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);

        var enc3, enc4;
        if (isNaN(byte2)) {
            enc3 = enc4 = 64;
        }
        else {
            enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
            if (isNaN(byte3)) {
                enc4 = 64;
            }
            else {
                enc4 = byte3 & 63;
            }
        }

        outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
    }

    return outputStr;
};

var toInt = function(bytes, index){
    return (bytes[index] << 24) | (bytes[index + 1] << 16) | (bytes[index + 2] << 8) | bytes[index + 3];
};



