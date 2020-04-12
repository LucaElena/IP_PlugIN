//Content js
// "matches": ["https://www.facebook.com/*","https://www.instagram.com/*","https://www.twitter.com/*","https://www.tumblr.com/*"],
// "matches": ["<all_urls>"],
// alert("Hello from your Chrome extension!");

console.log('Hello from your Chrome extension!');

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender , sendResponse)
{
	console.log('Am primit intrebarea: ' + message.txt);
	let current_postdata = {
							txt: "current_postdata_notdefined", 
							data: {
								post_text: "",
								post_imgs: [],
								post_videos: []
							}
							};
	///Twitter - done
	///Linkedin - done with minor bugs
	///Facebook - done with some bugs
	///Instagram - not working
	///Tumblr - not working - content is inside a script/container
	// Extract post data from different social platforms:
	// This tested and is working with some problems: Facebook 
	// Problem : image is small 100x100 px -> same problem
	// Test on other pc -> work 
	if(message.txt === "give_me_current_postdata_facebook")
	{
		let divs = document.getElementsByTagName('div');
		for(var i = divs.length - 1; i >= 0; i--)
		{
			var div = divs[i];
			//extract text from post 
			if(divs[i].className == "_1mf _1mj")
			{

				console.log('Found facebook post text='+ divs[i].textContent);
				current_postdata.txt = "current_postdata_defined_facebook";
				current_postdata.data.post_text = divs[i].textContent;

			}
			//extract img from post 
			if(divs[i].className == "_jfc")
			{
				console.log('Found facebook post img='+ divs[i].getElementsByTagName('img')[0].src);
				current_postdata.txt = "current_postdata_defined_facebook";
				current_postdata.data.post_imgs.push( divs[i].getElementsByTagName('img')[0].src);
			}
			//extract video from post
			if(divs[i].className == "cauta clasa care trebuie")
			{
				console.log('Found facebook post video='+ divs[i].getElementsByTagName('video')[0].src);
				current_postdata.txt = "current_postdata_defined_facebook";
				current_postdata.data.post_videos.push( divs[i].getElementsByTagName('video')[0].src);
			}
			
		}
		console.log('divs numbers = ' +divs.length);
	}
	// This tested and is working with some problems on develop pc: Instagram
	// Problem 1: You could post only from mobile on instgram -> simulate mobile CTRL + SHIFT + M in console and change www with m in URL if not change automaticaly
	// Problem 2: Story or Image post 
	// Test on other pc -> not working
	if(message.txt === "give_me_current_postdata_instagram")
	{
		let divs = document.getElementsByTagName('div');
		for(var i = divs.length - 1; i >= 0; i--)
		{
			var div = divs[i];
			if(divs[i].className == "_1mf _1mj")
			{

				console.log('Found instagram post text='+ divs[i].textContent);
				current_postdata.txt = "current_postdata_defined_instagram";
				current_postdata.data.post_text = divs[i].textContent;

			}
			if(divs[i].className == "_jfc")
			{
				console.log('Found instagram post img='+ divs[i].getElementsByTagName('img')[0].src);
				current_postdata.txt = "current_postdata_defined_instagram";
				current_postdata.data.post_imgs.push( divs[i].getElementsByTagName('img')[0].src);
			}
			
		}
		console.log('divs numbers = ' +divs.length);
	}
	// This tested and is working: Twitter 
	// Test on other pc
	if(message.txt === "give_me_current_postdata_twitter")
	{
		let divs = document.getElementsByTagName('div');
		for(var i = divs.length - 1; i >= 0; i--)
		{
			if(divs[i].className == "public-DraftStyleDefault-block public-DraftStyleDefault-ltr")
			{
				console.log('Found twitter post text='+ divs[i].textContent);
				current_postdata.txt = "current_postdata_defined_twitter";
				current_postdata.data.post_text = divs[i].textContent;
			}
			if(divs[i].className == "css-1dbjc4n r-1adg3ll r-1mlwlqe r-1pi2tsx r-1udh08x r-13qz1uu r-417010")
			{
				console.log('Found twitter post image='+ divs[i].getElementsByTagName('img')[0].src);
				current_postdata.txt = "current_postdata_defined_twitter";
				current_postdata.data.post_imgs.push( divs[i].getElementsByTagName('img')[0].src);
			}
			if(divs[i].className == "cauta clasa care trebuie")
			{
				console.log('Found twitter post video='+ divs[i].getElementsByTagName('video')[0].src);
				current_postdata.txt = "current_postdata_defined_twitter";
				current_postdata.data.post_videos.push( divs[i].getElementsByTagName('video')[0].src);
			}
		}
	}
	// This tested and is working: Tumblr 
	// Test on other pc
	if(message.txt.includes("give_me_current_postdata_tumblr"))
	{
		let divs = document.getElementsByTagName('div');
		for(var i = divs.length - 1; i >= 0; i--)
		{
			if(divs[i].className.includes("glass-container"))
			{
				current_postdata.txt = "current_postdata_defined_tumblr";
				current_postdata.data.post_text = divs[i].textContent;
				console.log('Found tumblr post text='+ divs[i].textContent + ' className' + divs[i].className);

			}
			if(divs[i].className == "photoset")
			{
				console.log('Found tumblr post image='+ divs[i].src);
				current_postdata.txt = "current_postdata_defined_tumblr";
				current_postdata.data.post_imgs.push( divs[i].src);
			}
		}
		// current_postdata.txt = "current_postdata_defined_tumblr";
		// current_postdata.data.post_text = "Hello";
		console.log('divs numbers = ' +divs.length);
	}
	// This tested and is working: Linkedin 
	// Test on other pc
	if(message.txt === "give_me_current_postdata_linkedin")
	{
		let divs = document.getElementsByTagName('div');
		for(var i = divs.length - 1; i >= 0; i--)
		{
			if(divs[i].className == "ql-editor")
			{
				console.log('Found linkedin post text='+ divs[i].textContent);
				current_postdata.txt = "current_postdata_defined_linkedin";
				current_postdata.data.post_text = divs[i].textContent;
			}
			if(divs[i].className == "display-flex ivm-view-attr__img-wrapper ivm-view-attr__img-wrapper--use-img-tag ivm-view-attr__img-wrapper--expanded ember-view")
			{
				console.log('Found linkedin post image='+ divs[i].getElementsByTagName('img')[0].src);
				current_postdata.txt = "current_postdata_defined_linkedin";
				current_postdata.data.post_imgs.push( divs[i].getElementsByTagName('img')[0].src);
			}
			if(divs[i].className == "cauta clasa care trebuie")
			{
				console.log('Found linkedin post video='+ divs[i].getElementsByTagName('video')[0].src);
				current_postdata.txt = "current_postdata_defined_linkedin";
				current_postdata.data.post_videos.push( divs[i].getElementsByTagName('video')[0].src);
			}
		}

	}
	
	//send data back
	console.log('Send current_postdata = '+ current_postdata.txt);
	sendResponse(current_postdata);
}