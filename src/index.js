const electron = require('electron'); 
const localForage = require('localforage');
localForage.setDriver(localForage.INDEXEDDB);
const path = require('path'); 
// Importing dialog module using remote 
const dialog = require('electron').remote.dialog; 

global.lm = undefined;
global.te = undefined;

var val =0;
localForage.clear();

const fs = require('fs');
const { Console } = require('console');
const { FORMERR } = require('dns');
const { isRegExp } = require('util');
const { checkServerIdentity } = require('tls');
const { clear } = require('localforage');


var cnv =document.getElementById("canvas2");
cnv.style.right = '250px';
cnv.style.left = '0px';
cnv.style.top = '10px';
cnv.style.backgroundColor = '#E2F9ED';
var ctx2 = cnv.getContext("2d");
ctx2.font = "25px Calibri cursive";
ctx2.shadowBlur=17;
ctx2.fillText("Annotations",50,30);


let pdfDocument;
let PAGE_HEIGHT;
const DEFAULT_SCALE = 1.33;



document.getElementById("wait").style.display = "none";


// Read config .json
fs.readFile(__dirname+ '/../extraResources/config.json',  (err, jsonString) => {
  if (err) {
      console.log("Error reading file from disk:", err)
      return
  }
  try {
      const regex = JSON.parse(jsonString)
    global.lm = regex.LineMatcher;
    global.te = new RegExp(regex.TermExtractor,'g');
} catch(err) {
      console.log('Error parsing JSON string:', err)
  }
})

//End Read config .json

//Upload File
var uploadFile = document.getElementById('upload'); 
global.filepath = undefined; 
uploadFile.addEventListener('click', () => { 
          dialog.showOpenDialog({ 
              title: 'Select the File to be uploaded', 
              defaultPath: path.join(__dirname, '../assets/'), 
              buttonLabel: 'Upload', 
              // Restricting the user to only Text Files. 
              filters: [ 
                  { 
                      name: 'PDF', 
                      extensions: ['pdf'] 
                  }, ], 
              properties: ['openFile'] 
          }).then(file => { 
              console.log(file.canceled); 
              if (!file.canceled) { 
                global.filepath = file.filePaths[0].toString(); 

                if (global.filepath && !file.canceled) { 
                  fs.readFile(global.filepath, {encoding: 'utf-8'}, function(err,data) { 
                     if (!err) { 
                     } else { 
                          console.log(err); 
                      } 
                   }); 
                 }
              }   
          
            // Toggle Upload Button
            if (uploadFile.style.display === "none") {
              uploadFile.style.display = "block";
              } else {
             
                document.getElementById("wait").style.display = "block";   
              uploadFile.style.display = "none";
              }
            // Eng Toggle Upload Buton
         

            
// Importing BrowserWindow from Main Process 
const BrowserWindow = electron.remote.BrowserWindow; 
const FindInPage = require('electron-find').FindInPage;
const { remote, ipcRenderer } = require('electron')
//const { FindInPage } = require('../src/index.js')


let findInPage = new FindInPage(remote.getCurrentWebContents(), {
  preload: true,
  offsetTop: 6,
  offsetRight: 10
})


ipcRenderer.on('on-find', (e, args) => {
  findInPage.openFindWindow()
})

         
            function gettext1(pdfUrl){
           
              var pdf = pdfjsLib.getDocument(pdfUrl);
              return pdf.then(function(pdf) { // get all pages text
                var maxPages = pdf.numPages;
                var countPromises = []; // collecting all page promises
                for (var j = 1; j <= maxPages; j++) {
                  var page = pdf.getPage(j);
                  var txt = "";
                  countPromises.push(page.then(function(page) { // add page promise
                    var textContent = page.getTextContent();
                    return textContent.then(function(text){ 
                      var viewport1 = page.getViewport(DEFAULT_SCALE);
                    
                    function getTextCoordinates1(inputText){

        
                      for(var i=0; i<text.items.length; i++){

                        var tempArr = text.items[i].str;
                        tempArr = tempArr.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
                        tempArr = tempArr.trimStart();
                        tempArr = tempArr.trimEnd();
                        tempArr = tempArr.replace(/\s+/g,' ').trim();                       
                        tempArr = tempArr.replace('<b>' ,'');
                        var tempArr2;
                      if(i+1<text.items.length)
                       tempArr2 = tempArr + text.items[i+1].str; 
                        if(tempArr.includes(inputText)== true || tempArr2.includes(inputText)== true) 
                          {
                            var item = text.items[i];
                            var transform = item.transform;
                            var x = transform[4]*DEFAULT_SCALE;
                            var h = text.items[i].height;
                            var y = viewport1.height - ((transform[5] + h) * DEFAULT_SCALE);
            
                          }
                      }
                      
                    return [x,y,h];
                  }
                  //End Get text coordinates  

                  //Start Parsing and Storage
                  var x = undefined;
                  var y = undefined;
                  var h = undefined;  
                  let viewer = document.getElementById('viewer');
        

                  
                    var lines1 =[];
                   // var lines = text.items.str.join('');
                    for(var k =0; k<text.items.length; k++){
                      lines1[k] = text.items[k].str;
                     
                    }
                    var lines2 = lines1.join('');
                    var lines = lines2.split('.');
                  
                    for(var line = 0; line < lines.length; line++){
                      var tempflag =0;
                      lines[line] = lines[line].replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
                      lines[line] = lines[line].replace(/\s+/g,' ').trim();
                       lines[line] = lines[line].trimStart();
                       lines[line] = lines[line].trimEnd();
                      lines[line] = lines[line].replace('<b>' ,'');
                      var matchStr = global.lm[0];

                      for(var t=1; t<global.lm.length; t++){
                        
                        matchStr = matchStr + " " + global.lm[t];
                      }
                        if(lines[line].match(matchStr) != null){

                         var annot = lines[line];
                         var term = lines[line].match(global.te);
                      
                       var newTerm;
                          for(var f1=0; f1<term.length;f1++)
                          {
                            term[f1] = term[f1].trimStart();
                            term[f1] = term[f1].trimEnd();
                          }
                    
                          if(lines[line].search(global.te) ==0 )
                          newTerm = term[1];
                          else
                          newTerm = term[0];

                          var vals =getTextCoordinates1(newTerm);
                          x = vals[0]+150;
                          y = vals[1];
                          h = vals[2];

                         var x_c = [x];
                         var y_c = [y];
                         var h_c = [h];
                         var pg_c = [page.pageIndex+1];
        
                        
                          if (typeof x !== 'undefined')
                          var getData = 
                          {
                          "ann":annot,
                          "x_c": x_c,
                          "y_c": y_c,
                          "h_c": h_c,
                          "pg_c": pg_c
                          }
                          if (typeof x !== 'undefined')
                          localForage.setItem(newTerm, getData).then(() => {

                          })
                        }
                      }
                  //  });
                    ///End parsing and storage
                      return text.items.map(function (s) { 
                      
                        return s.str; }).join(''); // value page text 
                    });
                  }));
                }
                // Wait for all pages and join text
                return Promise.all(countPromises).then(function (texts) {
                 // trial();
                  return texts.join('');
                });
              });
            }
            gettext1(global.filepath).then(function (text) {
             
              document.getElementById("wait").style.display = "none";   
              done();
            }, 
            function (reason) {
              console.error(reason);
            });
            
            function done(){
       
              



            pdfjsLib.getDocument(global.filepath).then(pdf => {
            pdfDocument = pdf;
           
            let viewer = document.getElementById('viewer');
            for (let i=0; i<pdf.numPages; i++) {
              let page = createEmptyPage(i+1);
              viewer.appendChild(page);
            }

            loadPage(1).then(pdfPage => {
            let viewport = pdfPage.getViewport(DEFAULT_SCALE);
            PAGE_HEIGHT = viewport.height;
            document.body.style.width = `${viewport.width}px`;
             });
            });

            window.addEventListener('scroll', handleWindowScroll);

            function createEmptyPage(num) {
              let page = document.createElement('div');
              
              page.style.left = '150px';
              
              let canvas = document.createElement('canvas');
              let wrapper = document.createElement('div');
              let textLayer = document.createElement('div');


              page.className = 'page';
              wrapper.className = 'canvasWrapper';
              textLayer.className = 'textLayer';

              page.setAttribute('id', `pageContainer${num}`);
              page.setAttribute('data-loaded', 'false');
              page.setAttribute('data-page-number', num);

              canvas.setAttribute('id', `page${num}`);

              page.appendChild(wrapper);
              page.appendChild(textLayer);
              wrapper.appendChild(canvas);

           
             
              return page;
            }

            function loadPage(pageNum) {
            


        
              return pdfDocument.getPage(pageNum).then(pdfPage => {
                let page = document.getElementById(`pageContainer${pageNum}`);
                let canvas = page.querySelector('canvas');
                let wrapper = page.querySelector('.canvasWrapper');
                let container = page.querySelector('.textLayer');
                let canvasContext = canvas.getContext('2d');
                let viewport = pdfPage.getViewport(DEFAULT_SCALE);
         

                canvas.width = viewport.width*2;
                canvas.height = viewport.height*2 ;
                page.style.width = `${viewport.width}px`;
                page.style.height = `${viewport.height}px`;
                wrapper.style.width = `${viewport.width}px`;
                wrapper.style.height = `${viewport.height}px`;
                container.style.width = `${viewport.width}px`;
                container.style.height = `${viewport.height}px`;


                pdfPage.render({
                  canvasContext,
                  viewport
                });

                //Start Render
                pdfPage.getTextContent().then(textContent => {
                  pdfjsLib.renderTextLayer({
                    textContent,
                    container,
                    viewport,
                    textDivs: []
                  });

                 

                  function getTextCoordinates2(inputText){

                    for(var i=0; i<textContent.items.length; i++){

                      var tempArr = textContent.items[i].str;
                      tempArr = tempArr.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
                      tempArr = tempArr.trimStart();
                      tempArr = tempArr.trimEnd();                     
                      tempArr = tempArr.replace('<b>' ,'');
                      var tempArr2;
                      if(i+1<textContent.items.length)
                       tempArr2 = tempArr + textContent.items[i+1].str; 
    
                        if(tempArr.includes(inputText)== true || tempArr2.includes(inputText)== true) 
                        {

                          var item = textContent.items[i];
                   
                          var transform = item.transform;
                          var x = transform[4]*DEFAULT_SCALE;
                          var h = item.height;
                          var y = viewport.height - ((transform[5] + h) * DEFAULT_SCALE);
                        }
                    }
                    
                  return [x,y,h];
                }

                  var lines11 = [];
                  for(var k =0; k<textContent.items.length; k++){
                    lines11[k] = textContent.items[k].str;
                    
                  }
                  var lines22 = lines11.join('');
                  var lines3 = lines22.split('.');
            

                    localForage.iterate(function(value, key, iterationNumber) {
                      
                      for(var k1 =0; k1<lines3.length; k1++){
                        
                     
                        lines3[k1] = lines3[k1].replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
                        lines3[k1] = lines3[k1].replace(/\s+/g,' ').trim();                       
                        lines3[k1] = lines3[k1].replace('<b>' ,'');
                        var matchStr = global.lm[0];
  
                        for(var t=1; t<global.lm.length; t++){
                          matchStr = matchStr + " " + global.lm[t];
                        }
                         
                      if(lines3[k1].includes(key) && !(lines3[k1].match(matchStr))){
                      if(value!=null)
                       {
                        var vals1 =getTextCoordinates2(key);
                        x1 = vals1[0];
                        y1 = vals1[1];
                        h1 = vals1[2];
                        if (typeof x1 !== 'undefined'  && typeof y1 !== 'undefined'){
                         value.x_c.push(x1+150);
                         value.y_c.push(y1);
                         value.h_c.push(h1);
                         value.pg_c.push(pageNum);
                        var getData = 
                        {
                         "ann": value.ann,
                        "x_c":  value.x_c ,
                        "y_c":   value.y_c,
                        "h_c":  value.h_c ,
                        "pg_c": value.pg_c
                        }
                         localForage.removeItem(key).then(function() {

                         }).catch(function(err) {
                           // This code runs if there were any errors
                           console.log(err);
                         });
                        
               
                        localForage.setItem(key, getData).then(() => {
        
                        })

                     }
                    }
                  }


                  }
                  }).then(function() {

                  }).catch(function(err) {

                      console.log(err);
                  });


                  
                  var sameLines = [];
                  var flagArr = [];
                  localForage.iterate(function(value1, key1, iterationNumber1) {

                    localForage.iterate(function(value2, key2, iterationNumber2) {
     
                      for(var i1=0; i1<value1.x_c.length; i1++){
                        for(var i2=0; i2<value2.x_c.length; i2++){

                     
                      
                      if(key1 !== key2 && (value1.x_c[i1] < value2.x_c[i2] + viewport.width || value1.x_c[i1] > value2.x_c[i2] - viewport.width  ) && (value1.y_c[i1] < value2.y_c[i2] + value2.h_c[i2] && value1.y_c[i1] > value2.y_c[i2] - value2.h_c[i2]) && value1.pg_c[i1] === value2.pg_c[i2]){

                      if(flagArr[key1]!=1 && flagArr[key2]!=1){
                        sameLines.push({key1,key2});
                          flagArr[key1] = 1;
                          flagArr[key2] = 1;
                      }
                      }
                    }
                  }
                  }).then(function() {


                  }).catch(function(err) {

                      console.log(err);
                  });
                }).then(function() {

                }).catch(function(err) {
                    // This code runs if there were any errors
                    console.log(err);
                });

                          // Mouse Click and match
                          
                            function getMousePosition(page, event) { 
        
                            const rect = canvas.getBoundingClientRect();
                            const elementRelativeX = event.clientX - rect.left;
                            const elementRelativeY = event.clientY - rect.top;
                            global.xclick = elementRelativeX * canvas.width / rect.width;
                            global.yclick = elementRelativeY * canvas.height / rect.height;

   
                         localForage.iterate(function(value, key, iterationNumber) { 
   
                           function display(value, y1){
          
                           ctx2.font = "15px Trebuchet MS";

                            return(wrapText(ctx2,value.ann,5,70+y1,250,20));
                            function wrapText(context, text, x, y, maxWidth, lineHeight) {
                             var words = text.split(' ');
                             var line = '';
                              var y2 = y;
                             for(var n = 0; n < words.length; n++) {
                               var testLine = line + words[n] + ' ';
                               var metrics = context.measureText(testLine);
                               var testWidth = metrics.width;
                               if (testWidth > maxWidth && n > 0) {
                                 line = words[n] + ' ';
                                 y2 += lineHeight;
                               }
                               else {
                                 line = testLine;
                               }
                             }

                             if(y2<500){
                               var line = '';
                              for(var n = 0; n < words.length; n++) {
                                var testLine = line + words[n] + ' ';
                                var metrics = context.measureText(testLine);
                                var testWidth = metrics.width;
                                if (testWidth > maxWidth && n > 0) {
                                  context.fillText(line, x, y);
                                  line = words[n] + ' ';
                                  y += lineHeight;
                                }
                                else {
                                  line = testLine;
                                }
                
                              }
                             context.fillText(line, x, y);
                             return (y+lineHeight);
                             }

                             else{
                              y = 70;
                              var line = '';
                              context.clearRect(0,30,cnv.width,700);
                              for(var n = 0; n < words.length; n++) {
                                var testLine = line + words[n] + ' ';
                                var metrics = context.measureText(testLine);
                                var testWidth = metrics.width;
                                if (testWidth > maxWidth && n > 0) {
                                  context.fillText(line, x, y);
                                  line = words[n] + ' ';
                                  y += lineHeight;
                                }
                                else {
                                  line = testLine;
                                }
                              }
                              context.fillText(line, x, y);
                              return (y+lineHeight);
                             }
                           }
                          
                         }
                         
                           for (var l=0; l<value.x_c.length; l++){
                          if(global.xclick < value.x_c[l] + viewport.width && global.yclick < (value.y_c[l] + (value.h_c[l])) && global.yclick > (value.y_c[l]-(value.h_c[l])) && value.pg_c[l] == pageNum)
                          {

                            
                            val =display(value,val);

                            for(var sl=0; sl<sameLines.length; sl++)
                            {
                            if(sameLines[sl].key1 == key)
                            {
  
                          localForage.getItem(sameLines[sl].key2).then(function(value1) {

                            if((value.x_c[l] < value1.x_c + viewport.width || value.x_c[l] > value1.x_c - viewport.width  ) && (value.y_c[l] < value1.y_c + value.h_c[l] || value1.y_c < value.y_c[l] - value1.h_c) && value1.pg_c === value.pg_c[l])
                            val =display(value1,val);
                        })
                      }
                      if(sameLines[sl].key2 == key)
                      {
        
                    localForage.getItem(sameLines[sl].key1).then(function(value1) {
   
                      if((value.x_c[l] < value1.x_c + viewport.width || value.x_c[l] > value1.x_c - viewport.width  ) && (value.y_c[l] < value1.y_c + value.h_c[l] || value1.y_c < value.y_c[l] - value1.h_c) && value1.pg_c === value.pg_c[l])
                      val =display(value1,val);
                  })
                }
                    }

                          }
                        }
                      
            
                       }).then(function() {
                          }).catch(function(err) {
                            console.log(err);
                          });
                        }
                        page.addEventListener('click', function(e) { 
                            getMousePosition(page, e); 
                          });
                          // End Mouse Click and match
        

                });
                //End Render
                page.setAttribute('data-loaded', 'true');

                return pdfPage;
              });
            }

            function handleWindowScroll() {
              let visiblePageNum = Math.round(window.scrollY / PAGE_HEIGHT) + 1;
              
              let visiblePage = document.querySelector(`.page[data-page-number="${visiblePageNum}"][data-loaded="false"]`);
              if (visiblePage) {
                setTimeout(function () {
                  loadPage(visiblePageNum);
                });
              }
            }

          }


//Upload File Continuation
  }).catch(err => { 
    console.log(err) 
  }); 
}); 

//End Upload File