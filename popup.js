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

	document.getElementById("meniu_div").innerHTML = 
	'<input class="meniu_button" id="register_btn" type="submit" value="Register" >'+
	'<input class="meniu_button" id="login_btn" type="submit" value="Login" >';
	
	if(current_social_page != "page not included")
	{	
		 
		document.getElementById("social_on_div").innerHTML = '<p align=center>Currently on: </p>' + current_img; 
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
		
		// buttons listeners
		document.getElementById("postit_btn").addEventListener("click", postit_fct);
		document.getElementById("register_btn").addEventListener("click", register_fct);
		document.getElementById("login_btn").addEventListener("click", login_fct);
		// document.getElementById("signup").addEventListener("click", signup_fct);
		
	}
	else
	{
		document.getElementById("social_on_div").innerHTML = "<p align=center>This page is not included in our extension. Sorry </p>"; 
		
		// buttons listeners
		// document.getElementById("postit_btn").addEventListener("click", postit_fct);
		document.getElementById("register_btn").addEventListener("click", register_fct);
		document.getElementById("login_btn").addEventListener("click", login_fct);
		// document.getElementById("signup").addEventListener("click", signup_fct);
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


function postit_fct(tab)
{
	console.log('Button postit_btn clicked :' + tab.id);
	//post data on al selected social platforms
	
	// TO DO : post text + images via API
	
	//end
	window.close();
}
function register_fct(tab)
{
	console.log('Button register_btn clicked :' + tab.id);
	//post data on al selected social platforms
	document.getElementById("login_div").innerHTML = '';
	// TO DO : register user
	document.getElementById("register_div").innerHTML = ' '+
	// '<form action=javascript:send_register_data() method="post">'+
	  '<label for="name">First and Last name:</label><br>'+
	  '<input type="text" id="name_register" name="name"><br>'+
	  '<label for="email">Email:</label><br>'+
	  '<input type="text" id="email_register" name="email"><br>'+
	  '<label for="password">Password:</label><br>'+
	  '<input type="text" id="password_register" name="password"><br>'+
	  '<input class="general_class_btn" id="send_register_data" type="submit" value="Register user" >';
	// '</form>';
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
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "http://sma-a4.herokuapp.com/auth/signup", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send('name='+name+'&email='+email+'&password='+password);
	
	xhttp.onload = () => {
    // process response
    if (xhttp.status == 200) {
        // parse JSON data
        console.log(JSON.parse(xhttp.response));
		// do stuff here after login
		//
    } else {
        console.error('Error!'+JSON.parse(xhttp.response));
    }
};
}

function login_fct(tab)
{
	console.log('Button login_btn clicked :' + tab.id);
	//post data on al selected social platforms
	document.getElementById("register_div").innerHTML = '';
	// TO DO : login user
	document.getElementById("login_div").innerHTML = ' '+
	  '<label for="email_login">Email:</label><br>'+
	  '<input type="text" id="email_login" name="email"><br><br>'+
	  '<label for="password_login">Password:</label><br>'+
	  '<input type="text" id="password_login" name="password"><br><br>'+
	  '<input class="general_class_btn" id="send_login_data" type="submit" value="Login user">';
	document.getElementById("send_login_data").addEventListener("click", send_login_data);
	
	
	//end
	
	
}
function send_login_data()
{
	// remove the login input content
	
	
	email = document.getElementById("email_login").value;
	password = document.getElementById("password_login").value;
	
	document.getElementById("login_div").innerHTML = '';
	
	console.log('Login email to post '+ email);
	console.log('Login password to post '+ password);
	
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", "http://sma-a4.herokuapp.com/auth/login", true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send('email='+email+'&password='+password);
	
	xhttp.onload = () => {
    // process response
    if (xhttp.status == 200) {
        // parse JSON data
        console.log(JSON.parse(xhttp.response));
		// do stuff here after login
		//
    } else {
        console.error('Error!');
    }
};
	
}

function logout_fct(tab)
{
	console.log('Button logout_btn clicked :' + tab.id);
	//post data on al selected social platforms
	
	// TO DO : logout user
	
	//end
	
}
//TO DO : Check if users are authetificated and ask for login if not;
