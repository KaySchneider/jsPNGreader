/**
 * put there the binary image source
 * @param imageSource
 */
var pngreader = function (imageSource) {
    this.source = imageSource;
    this.header = null;
    this.sourceInfo();
};
pngreader.prototype.sourceInfo = function () {
    var inputStr = this.source;
    var outputStr = "";
    var i = 0;
    var iDataField,iData,ihdrHeader,ihdrsize;
    var icalc = 0;
    var iData =  0;
    iDataField = new Array();
    while (i < 128) {
        //all three "& 0xff" added below are there to fix a known bug
        //with bytes returned by xhr.responseText
        ihdrsize = false
        ihdrHeader = false;
        iData  = false;


        if(i == 8) {
            //now the chunking header beginns IHDR
            ihdrsize = true;
        }

        if(i == 12) {
            ihdrHeader = true;
        }
        if(i == 16 || i < i+icalc) {
            iData = true;
        }

        if(i > i+icalc) {
            break;
        }
        var byte1 = inputStr.charCodeAt(i++) & 0xff;
        var byte2 = inputStr.charCodeAt(i++) & 0xff;
        var byte3 = inputStr.charCodeAt(i++) & 0xff;
        var byte4 = inputStr.charCodeAt(i++) & 0xff;

        var enc1 = byte1 >> 2;
        var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);

        if( ihdrsize === true) {
            var Isize, icalc;
            Isize  = toInt( new ArrayBuffer(byte1,byte2,byte3 ,byte4),0 );
            icalc = byte4+i;
            console.log(byte4, icalc);
        }

        if ( ihdrHeader === true) {
            var iheader;
            iheader = byte1+ '' +byte2+ '' +byte3 + '' + byte4;
        }



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
        if(iData === true) {
            iDataField.push( new Array( byte1,byte2,byte3,byte4));
        }
    }
    var returnA;
    returnA = {'width':toInt(iDataField[1],0), 'height':toInt(iDataField[2],0), 'bitdepth':iDataField[3][0], 'colorType':iDataField[3][1], 'compressionMethod':iDataField[3][2], 'filterMethod':iDataField[3][3], 'interLaceMethod':iDataField[4][0]};
    this.header = returnA;
    console.log(returnA);
    this.printInfo();
};

/**
 * print out the information about the png
 */
pngreader.prototype.printInfo = function () {
    var div = document.createElement("div");
    var iText = 'Image width:'+ this.header.width + ' Image height: ' + this.header.height + ' bitdepth: ' + this.header.bitdepth + ' colorType:' + this.header.colorType + ' compressionMethod:' + this.header.comressionMethod + ' filterType:' + this.header.filterMethod + ' interlace Method' + this.header.interLaceMethod;
    var textuallInfo = document.createTextNode(iText);
    div.appendChild(textuallInfo);
    document.body.appendChild(div);
};




