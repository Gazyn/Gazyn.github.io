function switchTab(a) {
	for(var i = 1; i<=tabCount; i++) {
		document.getElementById("tab"+i).style.display="none";
		document.getElementById("tab"+i).className = "tab-pane fade";
		document.getElementById("tab"+i+"Button").className = "nav-link innerTabButton";
	}
	document.getElementById("tab"+a).style.display="inline";
	document.getElementById("tab"+a).className = "tab-pane fade active show";
	if(a===1) {
		document.getElementById("tab"+a+"Button").className = "nav-link active innerTabButton";
	} else {
		document.getElementById("tab"+a+"Button").className = "nav-link active show innerTabButton";
	}
}
switchTab(1);