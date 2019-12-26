// ==UserScript==
// @name        E-Hentai highlight thumb when open Anthology gallery from tag:artist
// @namespace   E-Hentai_highlight_thumb_when_open_Anthology_gallery_from_tag_artist
// @supportURL  https://github.com/zhuzemin
// @description E-Hentai 高亮缩图当打开Anthology gallery时来自tag:artist
// @include     https://exhentai.org/g/*
// @include     https://e-hentai.org/g/*
// @version     1.0
// @run-at      document-start
// @author      zhuzemin
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @license     CC Attribution-ShareAlike 4.0 International; http://creativecommons.org/licenses/by-sa/4.0/
// @grant       none
// ==/UserScript==
var config = {
  'debug': false
}
var debug = config.debug ? console.log.bind(console)  : function () {
};


var GetArtistStartImg = function() {
	debug("Start: GetArtistStartImg");
	if(document.referrer.includes("/tag/artist:")||window.location.href.includes("#/tag/artist:")){
		debug("here");
    var title=document.querySelector("#gn").textContent;
		debug("Title: "+title);
		if(title.includes("Anthology")||(title.includes("COMIC")&&title.match(/\d{4}-\d{2}/)!=null)){
      debug("here");
      var artist;
      try{
        artist=document.referrer.match(/\/tag\/artist:([\d\w\+]*)/)[1].replace("+"," ");
      }catch(e){
        artist=window.location.href.match(/\/tag\/artist:([\d\w\+]*)/)[1].replace("+"," ");
      }
			debug("Artist: "+artist);
			var divs=document.querySelectorAll("div.c1");
			for(var div of divs){
				var comment=div.querySelector("div.c6");
				debug(comment);
        if(comment.innerHTML.toLowerCase().includes(artist)){
          /*var links=comment.querySelectorAll("a");
          debug(links);
          for(var a of links){
            var textContent=a.textContent.toLowerCase();
            if(textContent.includes(artist)){
              var array=textContent.match(/(\d{1,4})/);
              debug(array);
              if(array!=null){
                var ArtistStartImg=parseInt(array[1]);
                debug("ArtistStartImg: "+ArtistStartImg);
                var object={
                  "ArtistStartImg":ArtistStartImg,
                  "artist":artist
                }
                return object;
              }
            }
          }*/
          var lines=comment.innerText.split("\n");
          debug(lines);
          for(var line of lines){
            var line=line.toLowerCase();
            if(line.includes(artist)){
              var array=line.match(/(\d{1,4})/);
              debug(array);
              if(array!=null){
                var ArtistStartImg=parseInt(array[1]);
                debug("ArtistStartImg: "+ArtistStartImg);
                var object={
                  "ArtistStartImg":ArtistStartImg,
                  "artist":artist
                }
                return object;
              }
            }
          }
        }
			}
		}
	}
	debug("End: GetArtistStartImg");
  return null;
}

GetCurrentPageTotalImg=function(){
	debug("Start: GetCurrentPageTotalImg");
  var divs=document.querySelectorAll("div.gdtl");
  debug(divs);
  if(divs!=null){
    var CurrentPageTotalImg=divs.length;
    debug("CurrentPageTotalImg: "+CurrentPageTotalImg);
    var object={
      "CurrentPageTotalImg":CurrentPageTotalImg,
      "divs":divs
    }
    return object;
  }
	debug("End: GetCurrentPageTotalImg");
  return null;
}

CreateStyle=function(){
  debug("Start: CreateStyle");
  var style=document.createElement("style");
  style.setAttribute("type","text/css");
  style.innerHTML=`
.glowbox {
     background: #4c4c4c; 
    //width: 400px;
    margin: 40px 0 0 40px;
    padding: 10px;
    -moz-box-shadow: 0 0 5px 5px #FFFF00;
    -webkit-box-shadow: 0 0 5px 5px #FFFF00;
    box-shadow: 0 0 5px 5px #FFFF00;
}
`;
  debug("Processing: CreateStyle");
  var head=document.querySelector("head");
  head.insertBefore(style,null);
  debug("End: CreateStyle");
}

init=function(){
  var ObjectArtistStartImg=GetArtistStartImg();
  var ArtistStartImg=ObjectArtistStartImg.ArtistStartImg;
  if(ArtistStartImg!=null){
     
  var ObjectCurrentPageTotalImg=GetCurrentPageTotalImg();
  var CurrentPageTotalImg=ObjectCurrentPageTotalImg.CurrentPageTotalImg;
    var ArtistStartImgInCurrentPage=ArtistStartImg%CurrentPageTotalImg-1;
    debug("ArtistStartImgInCurrentPage: "+ArtistStartImgInCurrentPage);
    if(window.location.href.includes("#/tag/artist:")){
      ArtistStartImg=ArtistStartImgInCurrentPage;
    }
    var CorrectPage=Math.ceil(ArtistStartImg/CurrentPageTotalImg)-1;
    debug("CorrectPage: "+CorrectPage);
  if(CorrectPage==0){
    CreateStyle();
    var div=ObjectCurrentPageTotalImg.divs[ArtistStartImgInCurrentPage];
    var img=div.querySelector("img");
    img.className +=" glowbox";
    debug(div);
    div.scrollIntoView();
  }
    else{
      window.location.href+="?p="+CorrectPage+"#/tag/artist:"+ObjectArtistStartImg.artist;
    }
    
     }
}

window.addEventListener('DOMContentLoaded', init);

/*
Exception: Error while performing task "pretty-print": Error: Unexpected character '`' (20:12)
[4]</pp.raise@resource://devtools/shared/acorn/acorn.js:940:13
[13]</pp.getTokenFromCode@resource://devtools/shared/acorn/acorn.js:2785:3
[13]</pp.readToken@resource://devtools/shared/acorn/acorn.js:2490:10
[13]</pp.nextToken@resource://devtools/shared/acorn/acorn.js:2482:66
[13]</pp.next@resource://devtools/shared/acorn/acorn.js:2431:3
[13]</pp.getToken@resource://devtools/shared/acorn/acorn.js:2435:3
prettyFast@resource://devtools/shared/pretty-fast/pretty-fast.js:778:15
@resource://devtools/server/actors/pretty-print-worker.js:41:24
createHandler/<@resource://devtools/shared/worker/helper.js:85:24

@resource://devtools/server/actors/pretty-print-worker.js:51:12
createHandler/<@resource://devtools/shared/worker/helper.js:85:24

*/