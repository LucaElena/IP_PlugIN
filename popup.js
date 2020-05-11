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
userid = "";
url = "not_defined"

string_post_fb = "";
string_post_fl = "";
string_post = "";
var formData_li;
var formData_tw;
var formData_tu;

	// console.log('We deleted stored user data');
	// chrome.storage.local.set({'email': ""});
	// chrome.storage.local.set({'password': ""});
	// chrome.storage.local.set({'logged': false});
	// chrome.storage.local.set({'userId': ""});
	// chrome.storage.local.set({'token': ""});



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
	
	string_post_fb = "";
	string_post_fl = "";
	string_post = "";
	formData_li = new FormData();
	formData_tw = new FormData();
	formData_tu = new FormData();
	
	if(url.includes("https://www.facebook.com") || url.includes("https://m.facebook.com")){current_social_page = "facebook"; current_img = img_facebook;}
	if(url.includes("https://www.flickr.com") || url.includes("https://m.flickr.com")){current_social_page = "flickr"; current_img = img_flickr;}
	if(url.includes("https://twitter.com")){current_social_page = "twitter"; current_img = img_twitter;}
	if(url.includes("https://www.tumblr.com") || url.includes("https://m.tumblr.com")){current_social_page = "tumblr"; current_img = img_tumblr;}
	if(url.includes("https://www.linkedin.com") || url.includes("https://m.linkedin.com")){current_social_page = "linkedin"; current_img = img_linkedin;}
	

	
	
	chrome.storage.local.get(['logged', 'email' , 'password', 'userId', 'token'], function(data){
		logged = data.logged;
		email = data.email;
		password = data.password;
		userid = data.userId;
		token = data.token;
		
		console.log('We currently have saved data logged=' + logged + " email=" + email + " userid=" + userid + " token="+token);

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
								// if (message.data.post_imgs[i].substring(0,30).match('^data:image\/(.*);base64,'))
								// {
									// console.log("Base64 url -> tranform in url only 1 time");
									// var url_imgur = "";
									// await base64data_to_url(message.data.post_imgs[i], 'a_'+i+'.png', "", function(file){
										// transform_file_in_imgur_url(file, "", "", function(url_imgur ){
											// message.data.post_imgs[i] = url_imgur
										// });
									// });
								// }
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
				post_on_platform(social_pages_included[key],message);
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
	chrome.storage.local.set({'userId': ""});
	chrome.storage.local.set({'token': ""});
	
	clear_html_containers();

	generete_popup_html( url);

}

function register_fct()
{
	console.log('Button register_btn clicked ');
	//post data on al selected social platforms
	document.getElementById("login_div").innerHTML = '';
	document.getElementById("authorize_div").innerHTML = '';
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
			document.getElementById("authorize_div").innerHTML = ' '+
								'<p> Register Error : '+xhttp.response+'</p>';
			console.error('Error!'+xhttp.response);
		}
	};
}

function login_fct(tab)
{
	console.log('Button login_btn clicked ');
	//post data on al selected social platforms
	document.getElementById("register_div").innerHTML = '';
	document.getElementById("authorize_div").innerHTML = '';
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
		chrome.storage.local.set({'userId': 49});//This is hardcoded and only work for our user & TO DO : We have to ask http://sma-a4.herokuapp.com/token to obtain the token and decrypted to obtain the user Id
		console.log('We save data email = ' + email +' logged '+ true);
		
		var xhttp2 = new XMLHttpRequest();// build a HTTP request to login a user via red team API 
		xhttp2.open("GET", "http://sma-a4.herokuapp.com/token", true);
		xhttp2.send();
		xhttp2.onload = () => {
			// process response
			if (xhttp2.status == 200)//TODO: Check errors and body response message
			{
				console.log("We get the token also: "+ JSON.parse(xhttp2.response).token);
				token = JSON.parse(xhttp2.response).token;
				chrome.storage.local.set({'token': JSON.parse(xhttp2.response).token});
			}
			else
			{
				document.getElementById("authorize_div").innerHTML = ' '+
										'<p> Token Error : '+xhttp2.response+'</p>';
					console.error('Error!');
			}
		};
		
		clear_html_containers();
		generete_popup_html( url);

    }
	else
	{
		if (xhttp.status == 401)//TODO: Check other errors
		{
			document.getElementById("authorize_div").innerHTML = ' '+
								'<p> Wrong password </p>';
			console.log("401 = Wrong password"+xhttp.response);
		}
		else
		{
			document.getElementById("authorize_div").innerHTML = ' '+
								'<p> Login Error : '+xhttp.response+'</p>';
			console.error('Error!');
		}
	}
};
	
}
async function post_on_platform(post_platform, message)
{
	
	if(post_platform == "linkedin" || post_platform == "twitter" || post_platform == "tumblr")
	{

		if(message.data.post_text != "")//work for twitter . It should work for linkedin too
		{ 
			if(post_platform == "linkedin"){formData_li.append("text", message.data.post_text);};//text
			if(post_platform == "tumblr"){formData_tu.append("text", message.data.post_text);};//text
			if(post_platform == "twitter"){formData_tw.append("text", message.data.post_text);};//text
			
		}
		if(message.data.post_imgs != "")//not working .. //linkedin -> twitter image is base64 raw data not url
		{
			for (var i = 0; i < message.data.post_imgs.length; i++)
			{
				if (message.data.post_imgs[i].substring(0,30).match('^data:image\/(.*);base64,'))
				{
					console.log("Image with data...base64 instead of url -> tranform it in file");
					var file = await base64datatoFile(message.data.post_imgs[i], 'a_'+i+'_'+post_platform+'.png');
					console.log("Img "+i+" transformed with success in file");
					if(post_platform == "linkedin"){formData_li.append("files[]", file);};//file
					if(post_platform == "tumblr"){formData_tu.append("files[]", file);};//file
					if(post_platform == "twitter"){formData_tw.append("files[]", file);};//file
					
					// var url_imgur = "";
					// await base64data_to_url(message.data.post_imgs[i], 'a_'+i+'_'+post_platform+'.png', "", function(file){
						// transform_file_in_imgur_url(file, "", "", function(url_imgur ){
							// message.data.post_imgs[i] = url_imgur
							
						// });
					// });
					
					
				}
				else if (message.data.post_imgs[i].substring(0,30).match('^blob:http'))
				{
					console.log("Image with blob+url -> tranform it in file");

					var file = await blob_to_data(message.data.post_imgs[i]);
					console.log("Blob url "+i+" transformed with success in data");
					// var file = await new File([data_from_blob], "a_"+ i +".png", {type:"image/png"}); 
					
					if(post_platform == "linkedin"){formData_li.append("files[]", file);};//file
					if(post_platform == "tumblr"){formData_tu.append("files[]", file);};//file
					if(post_platform == "twitter"){formData_tw.append("files[]", file);};//file
					
					
					  
					// var file = await new File([data], "a_"+ i +".png", {type:"image/png"}); 
					// console.log("Img "+i+" transformed with success in file");
					// formData.append("files[]", file);
					// formData.append("files_url[]", url_without_blob);
				}
				else
				{
					console.log("Image with  normal url");
					if(post_platform == "linkedin"){formData_li.append("files_url[]", encodeURI(message.data.post_imgs[i]));};//url
					if(post_platform == "tumblr"){formData_tu.append("files_url[]", encodeURI(message.data.post_imgs[i]));};//url
					if(post_platform == "twitter"){formData_tw.append("files_url[]", encodeURI(message.data.post_imgs[i]));};//url
				}
			}

		}
		if(post_platform == "linkedin"){post_red_team(post_platform, formData_li);}; 
		if(post_platform == "tumblr"){post_red_team(post_platform, formData_tu);}; 
		if(post_platform == "twitter"){post_red_team(post_platform, formData_tw);}; 
		
		
	}
	
	
	if(post_platform == "facebook" || post_platform == "flickr")
	{

		
		if (post_platform == "facebook")
		{
			string_post_fb += "FBFINAL/REST.php?do=";
			string_post += "FBFINAL/REST.php?do=";
		}
		if((post_platform == "flickr"))
		{
			string_post_fl += "DPZ/REST.php?do=";
			string_post += "DPZ/REST.php?do=";
		}
		
		// FBFINAL/REST.php?do=PostImage&image=https%url.com&mesaj=test_txt&fbid=69420&submit=Image  fb img url + txt
		// ---FBFINAL/REST.php?do=PostUrl&url=https%url.com&mesaj=test_txt&fbid=69420&submit=Url  fb img url + txt
		// FBFINAL/REST.php?do=PostMessage&messenger=test_txt&fbid=69420&submit=Message fb only txt
		// DPZ/REST.php?do=PostImage&image=https%url.com&message=test_txt&userid=8453&submit=PostImage flickr img url + txt
		console.log("fb string="+string_post_fb +" fl string="+string_post_fl);
		if(message.data.post_imgs != "")//img +- txt
		{
			if (post_platform == "facebook")
			{
				string_post_fb += "PostImage";
			}
			if((post_platform == "flickr"))
			{
				string_post_fl += "PostImage";
			}
			console.log("fb string="+string_post_fb +" fl string="+string_post_fl);
			// for (var i = 0; i < message.data.post_imgs.length; i++)
			// {
				// if (message.data.post_imgs[i].substring(0,30).match('^data:image\/(.*);base64,'))
			if(message.data.post_imgs[0].substring(0,30).match('^data:image\/(.*);base64,'))
			{
				
				console.log("Image with data...base64 instead of url ->TO DO:tranform it in url somehow(imgur)");
				var file = await base64datatoFile(message.data.post_imgs[0], 'a_'+ post_platform+'.png');
				console.log("Img base64 transformed with success in file ");
				
				var url_imgur = "";
				
				transform_file_in_imgur_url(file, string_post_fb, string_post_fl, function(url_imgur , string_post_fb , string_post_fl ){
					
					console.log("Img transformed with success from file in url "+url_imgur);
					console.log("fb string="+string_post_fb +" fl string="+string_post_fl);
					if(!url_imgur.includes("error"))
					{
						if (post_platform == "facebook")
						{
							string_post_fb += "&image=" + url_imgur;
							if(message.data.post_text != "")
							{
								string_post_fb += "&mesaj="+message.data.post_text;
							}
							else
							{
								string_post_fb += "&mesaj=";
							}
							string_post_fb += "&fbid=69420&submit=Image";
						}
						if((post_platform == "flickr"))
						{
							string_post_fl += "&image=" +  url_imgur;
							if(message.data.post_text != "")
							{
								string_post_fl += "&message="+message.data.post_text;
							}
							else
							{
								string_post_fl += "&mesaj=";
							}
							// string_post_fl += "&userid=" + userid + "&submit=PostImage";
							string_post_fl += "&jwt=" + token + "&submit=PostImage";
						}
						console.log("fb string="+string_post_fb +" fl string="+string_post_fl);
					}
					else
					{
						console.log("Failed to transform file in imgur url");
					}
					
					if (post_platform == "facebook")
					{
						post_yellow_team(string_post_fb , post_platform);
					}
					if((post_platform == "flickr"))
					{
						post_yellow_team(string_post_fl , post_platform);
					}
					
				});
			
			}
			else if (message.data.post_imgs[0].substring(0,30).match('^blob:http'))
			{
				console.log("Image with blob+url ->TO DO:tranform it in url somehow(imgur)");
				var url_without_blob =  message.data.post_imgs[0].replace("blob:http", "http");
				// console.log("Img "+i+" transformed with success in file");
				// formData.append("files_url[]", url_without_blob);
				
				if (post_platform == "facebook")
				{
					string_post_fb += "&image="+encodeURIComponent(url_without_blob);
					string_post_fb += "&mesaj="+encodeURIComponent(message.data.post_text)+"&fbid=69420&submit=Image";
					post_yellow_team(string_post_fb , post_platform);
				}
				if((post_platform == "flickr"))
				{
					string_post_fl += "&image="+encodeURIComponent(url_without_blob);
					// string_post_fl += "&message="+encodeURIComponent(message.data.post_text)+"&userid=" + userid + "&submit=PostImage";
					string_post_fl += "&message="+encodeURIComponent(message.data.post_text)+"&jwt=" + token + "&submit=PostImage";
					post_yellow_team(string_post_fl , post_platform);
				}
				
			}
			else if (message.data.post_imgs[0].substring(0,30).match('^http'))
			{//We have img with url
				// formData.append("files_url[]", message.data.post_imgs[i]);//url
				// string_post += "&image="+message.data.post_imgs[i];
				console.log("Normal url . Other case(not blob or base64) :"+ message.data.post_imgs[0]);
				
				
				
					// formData.append("text", message.data.post_text);//text
				if (post_platform == "facebook")
				{
					string_post_fb += "&image="+encodeURIComponent(message.data.post_imgs[0]);
					if(message.data.post_text != "")
					{ 
						string_post_fb += "&mesaj="+encodeURIComponent(message.data.post_text);
					}
					else
					{
						string_post_fb += "&mesaj= ";
					}
					string_post_fb += "&fbid=69420&submit=Image";
					post_yellow_team(string_post_fb , post_platform);
				}
				else if((post_platform == "flickr"))
				{
					string_post_fl += "&image="+encodeURIComponent(message.data.post_imgs[0]);
					if(message.data.post_text != "")
					{
						string_post_fl += "&message="+encodeURIComponent(message.data.post_text);
					}
					else
					{
						string_post_fl += "&message= ";
					}
					// string_post_fl += "&userid=" + userid + "&submit=PostImage";
					string_post_fl += "&jwt=" + token + "&submit=PostImage";
					post_yellow_team(string_post_fl , post_platform);
				}
			}
		}
		else
		{//only txt 
			string_post_fl += "PostMessage";
			if(message.data.post_text != "")
			{ 
				if (string_post_fl == "facebook")
				{
					string_post_fl += "&messenger="+encodeURIComponent(message.data.post_text)+"&fbid=69420&submit=Message";//bug from yellow team-> only some user work
					post_yellow_team(string_post_fl , post_platform);
				}
				else if((post_platform == "flickr"))
				{// NOT IMPLEMENTED 
					console.log("We are not allowed to post only text on flickr")
					// string_post += "&messenger="+message.data.post_text+"&userId=" + userid + "&submit=PostImage";
				}
			}
		}
	}
}

function post_red_team(post_platform, formData)
{
	// 200["nothing happened"]-> for tumblr: maybe is not implemented yet?
	// 201{"message":"Posted successfully."}
	// 401{"error":"Unauthenticated for Twitter."}-> User have to authorize first
	// 401{"error":"Unauthenticated for Tumblr."}
	// 500{"error":"Internal server error."} 
	// 500{"error":[{"code":187,"message":"Status is a duplicate."}]}
	// 503{"error":"Internal server error."}
	
	console.log("We start to make post request for "+post_platform);
	var xhttp = new XMLHttpRequest();//build a HTML request for signup
	xhttp.open("POST", "http://sma-a4.herokuapp.com/"+post_platform+"/post", true);
	xhttp.withCredentials = true;
	xhttp.send(formData);
	
	xhttp.onload = () => {
		if (xhttp.status == 201) // TODO: We have to also check body message from response and errors 
		{

			console.log(xhttp.response);
			// send_login_data( email , password , 'registered');
			document.getElementById("authorize_div").innerHTML += ' '+
							'<p> Posted successfully on ' + post_platform + '  </p>';
		}
		else 
		{
			if (xhttp.status == 401)
			{
				
				document.getElementById("authorize_div").innerHTML += ' '+
							'<p> You need to authentificate first on ' + post_platform + ' </p>'
				
			}
			else
			{
				console.error('Error!'+xhttp.status);
				document.getElementById("authorize_div").innerHTML += ' '+
							'<p> Post error for ' + post_platform + " code="+ xhttp.status+ '  </p>';
				
			}
		}
	};
}
function post_yellow_team(string_post , post_platform)
{
	console.log("We have to request this :"+ string_post)
	if(string_post.includes("submit") && string_post.includes("do="))
	{
		var xhttp = new XMLHttpRequest();//build a HTML request for signup
		xhttp.open("GET", "https://web-rfnl5hmkocvsi.azurewebsites.net/" + string_post, true);
		xhttp.send();
		
		xhttp.onload = () => {
			if (xhttp.status == 200) // TODO: We have to also check body message from response and errors 
			{

				console.log(xhttp.response);
				// send_login_data( email , password , 'registered');
				
				document.getElementById("authorize_div").innerHTML += ' '+
								'<p> Posted successfully on ' + post_platform + '  </p>';
			}
			else 
			{
					console.error('Post error for ' + post_platform + " code="+ xhttp.status);
					document.getElementById("authorize_div").innerHTML += ' '+
								'<p> Post error for ' + post_platform + " code="+ xhttp.status+ '  </p>';
			}
		};
	}
	else
	{
		console.log("Something wrong with url(submit or do= not included):"+string_post);
	}	
}

function authorize_fct()
{
	document.getElementById("authorize_div").innerHTML = 
	'<input type="submit" id="authorize_request_btn_fb" class="authorize_request_class" name="facebook" value="Authorize Facebook">'+
	'<input type="submit" id="authorize_request_btn_fl" class="authorize_request_class" name="flickr" value="Authorize Flickr">'+
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
	
	if(clicked_platform == "twitter" || clicked_platform == "linkedin" || clicked_platform == "tumblr")
	{
		
		// check_profile_url = "http://sma-a4.herokuapp.com/"+clicked_platform+"/profile";
		check_auth_url = "http://sma-a4.herokuapp.com/"+clicked_platform+"/auth";
		// xhttp.open("GET", check_profile_url, true );
		xhttp.withCredentials = true;
		// xhttp.send();
		
		// xhttp.onload = () => {
			// if (xhttp.status == 401) // success but not yet authorized
			// {// parse JSON data
				// console.log("401 =");
				// console.log(xhttp.response);

				// chrome.runtime.sendMessage({
					// txt: "open_auth_url", 
					// data: {
						// subject: "Open auth link in new tab",
						// url: check_auth_url
					// }
				// });
			// }
			// else
			// {
				// if (xhttp.status == 403) //not autheficated yet . probably cookie missing
				// {
					// console.log("403 =");
					// console.log(xhttp.response);
				// }
				// else
				// {	
					// console.error('Error!');
				// }
			// }
		// };
		chrome.runtime.sendMessage({
			txt: "open_auth_url", 
			data: {
				subject: "Open auth link in new tab",
				url: check_auth_url
			}
		});
	}
	if(clicked_platform == "facebook" || clicked_platform == "flickr")
	{

		if(clicked_platform == "facebook")
		{
			// check_profile_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=getUserName&fbid="+userid;	
			check_profile_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=getUserName&fbid=69420";//Hardcoded. Yellow team have problems.
			// check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=login&userId="+userid+"&redirect=https%3A%2F%2Fwww.google.com%2F";
			check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=login&jwt="+token+"&redirect=https%3A%2F%2Fwww.google.com%2F";
		}
		if(clicked_platform == "flickr")
		{
			// check_profile_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/DPZ/REST.php?do=getAccountName&userid="+userid;
			check_profile_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/DPZ/REST.php?do=getAccountName&jwt="+token;
			// check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/DPZ/REST.php?do=login&userid="+userid+"&redirect=https%3A%2F%2Fwww.google.com%2F";
			check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/DPZ/REST.php?do=login&jwt="+token+"&redirect=https%3A%2F%2Fwww.google.com%2F";
		} 
		
		
		// xhttp.open("GET", check_profile_url, true );
		// xhttp.withCredentials = true;
		// xhttp.send();
		
		//To DO: test it after 
		// xhttp.onload = () => {
			// if (xhttp.status == 200) // all responses have 200 from Yellow team
			// {
				// //parse JSON data
				// console.log("200 ="+xhttp.response);
				// if(xhttp.response.includes("FULLNAME\":null") || xhttp.response.includes("NAME\":null"))
				// {
					// console.log("Null name -> ??? probably we have to authentificate first or else");
					// chrome.runtime.sendMessage({
						// txt: "open_auth_url", 
						// data: {
							// subject: "Open auth link in new tab",
							// url: check_auth_url
						// }
					// });
				// }
				
				// if(xhttp.response.includes("invalid user ID"))
				// {
					// console.log("Invalid user ID -> ??? probably we have to authentificate first or else");
					// chrome.runtime.sendMessage({
						// txt: "open_auth_url", 
						// data: {
							// subject: "Open auth link in new tab",
							// url: check_auth_url
						// }
					// });
				// }
				
			// }
			// else
			// {
					
				// console.error('Error!'+xhttp.response);

			// }
		// };
		chrome.runtime.sendMessage({
			txt: "open_auth_url", 
			data: {
				subject: "Open auth link in new tab",
				url: check_auth_url
			}
		});
		
	}

	// delete auth buttons
	document.getElementById("authorize_div").innerHTML = '';
	
	
}

async function base64datatoFile(url, filename, mimeType)
{
	console.log("Transform base64 data in file " + filename);
	mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
	return await (fetch(url)
		.then(async function(res){return await res.arrayBuffer();})
		.then(async function(buf){return await new File([buf], filename, {type:mimeType});})
	);
}
// async function base64data_to_url(url, filename, mimeType, callback)
// {
	// console.log("Transform base64 data in file");
	// mimeType = mimeType || (url.match(/^data:([^;]+);/)||'')[1];
	// callback( await (fetch(url)
		// .then(async function(res){return await res.arrayBuffer();})
		// .then(async function(buf){return await new File([buf], filename, {type:mimeType});})
	// ));
// }

// function blobToFile(theBlob, fileName){
    /////////////////////A Blob() is almost a File() - it's just missing the two properties below which we will add
    // theBlob.lastModifiedDate = new Date();
    // theBlob.name = fileName;
    // return theBlob;
// }

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


async function transform_file_in_imgur_url(image_file, string_post_fb, string_post_fl , callback)
{
	imgur_api_url = 'https://api.imgur.com/3/image';
	console.log("We have to transform a image in url . File name="+ image_file.fileName +" file size="+ image_file.fileSize);
	
	var xhttp = new XMLHttpRequest();
	xhttp.open("POST", imgur_api_url, true );
	xhttp.setRequestHeader("Authorization", "Client-ID 06c7ac752b19b37");

	
	var formData = new FormData();
    formData.append('image', image_file);
	
	xhttp.send(formData);
		
		
	imgur_url = "";
	xhttp.onload = function (){
		if ( xhttp.status == 200) 
		{

			var obj =  JSON.parse(xhttp.response);
			console.log(obj);
			
			console.log("Imgur url ="+ obj.data.link);
			imgur_url =  obj.data.link;
			callback(imgur_url, string_post_fb, string_post_fl);
			
		}
		else 
		{

			console.error('Error!'+xhttp.status);
			imgur_url =  "error";
			callback(imgur_url, string_post_fb, string_post_fl);
			
		}
		
	};

}

async function blob_to_data(bloburl)
{
	var xhr = new XMLHttpRequest;
	xhr.responseType = 'blob';
	var blobAsDataUrl = "";
	xhr.onload = function(formData, post_platform) {
	   var recoveredBlob = xhr.response;

	   var reader = new FileReader;

	   reader.onload = async function(formData, post_platform) {
			blobAsDataUrl = await reader.result;
			console.log("Blob Data:"+blobAsDataUrl);
			
			var file = await base64datatoFile(blobAsDataUrl, 'a_'+i+'_'+post_platform+'.png'); 
			console.log("Data "+i+" transformed with success in file");
	   };

	   reader.readAsDataURL(recoveredBlob);
	};

	xhr.open('GET', bloburl);
	await xhr.send();
	return blobAsDataUrl;
}
//TO DO : Allow multiple linkedin/facebook pages. We have to make select on wich of page to post. 
//TO DO : Integreate jwt token
//TO DO : Check if users are authetificated and ask for login if not;
//TO DO : dinamicaly check if a user open a post in a social platfom