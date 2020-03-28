//Popup js
// "default_popup": "popup.html"

img_instagram = '<object class="social_icon" type="image/svg+xml" data="instagram.svg "></object>';
img_twitter = '<object class="social_icon" type="image/svg+xml" data="twitter.svg "></object>';
img_tumblr = '<object class="social_icon" type="image/svg+xml" data="tumblr.svg "></object>';
img_linkedin = '<object class="social_icon" type="image/svg+xml" data="linkedin.svg "></object>';
img_facebook = '<object class="social_icon" type="image/svg+xml" data="facebook.svg "></object>';


chrome.runtime.sendMessage({
	msg: "give_me_current_url", 
	data: {
		subject: "Ask Current URL",
		content: ""
	}
});

chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(message, sender , sendResponse)
{
	console.log(message.txt);
	console.log("URL-ul current este : " + message.url);

	generete_popup_html(message.data.url);

	chrome.runtime.sendMessage({
	msg: "current_url_received", 
	data: {
		subject: "Received Current URL",
		content: "Thank you"
	}
	});
}



// document.getElementById("postit").addEventListener("click", postIt);
// function postIt(tab)
// {
	// console.log('Button postIt clicked :' + tab.id);
// }

function generete_popup_html(url)
{
	current_social_page = "page not included";
	
	if(url.includes("https://www.facebook.com")){current_social_page = "facebook"; }
	if(url.includes("https://www.instagram.com")){current_social_page = "instagram"; }
	if(url.includes("https://twitter.com")){current_social_page = "twitter"; }
	if(url.includes("https://www.tumblr.com")){current_social_page = "tumblr"; }
	if(url.includes("https://www.linkedin.com")){current_social_page = "linkedin"; }
	
	current_img = "";
	
	if (current_social_page === 'facebook') {current_img = img_facebook;}
	if (current_social_page === 'instagram') {current_img = img_instagram;}
	if (current_social_page === 'twitter') {current_img = img_twitter;}
	if (current_social_page === 'tumblr') {current_img = img_tumblr;}
	if (current_social_page === 'linkedin') {current_img = img_linkedin;}
	
		
	if(current_social_page != "page not included")
	{	
		document.getElementById("social_on_div").innerHTML = '<p align=center>You are curently on: </p>' + current_img; 
		document.getElementById("share_on_div").innerHTML = '<div><p align=center>You may also want to share your post here: </p>' + generete_share_on_html(current_social_page) +'</div>'; 
		document.getElementById("post_it_div").innerHTML = '<input class="postit_btn" id="postit" type="submit" value="PostIT" >'; 
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
		