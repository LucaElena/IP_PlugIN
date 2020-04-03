//Popup js
// "default_popup": "popup.html"

img_instagram = '<object class="social_icon" type="image/svg+xml" data="instagram.svg "></object>';
img_twitter = '<object class="social_icon" type="image/svg+xml" data="twitter.svg "></object>';
img_tumblr = '<object class="social_icon" type="image/svg+xml" data="tumblr.svg "></object>';
img_linkedin = '<object class="social_icon" type="image/svg+xml" data="linkedin.svg "></object>';
img_facebook = '<object class="social_icon" type="image/svg+xml" data="facebook.svg "></object>';


chrome.runtime.sendMessage({
	txt: "give_me_current_url", 
	data: {
		subject: "Ask Current URL",
		content: ""
	}
});

chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender , sendResponse)
{
	console.log(message.txt);
	console.log("URL-ul current este : " + message.data.url);
	
	generete_popup_html(message.data.url , sendResponse);

	// chrome.runtime.sendMessage({
	// txt: "current_url_received", 
	// data: {
		// subject: "Received Current URL",
		// content: "Thank you"
	// }
	// });
}


function generete_popup_html( url)
{
	current_social_page = "page not included";
	current_img = "";
	post_data = "current_postdata_notdefined";
	
	if(url.includes("https://www.facebook.com") || url.includes("https://m.facebook.com")){current_social_page = "facebook"; current_img = img_facebook;}
	if(url.includes("https://www.instagram.com") || url.includes("https://m.instagram.com")){current_social_page = "instagram"; current_img = img_instagram;}
	if(url.includes("https://twitter.com")){current_social_page = "twitter"; current_img = img_twitter;}
	if(url.includes("https://www.tumblr.com") || url.includes("https://m.tumblr.com")){current_social_page = "tumblr"; current_img = img_tumblr;}
	if(url.includes("https://www.linkedin.com") || url.includes("https://m.linkedin.com")){current_social_page = "linkedin"; current_img = img_linkedin;}
	
	let social_pages_included = ['facebook', 'instagram', 'twitter', 'tumblr', 'linkedin'];

		
	if(current_social_page != "page not included")
	{	
		document.getElementById("social_on_div").innerHTML = '<p align=center>Currently on: </p>' + current_img; 
		document.getElementById("share_on_div").innerHTML = '<div><p align=center>You may also want to share your post here: </p>' + generete_share_on_html(current_social_page) +'</div>'; 
		document.getElementById("post_it_div").innerHTML = '<input class="postit_btn" id="postit" type="submit" value="Post IT" >'; 
		
		//get post data from current social platfom
		chrome.tabs.query({currentWindow: true, active: true}, function (tabs){
			var activeTab = tabs[0];
		
			console.log('Trimit intrebare : give_me_current_postdata_'+current_social_page);
			chrome.tabs.sendMessage(activeTab.id,
				{
					txt: "give_me_current_postdata_"+current_social_page
				},gotAnswear);
			
		});
		

		function gotAnswear(message, sender , sendResponse)
		{
			console.log(" We recevead current post message: " + message.txt);
			if (message.txt != "current_postdata_notdefined")
			{
				if(message.data.post_text != "")
				{
					document.getElementById("you_want_to_share_txt_div").innerHTML = '<p align=center>Text:</br>\"' + message.data.post_text + '\" </p>'; 
				}
				if(message.data.post_imgs != "")
				{
					document.getElementById("you_want_to_share_media_div").innerHTML = '<p align=center>Image(s): </p>'; 
					for (var i = 0; i < message.data.post_imgs.length; i++)
					{
						document.getElementById("you_want_to_share_media_div").innerHTML +='<img src=' + message.data.post_imgs[i] + ' class="share_img">' ; 
					}
				}
			}
		}
		
		document.getElementById("postit").addEventListener("click", postIt);
		
	}
	else
	{
		document.getElementById("social_on_div").innerHTML = "<p align=center>This page is not included in our extension. Sorry </p>"; 
	}
	
}

function generete_share_on_html(current_social_page)
{
	var social_pages = ["facebook", "instagram", "twitter", "tumblr", "linkedin"];
	my_share_on_html = "";
	for (key in social_pages) 
	{
		if (social_pages[key] != current_social_page)
		{
			//generete dinamicaly the buttons only if we need them 
			my_input = "";
			// my_button = '<button class="social_btn_'+ social_pages[key] +'" for=" '+ social_pages[key] + '">';
			// my_button = '<button class="social_btn" for=" '+ social_pages[key] + '">';
			// my_button = '<button class="social_btn" for=" '+ social_pages[key] + '">';
			if (social_pages[key] === 'facebook') {my_input = img_facebook;}
			if (social_pages[key] === 'instagram') {my_input = img_instagram;}
			if (social_pages[key] === 'twitter') {my_input = img_twitter;}
			if (social_pages[key] === 'tumblr') {my_input = img_tumblr;}
			if (social_pages[key] === 'linkedin') {my_input = img_linkedin;}
	
			my_input += '<input type="checkbox" id="'+ social_pages[key] +'" name="tip" value="'+ social_pages[key] +'">';
			my_share_on_html +=  my_input;
			
		}
	}
	return my_share_on_html;
	
}


function postIt(tab)
{
	console.log('Button postIt clicked :' + tab.id);
	//post data on al selected social platforms
	
	// TO DO : post text + images via API
	
	//ends
	window.close();
}

//TO DO : Check if users are authetificated and ask for login if not;
