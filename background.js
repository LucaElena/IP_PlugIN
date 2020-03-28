//Background js
// "matches": ["https://facebook.com/*","https://instagram.com/*","https://twitter.com/*","https://tumblr.com/*"],
// "matches": ["<all_urls>"],
// "default_popup": "popup.html",
// "default_title": "PostIT Plugin"
// alert("Hello from your Chrome extension!");

console.log('Background Chrome extension running!');


// function buttonClicked(tab)
// function buttonClicked()
// {
	// console.log(tab);

// let params = {
	// active: true,
	// currentWindow: true
// }
// chrome.tabs.query(params , gotTabs);
	
// function gotTabs(tabs)
// {

	// let msg = {
		// txt: "hello",
		// url: tabs[0].url
		
		// }
	// console.log('Popup current url is :' +tabs[0].url );
	// chrome.tabs.sendMessage(tabs[0].id , msg);
// }
	
// }
// chrome.tabs.getCurrent(function callback)
// chrome.runtime.onMessage.addListener(gotMessage);
// function gotMessage(message, sender , sendResponse)
// {
	// console.log(message.txt);
	// console.log("URL-ul current este : " + message.url);
	// if(message.txt === "get_current_url")
	// {
		// let paragraphs = document.getElementsByTagName('p');
		// for(elt of paragraphs)
		// {
			// elt.style['backgroundColor'] = '#FF00FF';
		// }

	// }
// }



chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
		
        if (request.msg === "give_me_current_url")
		{
            console.log('Am primit intrebare :' + request.msg);
           
			/// find current tab url and send it 
			let params = {
				active: true,
				currentWindow: true
			}
			chrome.tabs.query(params , gotTabs);
			function gotTabs(tabs)
			{
				console.log('Si trimitem  raspunsul: ' +tabs[0].url);
				chrome.runtime.sendMessage({
					msg: "current_url", 
					data: {
						url: tabs[0].url
					}
				});
			}
        }
		if (request.msg === "current_url_received")
		{
			console.log('Am primit intrebare : current_url_received -> do nothing');
		}
    }
);

