var isClicked = false;
var isShowed = false;

function demo1(){
	var up = document.getElementById("container1");
	var upbag = document.getElementById("demo1");
	var down=document.getElementById("container2");
	var downbag=document.getElementById("index");
	upbag.style.visibility="visible";
	up.style.webkitTransform="translateZ(0)";
	down.style.webkitTransform="translateZ(-200px)";
	
	upbag.style.webkitTransform="translateY(0)";
	up.style.webkitTransform="rotateX(0)";
	down.style.webkitTransform="rotateX(-90deg)";
	downbag.style.webkitTransform="translateY(100%)";
	//response.setHeader("refresh","3;url=www.baidu.com"); 
	//setTimeout("location.href='http://www.baidu.com'",1200);	
}
function transform(){
	if(isClicked){
		document.getElementById('main').style.transform='translateX(0) rotateY(0deg)';
		document.getElementById('nav').style.transform='translateX(-120px)';
	}
	else{
		document.getElementById('main').style.transform='translateX(120px) rotateY(30deg)';
		document.getElementById('nav').style.transform='translateX(0)';
	}
	isClicked=!isClicked;
}

function show(){
	if(isShowed){
		document.getElementById("head").style.filter='blur(0px)';
		document.getElementById("main").style.filter='blur(0px)';
		document.getElementById("nav").style.filter='blur(0px)';
		//document.getElementById("ov-btmleft").style.visibility='hidden';
		//video.parentNode.removeChild(video);
		document.getElementById("ov-btmleft").style.display='none';
	}
	else{
		document.getElementById("head").style.filter='blur(10px)';
		document.getElementById("main").style.filter='blur(10px)';
		document.getElementById("nav").style.filter='blur(10px)';
		//document.getElementById("ov-btmleft").style.visibility='visible';
		//video.parentNode.addChild(video);
		document.getElementById("ov-btmleft").style.display='inline';
	}
	isShowed=!isShowed;
}

window.onload=function(){
    function $(id){
      return document.getElementById(id);
    }
//鼠标进
    $("arr").onmouseover=function(){
		if(!isClicked){
			$("main").style.transform='translateX(10px) rotateY(2deg)';
			$("nav").style.transform='translateX(-110px)';
		}
    }
//鼠标出
    $("arr").onmouseout=function(){
		if(!isClicked){
			$("main").style.transform='translateX(0) rotateY(0)';
			$("nav").style.transform='translateX(-120px)';
		}
    }
	var ht=$("main").offsetHeight-100;
	$("main").style.height=ht+'px';
}