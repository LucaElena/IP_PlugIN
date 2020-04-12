//Background js
// "matches": ["https://facebook.com/*","https://instagram.com/*","https://twitter.com/*","https://tumblr.com/*"],
// "matches": ["<all_urls>"],
// "default_popup": "popup.html",
// "default_title": "PostIT Plugin"
// alert("Hello from your Chrome extension!");

console.log('Background Chrome extension running!');






chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
		
        if (request.txt === "give_me_current_url")
		{
            console.log('Am primit intrebare :' + request.txt);
           
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
		if (request.txt === "open_auth_url")
		{
            console.log('Am primit intrebare :' + request.txt);

			chrome.tabs.create({ url: request.data.url });

           

        }
	}
);

