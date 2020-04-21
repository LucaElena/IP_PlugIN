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
	///Flickr - not done yet-> To do Alex
	///Tumblr - not working - content is inside a script/container -> TO DO Elena
	// TO DO Lili -> For all platform search div class and extract videos url when post is done.
	// TO DO Razvan -> Paste Fericit :))
	
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
				if(divs[i].getElementsByTagName('img').length  != 0)
				{
					console.log('Found facebook post img='+ divs[i].getElementsByTagName('img')[0].src);
					current_postdata.txt = "current_postdata_defined_facebook";
					current_postdata.data.post_imgs.push( divs[i].getElementsByTagName('img')[0].src);
				}
			}
			//extract video from post
			//extract video from post
			if(divs[i].className == "_33by _33by _5f0d")
			{
				if(divs[i].getElementsByTagName('img').length  != 0)
				{
					console.log('Found facebook post video='+ divs[i].getElementsByTagName('img')[0].src);
					current_postdata.txt = "current_postdata_defined_facebook";
					current_postdata.data.post_videos.push( divs[i].getElementsByTagName('img')[0].src);
				}
			}
		}
		console.log('divs numbers = ' +divs.length);
	}
	// This tested and is working with some problems on develop pc: Instagram
	// Problem 1: You could post only from mobile on instgram -> simulate mobile CTRL + SHIFT + M in console and change www with m in URL if not change automaticaly
	// Problem 2: Story or Image post 
	// Test on other pc -> not working
	// if(message.txt === "give_me_current_postdata_instagram")
	// {
		// let divs = document.getElementsByTagName('div');
		// for(var i = divs.length - 1; i >= 0; i--)
		// {
			// var div = divs[i];
			// if(divs[i].className == "_1mf _1mj")
			// {

				// console.log('Found instagram post text='+ divs[i].textContent);
				// current_postdata.txt = "current_postdata_defined_instagram";
				// current_postdata.data.post_text = divs[i].textContent;

			// }
			// if(divs[i].className == "_jfc")
			// {
				// console.log('Found instagram post img='+ divs[i].getElementsByTagName('img')[0].src);
				// current_postdata.txt = "current_postdata_defined_instagram";
				// current_postdata.data.post_imgs.push( divs[i].getElementsByTagName('img')[0].src);
			// }
			// if(divs[i].className == "xDbR6")
			// {
				// console.log('Found instagram post video='+ divs[i].getElementsByTagName('video')[0].src);
				// current_postdata.txt = "current_postdata_defined_instagram";
				// current_postdata.data.post_videos.push( divs[i].getElementsByTagName('video')[0].src);
			// }
			
		// }
		// console.log('divs numbers = ' +divs.length);
	// }
	// Not done yet -> TO DO ALEX
	//Search div class for text and extract text
	//Search div class for images and extract url with images
	//Search div class for images and extract url with videos
	if(message.txt === "give_me_current_postdata_flickr")
	{
		let divs = document.getElementsByTagName('div');
		for(var i = divs.length - 1; i >= 0; i--)
		{
			var div = divs[i];
			if(divs[i].className == "_1mf _1mj")
			{

				console.log('Found flickr post text='+ divs[i].textContent);
				current_postdata.txt = "current_postdata_defined_flickr";
				current_postdata.data.post_text = divs[i].textContent;

			}
			if(divs[i].className == "_jfc")
			{
				if(divs[i].getElementsByTagName('img').length  != 0)
				{
					console.log('Found flickr post img='+ divs[i].getElementsByTagName('img')[0].src);
					current_postdata.txt = "current_postdata_defined_flickr";
					current_postdata.data.post_imgs.push( divs[i].getElementsByTagName('img')[0].src);
				}
			}
			if(divs[i].className == "_jfc")
			{
				if(divs[i].getElementsByTagName('video').length  != 0)
				{
					console.log('Found flickr post video='+ divs[i].getElementsByTagName('video')[0].src);
					current_postdata.txt = "current_postdata_defined_flickr";
					current_postdata.data.post_videos.push( divs[i].getElementsByTagName('video')[0].src);
				}
			}
			
		}
		console.log('divs numbers = ' +divs.length);
	}
	// This tested and is working: Twitter 
	// Test on other pc
	if(message.txt === "give_me_current_postdata_twitter")
	{
		console.log('Search data for twitter');
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
				if(divs[i].getElementsByTagName('img').length  != 0)
				{
					console.log('Found twitter post image='+ divs[i].getElementsByTagName('img')[0].src);
					current_postdata.txt = "current_postdata_defined_twitter";
					current_postdata.data.post_imgs.push(divs[i].getElementsByTagName('img')[0].src);
				}
			}
			if(divs[i].className == "css-1dbjc4n r-t23y2h r-1loqt21 r-1iusvr4 r-16y2uox r-1udh08x r-13tjlyg r-11iat2r r-1ftll1t")
			{
				if(divs[i].getElementsByTagName('source').length  != 0)
				{
					console.log('Found twitter post video='+ divs[i].getElementsByTagName('source')[0].src);
					current_postdata.txt = "current_postdata_defined_twitter";
					current_postdata.data.post_videos.push( divs[i].getElementsByTagName('source')[0].src);
				}
			}
		}
	}
	// This is not working yet 

	if(message.txt.includes("give_me_current_postdata_tumblr"))
	{	
		console.log('Search data for tumblr');
		
		let tumblr_text_post = {
								title: "not_defined", 
								txt: "not_defined", 
								tags: ""
							};
							
		let iframe = document.getElementsByClassName('_2TcTp');
		
		if(iframe.length != 0)
		{
			var iframeDocument = iframe[0].contentDocument || iframe[0].contentWindow.document;
			
			let divs = iframeDocument.getElementsByTagName('div');
			for(var i = 0; i <= divs.length - 1; i++)
			{
				//Post text title
				
				if(divs[i].className == "editor editor-plaintext has-text")
				{
					current_postdata.txt = "current_postdata_defined_tumblr";
					tumblr_text_post.title = divs[i].textContent;
					console.log('Found tumblr post text title='+ divs[i].textContent);

				}
				//Post text body
				if(divs[i].className == "editor editor-richtext")
				{
					current_postdata.txt = "current_postdata_defined_tumblr";
					tumblr_text_post.txt = divs[i].textContent;
					console.log('Found tumblr post text='+ divs[i].textContent);

				}
				//Post text tags
				if(divs[i].className == "post-form--tag-editor")
				{
					current_postdata.txt = "current_postdata_defined_tumblr";
					let spans = divs[i].getElementsByClassName('tag-label');
					for(var j = 0; j <= spans.length - 1; j++)
					{
						tumblr_text_post.tags += '#'+spans[j].textContent+' ';
						console.log('Found tumblr post text tag='+ spans[j].textContent);
					}
				}
				//Post images
				if(divs[i].className == "photoset--image-wrap")
				{
					style = window.getComputedStyle(divs[i], false);
					bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");
					console.log('Found tumblr post image='+ bi);
					current_postdata.txt = "current_postdata_defined_tumblr";
					current_postdata.data.post_imgs.push( bi);
				}
				//Post videos
				if(divs[i].className == "crt-video crt-skin-default vjs-paused vjs_video_3-dimensions vjs-controls-enabled vjs-workinghover vjs-user-inactive")
				{
					if(divs[i].getElementsByTagName('video').length != 0)
					{
						console.log('Found tumblr post video='+ divs[i].getElementsByTagName('video')[0].src);
						current_postdata.txt = "current_postdata_defined_tumblr";
						current_postdata.data.post_videos.push( divs[i].getElementsByTagName('video')[0].src);
					}
				}
				//Post videos
				// if(divs[i].className == "video-preview")
				if(divs[i].className == "editor editor-plaintext")
				{
					// if(divs[i].getElementsByTagName('iframe').length != 0)
					// {
						// console.log('Found tumblr post video='+ divs[i].getElementsByTagName('iframe')[0].src);
						// current_postdata.txt = "current_postdata_defined_tumblr";
						// current_postdata.data.post_videos.push( divs[i].getElementsByTagName('iframe')[0].src);
					// }
					console.log('Found tumblr post video='+ divs[i].textContent);
					current_postdata.txt = "current_postdata_defined_tumblr";
					current_postdata.data.post_videos.push( divs[i].textContent);
				}
			}
			
			if(tumblr_text_post.title != 'not_defined')
			{
				current_postdata.data.post_text += tumblr_text_post.title + '<br>';
			}
			if(tumblr_text_post.txt != 'not_defined')
			{
				if(tumblr_text_post.txt != '')
				{
					current_postdata.data.post_text += tumblr_text_post.txt + '<br>';
				}
			}
			if(tumblr_text_post.tags != '')
			{
				current_postdata.data.post_text += tumblr_text_post.tags.replace("#tags", "");
			}
			// current_postdata.txt = "current_postdata_defined_tumblr";
			// current_postdata.data.post_text = "Hello";
			console.log('divs numbers = ' +divs.length);
		}
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

