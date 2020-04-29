//Popup js
// "default_popup": "popup.html"


let social_pages_included = ['facebook', 'flickr', 'twitter', 'tumblr', 'linkedin'];
img_instagram = '<object class="social_icon" type="image/svg+xml" data="instagram.svg "></object>';
img_flickr = '<object class="social_icon" type="image/svg+xml" data="flickr.svg "></object>';
img_twitter = '<object class="social_icon" type="image/svg+xml" data="twitter.svg "></object>';
img_tumblr = '<object class="social_icon" type="image/svg+xml" data="tumblr.svg "></object>';
img_linkedin = '<object class="social_icon" type="image/svg+xml" data="linkedin.svg "></object>';
img_facebook = '<object class="social_icon" type="image/svg+xml" data="facebook.svg "></object>';

logged = false;
email = "not_logged";
password = "";
url = "not_defined"

	// console.log('We deleted stored user data');
	// chrome.storage.local.set({'email': ""});
	// chrome.storage.local.set({'password': ""});
	// chrome.storage.local.set({'logged': false});



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
	url = message.data.url;
	generete_popup_html(url );

}


function generete_popup_html( url)
{
	current_social_page = "page not included";
	current_img = "";
	post_data = "current_postdata_notdefined";
	
	
	if(url.includes("https://www.facebook.com") || url.includes("https://m.facebook.com")){current_social_page = "facebook"; current_img = img_facebook;}
	if(url.includes("https://www.flickr.com") || url.includes("https://m.flickr.com")){current_social_page = "flickr"; current_img = img_flickr;}
	if(url.includes("https://twitter.com")){current_social_page = "twitter"; current_img = img_twitter;}
	if(url.includes("https://www.tumblr.com") || url.includes("https://m.tumblr.com")){current_social_page = "tumblr"; current_img = img_tumblr;}
	if(url.includes("https://www.linkedin.com") || url.includes("https://m.linkedin.com")){current_social_page = "linkedin"; current_img = img_linkedin;}
	

	
	
	chrome.storage.local.get(['logged', 'email' , 'password'], function(data){
		logged = data.logged;
		email = data.email;
		password = data.password;
		
		console.log('we currently have saved data: ' + logged + " " + email);

		if(logged  == false)
		{
			document.getElementById("meniu_div").innerHTML = 
			'<input class="meniu_button" id="register_btn" type="submit" value="Register" >'+
			'<input class="meniu_button" id="login_btn" type="submit" value="Login" >';
			
			document.getElementById("register_btn").addEventListener("click", register_fct);
			document.getElementById("login_btn").addEventListener("click", login_fct);
			
			document.getElementById("social_on_div").innerHTML = "<p align=center>Please register/login first.Sorry </p>"; 
			
		}
		else
		{
			document.getElementById("meniu_div").innerHTML = 
			'<input class="meniu_button" id="logout_btn" type="submit" value="Log Out ' + email.substr(0, email.indexOf('@')) + '" >'+
			'<input class="meniu_button" id="authorize_btn" type="submit" value="Authorize post" >';
			
			document.getElementById("logout_btn").addEventListener("click", logout_fct);
			document.getElementById("authorize_btn").addEventListener("click", authorize_fct);
			
			if(current_social_page != "page not included")
			{
				 
				document.getElementById("social_on_div").innerHTML = '<p align=center>Currently on: </p>' + current_img; 
				document.getElementById("share_on_div").innerHTML = '<div><p align=center>You may also want to share your post here: </p>' + generete_share_on_html(current_social_page) +'</div>'; 
				document.getElementById("post_it_div").innerHTML = '<input class="general_class_btn" id="postit_btn" type="submit" value="Post IT" >'; 
				
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
						document.getElementById("you_want_to_share_media_div").innerHTML = '';
						if(message.data.post_text != "")
						{
							document.getElementById("you_want_to_share_txt_div").innerHTML = '<p align=center>Text:</br>\"' + message.data.post_text + '\" </p>'; 
						}
						if(message.data.post_imgs != "")
						{
							document.getElementById("you_want_to_share_media_div").innerHTML += '<p align=center>Image(s): </p>'; 
							for (var i = 0; i < message.data.post_imgs.length; i++)
							{
								document.getElementById("you_want_to_share_media_div").innerHTML +='<img src=' + message.data.post_imgs[i] + ' class="share_img">' ; 
							}
						}
						if(message.data.post_videos != "")
						{
							document.getElementById("you_want_to_share_media_div").innerHTML += '<p align=center>Video(s): </p>'; 
							for (var i = 0; i < message.data.post_videos.length; i++)
							{
								
								document.getElementById("you_want_to_share_media_div").innerHTML +='<video controls="" loop="" playsinline="" src=' + message.data.post_videos[i] + ' class="share_video" type="video/mp4"></video>' ; 
								// document.getElementById("you_want_to_share_media_div").innerHTML +='<iframe src=' + message.data.post_videos[i] + ' class="share_video"></iframe>' ; 
							}
						}
					}
					// buttons listeners
					document.getElementById("postit_btn").addEventListener("click", function(){postit_fct(current_social_page, message);} );
				}
				
				
				

				
			}
			else
			{
				document.getElementById("social_on_div").innerHTML = "<p align=center>This page is not included in our extension. Sorry </p>"; 
			}
			
		}
		

	});
	
}

function generete_share_on_html(current_social_page)
{
	var social_pages = ["facebook", "flickr", "twitter", "tumblr", "linkedin"];
	my_share_on_html = "";
	for (key in social_pages) 
	{
		if (social_pages[key] != current_social_page)
		{
			//generete dinamicaly the buttons only if we need them 
			my_input = "";
			
			if (social_pages[key] === 'facebook') {my_input = img_facebook;}
			if (social_pages[key] === 'flickr') {my_input = img_flickr;}
			if (social_pages[key] === 'twitter') {my_input = img_twitter;}
			if (social_pages[key] === 'tumblr') {my_input = img_tumblr;}
			if (social_pages[key] === 'linkedin') {my_input = img_linkedin;}
	
			// my_input += '<input type="checkbox" id="checkbox_'+ social_pages[key] +'" name="tip" value="'+ social_pages[key] +'">';
			my_input += '<input type="checkbox" id="checkbox_'+ social_pages[key] +'">';
			my_share_on_html +=  my_input;
			
		}
	}
	return my_share_on_html;
	
}


function postit_fct(current_platorm,message)
{
	
	console.log('Button postit_btn clicked from ' + current_platorm);
	
	if(message.data.post_text != "")
	{ 
		console.log('Txt data we have to post =' + message.data.post_text);
	}
	if(message.data.post_imgs != "")
	{
		for (var i = 0; i < message.data.post_imgs.length; i++)
		{
			console.log('Img data we have to post =' + message.data.post_imgs[i]);
		}
	}
	if(message.data.post_videos != "")
	{
		for (var i = 0; i < message.data.post_videos.length; i++)
		{
			console.log('Video data we have to post =' + message.data.post_videos[i]);
		}
	}

	for (key in social_pages_included) 
	{
		if (social_pages_included[key] != current_social_page)
		{
			checkbox = "checkbox_"+social_pages_included[key];
			console.log('Selected platforms ' + social_pages_included[key] + ' value = ' + document.getElementById(checkbox).checked);
			if(document.getElementById(checkbox).checked === true)
			{
				//post data on al selected social platforms
				// TO DO : post text + images via API
				console.log('Start post on '+social_pages_included[key]);
				if (social_pages_included[key] == "linkedin")
				{
					
				}
				if (social_pages_included[key] == "twitter")
				{
					
				}
				if (social_pages_included[key] == "facebook")
				{
					
				}
				if (social_pages_included[key] == "flickr")
				{
					
				}
				if (social_pages_included[key] == "tumblr")
				{
					
				}
			}
			
		}
	}
	
	//end
	// window.close();
}

function logout_fct()
{
	console.log('Button logout_btn clicked ');
	
	console.log('We deleted stored user data');
	chrome.storage.local.set({'email': ""});
	chrome.storage.local.set({'password': ""});
	chrome.storage.local.set({'logged': false});
	
	clear_html_containers();

	generete_popup_html( url);

}

function register_fct()
{
	console.log('Button register_btn clicked ');
	//post data on al selected social platforms
	document.getElementById("login_div").innerHTML = '';
	// TO DO : register user
	document.getElementById("register_div").innerHTML = ' '+

	  '<p for="name">First and Last name:</p>'+
	  '<input type="text" id="name_register" name="name">'+
	  '<p for="email">Email:</p>'+
	  '<input type="text" id="email_register" name="email">'+
	  '<p for="password">Password:</p>'+
	  '<input type="text" id="password_register" name="password"><br><br>'+
	  '<input class="general_class_btn" id="send_register_data" type="submit" value="Register user" >';

	document.getElementById("send_register_data").addEventListener("click", send_register_data);
	//end
}

function send_register_data()
{
	//send also login with the same data
	name = document.getElementById("name_register").value;
	email = document.getElementById("email_register").value;
	password = document.getElementById("password_register").value;
	
	document.getElementById("register_div").innerHTML='';
	
	console.log('Register name to post ' + name);
	console.log('Register email to post ' + email);
	console.log('Register password to post ' + password);
	
	
	var xhttp = new XMLHttpRequest();//build a HTML request for signup
	xhttp.open("POST", "http://sma-a4.herokuapp.com/auth/signup", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send('name='+name+'&email='+email+'&password='+password);
	
	xhttp.onload = () => {
    // process response
    if (xhttp.status == 201) // TODO: We have to also check body message from response and errors 
	{
        // parse JSON data
        console.log(xhttp.response);
		// do stuff here after register
		send_login_data( email , password , 'registered');
		//
    }
	else 
	{
        console.error('Error!'+xhttp.response);
    }
};
}

function login_fct(tab)
{
	console.log('Button login_btn clicked ');
	//post data on al selected social platforms
	document.getElementById("register_div").innerHTML = '';
	// TO DO : login user
	document.getElementById("login_div").innerHTML = ' '+
	  '<p for="email_login">Email:</p>'+
	  '<input type="text" id="email_login" name="email">'+
	  '<p for="password_login">Password:</p>'+
	  '<input type="text" id="password_login" name="password"><br><br>'+
	  '<input class="general_class_btn" id="send_login_data" type="submit" value="Login user">';
	document.getElementById("send_login_data").addEventListener("click", send_login_data);
	
	
	
	
}
function send_login_data( email, password , registered )
{
	// remove the login input content
	
	if ( registered == null)
	{
		email = document.getElementById("email_login").value;
		password = document.getElementById("password_login").value;
	}
	
	document.getElementById("login_div").innerHTML = '';
	
	console.log('Login email to post '+ email);
	console.log('Login password to post '+ password);
	
	var xhttp = new XMLHttpRequest();// build a HTTP request to login a user via red team API 
	xhttp.open("POST", "http://sma-a4.herokuapp.com/auth/login", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send('email='+email+'&password='+password);
	
	xhttp.onload = () => {
    // process response
    if (xhttp.status == 200)//TODO: Check errors and body response message
	{
        // parse JSON data
        console.log(JSON.parse(xhttp.response));
        // console.log(xhttp.getResponseHeader('Set-Cookie'));
		
			chrome.storage.local.set({'email': email});
			chrome.storage.local.set({'password': password});
			chrome.storage.local.set({'logged': true});
			
			console.log('We save data email = ' + email +' logged '+ true);
			clear_html_containers();
			generete_popup_html( url);
		//
    } else {
        console.error('Error!');
    }
};
	
}


function authorize_fct()
{
	document.getElementById("authorize_div").innerHTML = 
	'<input type="submit" id="authorize_request_btn_fb" class="authorize_request_class" name="facebook" value="Authorize Facebook(not done)">'+
	'<input type="submit" id="authorize_request_btn_fl" class="authorize_request_class" name="flickr" value="Authorize Flickr(not done)">'+
	'<input type="submit" id="authorize_request_btn_tu" class="authorize_request_class" name="tumblr" value="Authorize Tumblr">'+
	'<input type="submit" id="authorize_request_btn_tw" class="authorize_request_class" name="twitter" value="Authorize Twitter">'+
	'<input type="submit" id="authorize_request_btn_li" class="authorize_request_class" name="linkedin" value="Authorize Linkedin">'+
	'<input type="submit" id="close_authorize_btn" class="general_class_btn" name="close_authorize" value="Close Authorize">';
	


	document.getElementById("authorize_request_btn_fb").addEventListener("click", function() {authorize_request("facebook");});
	document.getElementById("authorize_request_btn_fl").addEventListener("click", function() {authorize_request("flickr");});
	document.getElementById("authorize_request_btn_tu").addEventListener("click", function() {authorize_request("tumblr");});
	document.getElementById("authorize_request_btn_tw").addEventListener("click", function() {authorize_request("twitter");});
	document.getElementById("authorize_request_btn_li").addEventListener("click",  function() {authorize_request("linkedin");});
	document.getElementById("close_authorize_btn").addEventListener("click", close_authorize_fct);

	// document.getElementById("authorize_div").innerHTML = 
	// '<form action="http://sma-a4.herokuapp.com/twitter/profile"><input type="submit" value="Authorize Twitter(not done)" /></form>';
	// '<a href="http://sma-a4.herokuapp.com/twitter/auth">Authorize Twitter</a>';
}

function close_authorize_fct()
{
	document.getElementById("authorize_div").innerHTML = '';
}

function authorize_request(clicked_platform)
{
	
	console.log('Button authorize_request_btn clicked for \"'+ clicked_platform+'\"');
	
	var xhttp = new XMLHttpRequest();
	check_profile_url = "http://sma-a4.herokuapp.com/"+clicked_platform+"/profile";
	check_auth_url = "https://sma-a4.herokuapp.com/"+clicked_platform+"/auth";
	xhttp.open("GET", check_profile_url, true );
	xhttp.withCredentials = true;
	xhttp.send();
	//TODO check errors and success resquest 
	xhttp.onload = () => {
		if (xhttp.status == 401) // success but not yet authorized
		{
			// parse JSON data
			console.log("401 =");
			console.log(xhttp.response);

			chrome.runtime.sendMessage({
				txt: "open_auth_url", 
				data: {
					subject: "Open auth link in new tab",
					url: check_auth_url
				}
			});
			// var xhttp2 = new XMLHttpRequest();
			// check_profile_url = "http://sma-a4.herokuapp.com/"+clicked_platform+"/auth";
			// xhttp2.open("GET", check_profile_url, true );
			// xhttp2.withCredentials = true;
			// xhttp2.send();
			
			// xhttp2.onload = () => {
			// if (xhttp2.status == 200) // success but not yet authorized
			// {
				// console.log("200 =");
				// console.log(xhttp2.response);
			// }
			// };
			
			// console.log(xhttp.getResponseHeader('Set-Cookie'));
			
				// chrome.storage.local.set({'email': email});
				// chrome.storage.local.set({'password': password});
				// chrome.storage.local.set({'logged': true});
				// console.log('We save data email = ' + email +' logged '+ true);
				// clear_html_containers();
				// generete_popup_html( url);
			//
		}
		else
		{
			if (xhttp.status == 403) //not autheficated yet . probably cookie missing
			{
				console.log("403 =");
				console.log(xhttp.response);
			}
			else
			{	
				console.error('Error!');
			}
		}
	};
	//post data on al selected social platforms
	document.getElementById("authorize_div").innerHTML = '';
	
}




function clear_html_containers()
{
	
	document.getElementById("meniu_div").innerHTML = '';
	document.getElementById("login_div").innerHTML = '';
	document.getElementById("register_div").innerHTML = '';
	document.getElementById("authorize_div").innerHTML = '';
	document.getElementById("social_on_div").innerHTML = '';
	document.getElementById("share_on_div").innerHTML = '';
	document.getElementById("post_it_div").innerHTML = '';
	document.getElementById("you_want_to_share_txt_div").innerHTML = '';
	document.getElementById("you_want_to_share_media_div").innerHTML = '';
}
//TO DO : Check if users are authetificated and ask for login if not;
