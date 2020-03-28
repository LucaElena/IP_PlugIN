//Content js
// "matches": ["https://www.facebook.com/*","https://www.instagram.com/*","https://www.twitter.com/*","https://www.tumblr.com/*"],
// "matches": ["<all_urls>"],
// alert("Hello from your Chrome extension!");

console.log('Hello from your Chrome extension!');

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender , sendResponse)
{
	console.log(message.txt);
	// console.log("URL-ul current este : " + message.url);
	// if(message.txt === "hello")
	// {
		// let paragraphs = document.getElementsByTagName('p');
		// for(elt of paragraphs)
		// {
			// elt.style['backgroundColor'] = '#FF00FF';
		// }

	// }
}