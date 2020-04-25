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
	///Twitter - done txt/imgs/gifs/video with a minor bug: if we click on + we see img videos two times 
	///Linkedin - done txt/imgs/video.
	///Tumblr - done txt/imgs/video with some bugs: sometimes the video is not seen after we write text + I get sometimes error when load the video in order to post it
	///Facebook - done txt/imgs/video with some bugs: image size | video 
	///Flickr - done img/text with some bugs/problems : Text is from images title / description. If we have multiple images were we gonne put the text and wich part is title /descrion?

	///Facebook - done with some bugs:image size/ video not working 
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
	///Flickr - done for img/text with some bugs/problems : Text is from images title / description. If we have multiple images were we gonne put the text and wich part is title /descrion?
	if(message.txt === "give_me_current_postdata_flickr")
	{
		let divs = document.getElementsByTagName('div');
		for(var i = 0; i <= divs.length - 1; i++)
		{
			var div = divs[i];
			if(divs[i].className == "photo-title-editable")//text titlu
			{
				// console.log('Flickr found div with possible text'+ divs[i].textContent );
				if(divs[i].getElementsByTagName('input').length  != 0 )
				{	
					if(divs[i].getElementsByTagName('input')[0].value.length >= 1  )
					{
						console.log('Found flickr post text title ='+ divs[i].getElementsByTagName('input')[0].value );
						current_postdata.txt = "current_postdata_defined_flickr";
						current_postdata.data.post_text +=  ' '+divs[i].getElementsByTagName('input')[0].value;
					}
				}
			}
			if(divs[i].className == "photo-description-editable")//text description
			{
				if(divs[i].getElementsByTagName('textarea').length  != 0 )
				{	
					if(divs[i].getElementsByTagName('textarea')[0].value.length >= 1  )
					{
						console.log('Found flickr post text description='+ divs[i].getElementsByTagName('textarea')[0].value );
						current_postdata.txt = "current_postdata_defined_flickr";
						current_postdata.data.post_text +=  ' '+divs[i].getElementsByTagName('textarea')[0].value;
					}
				}
			}
			if(divs[i].className == "photo-thumbnail")//imgs
			{
				if(divs[i].getElementsByTagName('img').length  != 0)
				{///
					if( divs[i].getElementsByTagName('img')[0].src != 'https://combo.staticflickr.com/pw/images/spaceout.gif')
					{
						console.log('Found flickr post img='+ divs[i].getElementsByTagName('img')[0].src);
						current_postdata.txt = "current_postdata_defined_flickr";
						current_postdata.data.post_imgs.push( divs[i].getElementsByTagName('img')[0].src);
					}
				}
			}	
		}
		console.log('divs numbers = ' +divs.length);
	}
	///Twitter - done txt/imgs/gifs/video with minor bug: if we click on + we see img videos two times 
	if(message.txt === "give_me_current_postdata_twitter")
	{
		console.log('Search data for twitter');
		let divs = document.getElementsByTagName('div');
		for(var i = divs.length - 1; i >= 0; i--)
		{
			if(divs[i].className == "public-DraftStyleDefault-block public-DraftStyleDefault-ltr")//text
			{
				console.log('Found twitter post text='+ divs[i].textContent);
				current_postdata.txt = "current_postdata_defined_twitter";
				current_postdata.data.post_text = divs[i].textContent;
			}
			if(divs[i].className == "css-1dbjc4n r-1adg3ll r-1mlwlqe r-1pi2tsx r-1udh08x r-13qz1uu r-417010")//imgs
			{
				if(divs[i].getElementsByTagName('img').length  != 0)
				{
					console.log('Found twitter post image='+ divs[i].getElementsByTagName('img')[0].src);
					current_postdata.txt = "current_postdata_defined_twitter";
					current_postdata.data.post_imgs.push(divs[i].getElementsByTagName('img')[0].src);
				}
			}
			if(divs[i].className == "css-1dbjc4n r-1mlwlqe r-1pi2tsx r-1udh08x r-13qz1uu r-417010")//gifs
			{
				if(divs[i].getElementsByTagName('img').length  != 0)
				{
					console.log('Found twitter post gif image='+ divs[i].getElementsByTagName('img')[0].src);
					current_postdata.txt = "current_postdata_defined_twitter";
					current_postdata.data.post_imgs.push(divs[i].getElementsByTagName('img')[0].src);
				}
			}
			if(divs[i].className == "css-1dbjc4n r-t23y2h r-1loqt21 r-1iusvr4 r-16y2uox r-1udh08x r-13tjlyg r-11iat2r r-1ftll1t")//video
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
	///Tumblr - done txt/imgs/video with minor bugs: sometimes the video is not seen after we write text
	if(message.txt.includes("give_me_current_postdata_tumblr"))
	{	
		console.log('Search data for tumblr');
		
		//Text post have title + body + tags (all are optional).
		//We build a json object to collect them all 
		let tumblr_text_post = {
								title: "not_defined", 
								txt: "not_defined", 
								tags: ""
							};
			
		//Tumblr have a different behavior:
		// Inside the main html have a iframe(a page or redirect inside) . We have to load first the iframe in order to see the div inside.
		let iframe = document.getElementsByClassName('_2TcTp');
		//If we have the iframe 
		if(iframe.length != 0)
		{
			//and if we managed to load it with success-> we parsed as we have done till now 
			var iframeDocument = iframe[0].contentDocument || iframe[0].contentWindow.document;
			if(iframeDocument.length != 0)
			{
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
					if(divs[i].className == "crt-video crt-skin-default vjs-paused vjs_video_3-dimensions vjs-controls-enabled vjs-workinghover vjs-user-inactive")//worked ->but now I have errors when try to load the video
					{

						console.log('Found tumblr post video loaded='+ divs[i].getElementsByTagName('video')[0].src);
						current_postdata.txt = "current_postdata_defined_tumblr";
						current_postdata.data.post_videos.push( divs[i].getElementsByTagName('video')[0].src);
					}
					//Post videos from online links
					// if(divs[i].className == "editor editor-plaintext")
					if(divs[i].className == "video-preview")//not working
					{
						if(divs[i].getElementsByTagName('iframe').length != 0)
						{
							console.log('Found tumblr post video='+ divs[i].getElementsByTagName('iframe')[0].src);
							current_postdata.txt = "current_postdata_defined_tumblr";
							current_postdata.data.post_videos.push( divs[i].getElementsByTagName('iframe')[0].src);
						}
						// console.log('Found tumblr post video from links='+ divs[i].textContent);
						// current_postdata.txt = "current_postdata_defined_tumblr";
						// current_postdata.data.post_videos.push( divs[i].textContent);
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
	}
	//Linkedin - done txt/imgs/video 
	if(message.txt === "give_me_current_postdata_linkedin")
	{
		let divs = document.getElementsByTagName('div');
		for(var i = divs.length - 1; i >= 0; i--)
		{
			if(divs[i].className == "ql-editor")//text 
			{
				console.log('Found linkedin post text='+ divs[i].textContent);
				current_postdata.txt = "current_postdata_defined_linkedin";
				current_postdata.data.post_text = divs[i].textContent;
			}
			if(divs[i].className == "display-flex ivm-view-attr__img-wrapper ivm-view-attr__img-wrapper--use-img-tag ivm-view-attr__img-wrapper--expanded ember-view")//imgs
			{
				console.log('Found linkedin post image='+ divs[i].getElementsByTagName('img')[0].src);
				current_postdata.txt = "current_postdata_defined_linkedin";
				current_postdata.data.post_imgs.push( divs[i].getElementsByTagName('img')[0].src);
			}
			if(divs[i].className == "video-js media-player__player vjs-paused vjs-fluid vjs-4-3 vjs-controls-enabled vjs-workinghover vjs-v7 vjs-user-active vjs-layout-medium")//video
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

