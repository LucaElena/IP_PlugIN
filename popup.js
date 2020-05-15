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
const sleep = ms => new Promise(res => setTimeout(res, ms));


string_post_fb = "";
string_post_fl = "";
string_post = "";
var default_page_fb = 0;
var default_page_li = 0;
var default_page_tu = 0;

var formData_li;
var formData_tw;
var formData_tu;

let imgur_urls = [];
let base64data_urls = [];
	// console.log('We deleted stored user data');
	// chrome.storage.local.set({'email': ""});
	// chrome.storage.local.set({'password': ""});
	// chrome.storage.local.set({'logged': false});
	// chrome.storage.local.set({'userId': ""});
	// chrome.storage.local.set({'token': ""});
	// chrome.storage.local.set({'fb_pages': ""});
	// chrome.storage.local.set({'li_pages': ""});
	// chrome.storage.local.set({'tu_pages': ""});



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
	imgur_urls = [];
	base64data_urls = [];
	
	string_post_fb = "";
	string_post_fl = "";
	string_post = "";
	formData_li = new FormData();
	formData_tw = new FormData();
	formData_tu = new FormData();
	
	if(url.includes("https://www.facebook.com") || url.includes("https://m.facebook.com")){current_social_page = "facebook"; current_img = img_facebook;}
	if(url.includes("https://www.flickr.com") || url.includes("https://m.flickr.com") || url.includes("https://flickr.com")){current_social_page = "flickr"; current_img = img_flickr;}
	if(url.includes("https://twitter.com")){current_social_page = "twitter"; current_img = img_twitter;}
	if(url.includes("https://www.tumblr.com") || url.includes("https://m.tumblr.com")){current_social_page = "tumblr"; current_img = img_tumblr;}
	if(url.includes("https://www.linkedin.com") || url.includes("https://m.linkedin.com")){current_social_page = "linkedin"; current_img = img_linkedin;}
	

	
	
	chrome.storage.local.get(['logged', 'email' , 'password', 'userId', 'token', 'fb_pages', 'li_pages', 'tu_pages'], function(data){
		logged = data.logged;
		email = data.email;
		password = data.password;
		userid = data.userId;
		token = data.token;
		fb_pages = data.fb_pages;
		li_pages = data.li_pages;
		tu_pages = data.tu_pages;
		
		console.log('We currently have saved data logged=' + logged + " email=" + email + " userid=" + userid + " token=" + token + " fb_pages=" + fb_pages + " li_pages=" + li_pages + " tu_pages=" + tu_pages);

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
				// document.getElementById("share_on_div").innerHTML = '<div><p align=center>You may also want to share your post here(default pages): </p>' + generete_share_on_html(current_social_page) +'</div>'; 
				document.getElementById("share_on_div").innerHTML = '<div><p align=center>Post here(default page): </p>' + generete_share_on_html(current_social_page)+'</div>'; 
				document.getElementById("share_on_div2").innerHTML = '<div><p align=center>Select other possible pages you own: </p></div>';
				
				document.getElementById("share_on_div3").innerHTML += '<div '+
				'id="list_linkedin" class="dropdown-check-list" tabindex="100">'+
					'<span class="anchor_li">Linkedin</span>'+
					'<ul id="items_linkedin" class="items_li">'+generete_sharemultiple_on_html(li_pages,"linkedin")+
					'</ul>'+
				'</div>';
				document.getElementById("share_on_div4").innerHTML += '<div id="list_tumblr" class="dropdown-check-list" tabindex="100">'+
					'<span class="anchor_tu">Tumbr</span>'+
					'<ul id="items_tumblr" class="items_tu">'+generete_sharemultiple_on_html(tu_pages,"tumblr")+
					'</ul>'+
				'</div>';
				document.getElementById("share_on_div5").innerHTML += '<div id="list_facebook" class="dropdown-check-list" tabindex="100">'+
					'<span class="anchor_fb">Facebook</span>'+
					'<ul id="items_facebook" class="items_fb">'+generete_sharemultiple_on_html(fb_pages,"facebook")+
					'</ul>'+
				'</div>';
				
				// code to control the dropdown buttons
				var checkList_li = document.getElementById('list_linkedin');
				var items_li = document.getElementById('items_linkedin');
				checkList_li.getElementsByClassName('anchor_li')[0].onclick = function (evt){
					if (items_li.classList.contains('visible'))
					{
						items_li.classList.remove('visible');
						items_li.style.display = "none";
					}
					else
					{
						items_li.classList.add('visible');
						items_li.style.display = "block";
					}
				}
				items_li.onblur = function(evt)
				{
					items_li.classList.remove('visible');
				}
				
				
				var checkList_tu = document.getElementById('list_tumblr');
				var items_tu = document.getElementById('items_tumblr');
				checkList_tu.getElementsByClassName('anchor_tu')[0].onclick = function (evt){
					if (items_tu.classList.contains('visible'))
					{
						items_tu.classList.remove('visible');
						items_tu.style.display = "none";
					}
					else
					{
						items_tu.classList.add('visible');
						items_tu.style.display = "block";
					}
				}
				items_tu.onblur = function(evt)
				{
					items_tu.classList.remove('visible');
				}
				
				var checkList_fb = document.getElementById('list_facebook');
				var items_fb = document.getElementById('items_facebook');
				checkList_fb.getElementsByClassName('anchor_fb')[0].onclick = function (evt){
					if (items_fb.classList.contains('visible'))
					{
						items_fb.classList.remove('visible');
						items_fb.style.display = "none";
					}
					else
					{
						items_fb.classList.add('visible');
						items_fb.style.display = "block";
					}
				}
				items_fb.onblur = function(evt)
				{
					items_fb.classList.remove('visible');
				}
				// end code to control the dropdown buttons
				
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
							
							if (message.data.post_imgs[0].substring(0,30).match('^blob:http'))
							{
								parallelizeTrasformBlobToBase64data(message.data.post_imgs, loopFnTransformInBase64data, function(){
									console.log('Done transforming all blob urls to base64data');
									for (var i = 0; i < base64data_urls.length; i++)
									{
										document.getElementById("you_want_to_share_media_div").innerHTML +='<img src=' + base64data_urls[i] + ' class="share_img">' ; 
										message.data.post_imgs[i] = base64data_urls[i];
									}
									base64data_urls = [];
								});
							}//We don't convert also on urls all images
							// else if (message.data.post_imgs[0].substring(0,30).match('^data:image\/(.*);base64,'))
							// {
								// parallelizeTrasformBase64dataInUrl(message.data.post_imgs, loopFnTransformInImgur, function(){
									// console.log('Done transforming all base64datas to urls');
									// for (var i = 0; i < imgur_urls.length; i++)
									// {
										// document.getElementById("you_want_to_share_media_div").innerHTML +='<img src=' + imgur_urls[i] + ' class="share_img">' ; 
										// message.data.post_imgs[i] = imgur_urls[i];
									// }
									// imgur_urls = [];
								// });
							// }
							else
							{
								for (var i = 0; i < message.data.post_imgs.length; i++)
								{

									document.getElementById("you_want_to_share_media_div").innerHTML +='<img src=' + message.data.post_imgs[i] + ' class="share_img">' ; 
								}
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
	if(message.data.post_videos != "")
	{
		for (var i = 0; i < message.data.post_videos.length; i++)
		{
			console.log('Video data we have to post =' + message.data.post_videos[i]);
		}
	}
	if(message.data.post_imgs != "")
	{
		// for (var i = 0; i < message.data.post_imgs.length; i++)
		// {
			if(message.data.post_imgs[0].substring(0,30).match('^data:image\/(.*);base64,'))
			{//We have images in base64data -> tranform them in urls only once -> not for each page/platform
				console.log("Image with data...base64 instead of url ->TO DO:tranform it in url somehow(imgur)");
				parallelizeTrasformBase64dataInUrl(message.data.post_imgs, loopFnTransformInImgur, function(){
					console.log('Done transforming all base64datas to urls');
					for (var i = 0; i < imgur_urls.length; i++)
					{
						console.log('Img data we have to post =' + imgur_urls[i]);
						message.data.post_imgs[i] = imgur_urls[i];
					}
					imgur_urls = [];
					
					for (key in social_pages_included) 
					{
						//default page
						if (social_pages_included[key] != current_social_page)
						{
							checkbox_default = "checkbox_"+social_pages_included[key];
							console.log('Selected default page from platform ' + social_pages_included[key] + ' value = ' + document.getElementById(checkbox_default).checked);
							if(document.getElementById(checkbox_default).checked === true)
							{
								console.log('Start post on '+social_pages_included[key]);
								post_on_platform(social_pages_included[key],message);
							}
						}
						
						//multi pages from fb/tu/li
						// This platforms allow multi_pages for same user
						if (social_pages_included[key] == "linkedin")
						{
							var pagesArr = li_pages.split(';');
							for (i = 1; i < pagesArr.length ; i++)
							{
								checkbox_multi = "checkbox_linkedin_"+pagesArr[i];
								console.log('Selected multi page '+ pagesArr[i] +' from platform '+social_pages_included[key]+' value = '+ document.getElementById(checkbox_multi).checked);
								
								if(document.getElementById(checkbox_multi).checked === true)
								{
									console.log('Start post on '+social_pages_included[key]+' '+social_pages_included[key]);
									post_on_platform(checkbox_multi,message);
								}
							}
						}
						if (social_pages_included[key] == "tumblr")
						{
							var pagesArr = tu_pages.split(';');
							for (i = 1; i < pagesArr.length ; i++)
							{
								checkbox_multi = "checkbox_tumblr_"+pagesArr[i];
								console.log('Selected multi page '+ pagesArr[i] +' from platform '+social_pages_included[key]+' value = ' + document.getElementById(checkbox_multi).checked);
								
								if(document.getElementById(checkbox_multi).checked === true)
								{
									console.log('Start post on '+social_pages_included[key]+' '+social_pages_included[key]);
									post_on_platform(checkbox_multi,message);
								}
							}
						}
						if (social_pages_included[key] == "facebook")
						{
							var pagesArr = fb_pages.split(';');
							for (i = 1; i < pagesArr.length ; i++)
							{//<input type="checkbox" id="checkbox_facebook_104962884545049">
								checkbox_multi = "checkbox_facebook_"+pagesArr[i];
								console.log('Selected multi page '+ pagesArr[i] +' from platform '+social_pages_included[key]+' value = '+ document.getElementById(checkbox_multi).checked);
								
								if(document.getElementById(checkbox_multi).checked === true)
								{
									console.log('Start post on '+social_pages_included[key]+' '+social_pages_included[key]);
									post_on_platform(checkbox_multi,message);
								}
							}
						}
					}
					
				});
			}
			else
			{
		// }
	// }

				for (key in social_pages_included) 
				{
					//default page
					if (social_pages_included[key] != current_social_page)
					{
						checkbox_default = "checkbox_"+social_pages_included[key];
						console.log('Selected default page from platform ' + social_pages_included[key] + ' value = ' + document.getElementById(checkbox_default).checked);
						if(document.getElementById(checkbox_default).checked === true)
						{
							console.log('Start post on '+social_pages_included[key]);
							post_on_platform(social_pages_included[key],message);
						}
					}
					
					//multi pages from fb/tu/li
					// This platforms allow multi_pages for same user
					if (social_pages_included[key] == "linkedin")
					{
						var pagesArr = li_pages.split(';');
						for (i = 1; i < pagesArr.length ; i++)
						{
							checkbox_multi = "checkbox_linkedin_"+pagesArr[i];
							console.log('Selected multi page '+ pagesArr[i] +' from platform '+social_pages_included[key]+' value = '+ document.getElementById(checkbox_multi).checked);
							
							if(document.getElementById(checkbox_multi).checked === true)
							{
								console.log('Start post on '+social_pages_included[key]+' '+social_pages_included[key]);
								post_on_platform(checkbox_multi,message);
							}
						}
					}
					if (social_pages_included[key] == "tumblr")
					{
						var pagesArr = tu_pages.split(';');
						for (i = 1; i < pagesArr.length ; i++)
						{
							checkbox_multi = "checkbox_tumblr_"+pagesArr[i];
							console.log('Selected multi page '+ pagesArr[i] +' from platform '+social_pages_included[key]+' value = ' + document.getElementById(checkbox_multi).checked);
							
							if(document.getElementById(checkbox_multi).checked === true)
							{
								console.log('Start post on '+social_pages_included[key]+' '+social_pages_included[key]);
								post_on_platform(checkbox_multi,message);
							}
						}
					}
					if (social_pages_included[key] == "facebook")
					{
						var pagesArr = fb_pages.split(';');
						for (i = 1; i < pagesArr.length ; i++)
						{//<input type="checkbox" id="checkbox_facebook_104962884545049">
							checkbox_multi = "checkbox_facebook_"+pagesArr[i];
							console.log('Selected multi page '+ pagesArr[i] +' from platform '+social_pages_included[key]+' value = '+ document.getElementById(checkbox_multi).checked);
							
							if(document.getElementById(checkbox_multi).checked === true)
							{
								console.log('Start post on '+social_pages_included[key]+' '+social_pages_included[key]);
								post_on_platform(checkbox_multi,message);
							}
						}
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
	chrome.storage.local.set({'userId': ""});
	chrome.storage.local.set({'token': ""});
	chrome.storage.local.set({'fb_pages': ""});//Here we could have multiple pages
	chrome.storage.local.set({'li_pages': ""});//Here we could have multiple pages
	chrome.storage.local.set({'tu_pages': ""});//Here we could have multiple pages
	
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
		// chrome.storage.local.set({'userId': 49});//This is hardcoded and only work for our user 
		
		console.log('We save data email = ' + email +' logged '+ true);
		
		
		//Obtain the token and decrypted to obtain the user Id
		var xhttp2 = new XMLHttpRequest();
		xhttp2.open("GET", "http://sma-a4.herokuapp.com/token", true);
		xhttp2.send();
		
		xhttp2.onload = () => {
			// process response
			if (xhttp2.status == 200)//TODO: Check errors and body response message
			{
				console.log("We get the token also: "+ JSON.parse(xhttp2.response).token);
				token = JSON.parse(xhttp2.response).token;
				chrome.storage.local.set({'token': JSON.parse(xhttp2.response).token});
				var decoded = jwt_decode(token);
				console.log("Decoden user_id="+decoded.user_id);
				chrome.storage.local.set({'userId': decoded.user_id});
				userid=decoded.user_id;
				
				
				var xhttp5 = new XMLHttpRequest();
				xhttp5.open("GET", "http://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=getPages&jwt="+token, true);
				xhttp5.setRequestHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9");
				xhttp5.send();
				
				xhttp5.onload = () => {
					// process response
					if (xhttp5.status == 200)//TODO: Check errors and body response message
					{
						
						let pages = JSON.parse(xhttp5.response).PAGE_IDS
						console.log("We get the facebook pages also: "+ pages);
						fb_pages = "";
						for (var i = 0; i < pages.length; i++)
						{
							fb_pages += ";"+pages[i];
						}
						chrome.storage.local.set({'fb_pages': fb_pages});
					}
					else
					{
						document.getElementById("authorize_div").innerHTML = ' '+
												'<p> Get Facebook get pages Error : '+xhttp5.status+xhttp5.response+'</p>';
							console.error('Error!');
					}
				};
						
			}
			else
			{
				document.getElementById("authorize_div").innerHTML = ' '+
										'<p> Token Error : '+xhttp2.status+xhttp2.response+'</p>';
					console.error('Error!');
			}
		};
		
		var xhttp3 = new XMLHttpRequest();
		xhttp3.open("GET", "http://sma-a4.herokuapp.com/linkedin/profile", true);
		xhttp3.send();
		
		xhttp3.onload = () => {
			// process response
			if (xhttp3.status == 200)//TODO: Check errors and body response message
			{
				
				let pages = JSON.parse(xhttp3.response).pages
				console.log("We get the linkedin pages also: "+ pages);
				li_pages = "";
				for (var i = 0; i < pages.length; i++)
				{
					li_pages += ";"+pages[i];
				}
				chrome.storage.local.set({'li_pages': li_pages});
			}
			else
			{
				document.getElementById("authorize_div").innerHTML = ' '+
										'<p> Get Linkedin get pages Error : '+xhttp3.status+xhttp3.response+'</p>';
					console.error('Error!');
			}
		};
		
		var xhttp4 = new XMLHttpRequest();
		xhttp4.open("GET", "http://sma-a4.herokuapp.com/tumblr/profile", true);
		xhttp4.send();
		
		xhttp4.onload = () => {
			// process response
			if (xhttp4.status == 200)//TODO: Check errors and body response message
			{
				
				let pages = JSON.parse(xhttp4.response).pages
				console.log("We get the tumblr pages also: "+ pages);
				tu_pages = "";
				for (var i = 0; i < pages.length; i++)
				{
					tu_pages += ";"+pages[i];
				}
				chrome.storage.local.set({'tu_pages': tu_pages});
			}
			else
			{
				document.getElementById("authorize_div").innerHTML = ' '+
										'<p> Get Tumblr get pages Error : '+xhttp4.status+xhttp4.response+'</p>';
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
	
	if(post_platform.includes("linkedin") || post_platform.includes("twitter") || post_platform.includes("tumblr"))
	{

		if(message.data.post_text != "")//work for twitter . It should work for linkedin too
		{ 
			// if(post_platform.includes("linkedin") && formData_li.get("text") != message.data.post_text){formData_li.append("text", message.data.post_text);};//text
			// if(post_platform.includes("tumblr") && formData_tu.get("text") != message.data.post_text){formData_tu.append("text", message.data.post_text);};//text
			// if(post_platform.includes("twitter") && formData_tw.get("text") != message.data.post_text){formData_tw.append("text", message.data.post_text);};//text
			if(post_platform.includes("linkedin"));//text
			{
				if(formData_li.get("text") == null)
				{
					formData_li.append("text", message.data.post_text);
				}
				else if (formData_li.get("text") != message.data.post_text)
				{
					formData_li.append("text", message.data.post_text);
				}
			}
			if(post_platform.includes("tumblr"));//text
			{
				if(formData_tu.get("text") == null)
				{
					formData_tu.append("text", message.data.post_text);
				}
				else if (formData_tu.get("text") != message.data.post_text)
				{
					formData_tu.append("text", message.data.post_text);
				}
			}
			if(post_platform.includes("twitter"));//text
			{
				if(formData_tw.get("text") == null)
				{
					formData_tw.append("text", message.data.post_text);
				}
				else if (formData_tw.get("text") != message.data.post_text)
				{
					formData_tw.append("text", message.data.post_text);
				}
			}
			
			
			
		}
		if(message.data.post_imgs != "")
		{
			for (var i = 0; i < message.data.post_imgs.length; i++)
			{
				if (message.data.post_imgs[i].substring(0,30).match('^data:image\/(.*);base64,'))
				{
					console.log("Image with data...base64 instead of url -> tranform it in file");
					var file = await base64datatoFile(message.data.post_imgs[i], 'a_'+i+'_'+post_platform+'.png');
					console.log("Img "+i+" transformed with success in file");
					if( post_platform.includes("twitter"))
					{
						if (formData_tw.get("files[]") == null )
						{
							console.log("File form empty -> add file");
							formData_tw.append("files[]", file);
						}
						else
						{
							var included = 0;
							for (var value of formData_tw.values("files[]"))
							{
								if (value.size == file.size){included = 1;}
							}
							if (!included)
							{
								console.log("File not included -> add file");
								formData_tw.append("files[]", file);
							}
						}
					}
					if(post_platform.includes("linkedin"))
					{
						if (formData_li.get("files[]") == null )
						{
							console.log("File form empty -> add file");
							formData_li.append("files[]", file);
						}
						else
						{
							var included = 0;
							for (var value of formData_li.values("files[]"))
							{
								if (value.size == file.size){included = 1;}
							}
							if (!included)
							{
								console.log("File not included -> add file");
								formData_li.append("files[]", file);
							}
						}
					}
					if(post_platform.includes("tumblr"))
					{
						if (formData_tu.get("files[]") == null )
						{
							console.log("File form empty -> add file");
							formData_tu.append("files[]", file);
						}
						else
						{
							var included = 0;
							for (var value of formData_tu.values("files[]"))
							{
								if (value.size == file.size){included = 1;}
							}
							if (!included)
							{
								console.log("File not included -> add file");
								formData_tu.append("files[]", file);
							}
						}
					}
					// if(post_platform.includes("linkedin")){formData_li.append("files[]", file);};//file
					// if(post_platform.includes("tumblr")){if(i==0){formData_tu.append("files[]", file);}};//file//Tumblr accept only a image
					// if(post_platform.includes("twitter")){formData_tw.append("files[]", file);};//file
				}
				else
				{
					console.log("Image with  normal url");
					if(post_platform.includes("linkedin"))
					{
						if (formData_li.get("files_url[]") == null )
						{
							console.log("File url form empty -> add url");
							formData_li.append("files_url[]", encodeURI(message.data.post_imgs[i]));
						}
						else
						{
							var included = 0;
							for (var value of formData_li.values("files_url[]"))
							{
								if (value == encodeURI(message.data.post_imgs[i])){included = 1;}
							}
							if (!included)
							{
								console.log("File url not included -> add url");
								formData_li.append("files_url[]", encodeURI(message.data.post_imgs[i]));
							}
						}
					}
					if(post_platform.includes("tumblr"))
					{
						if (formData_tu.get("files_url[]") == null )
						{
							console.log("File url form empty -> add url");
							formData_tu.append("files_url[]", encodeURI(message.data.post_imgs[i]));
						}
						else
						{
							var included = 0;
							for (var value of formData_tu.values("files_url[]"))
							{
								if (value == encodeURI(message.data.post_imgs[i])){included = 1;}
							}
							if (!included)
							{
								console.log("File url not included -> add url");
								formData_tu.append("files_url[]", encodeURI(message.data.post_imgs[i]));
							}
						}
					}
					if(post_platform.includes("twitter"))
					{
						if (formData_tw.get("files_url[]") == null )
						{
							console.log("File url form empty -> add url");
							formData_tw.append("files_url[]", encodeURI(message.data.post_imgs[i]));
						}
						else
						{
							var included = 0;
							for (var value of formData_tw.values("files_url[]"))
							{
								if (value == encodeURI(message.data.post_imgs[i])){included = 1;}
							}
							if (!included)
							{
								console.log("File url not included -> add url");
								formData_tw.append("files_url[]", encodeURI(message.data.post_imgs[i]));
							}
						}
					}
					
					// if(post_platform.includes("linkedin")){formData_li.append("files_url[]", encodeURI(message.data.post_imgs[i]));};//url
					// if(post_platform.includes("tumblr")){formData_tu.append("files_url[]", encodeURI(message.data.post_imgs[i]));};//url
					// if(post_platform.includes("twitter")){formData_tw.append("files_url[]", encodeURI(message.data.post_imgs[i]));};//url
				}
			}

		}
		if(post_platform.includes("linkedin")){post_red_team(post_platform, formData_li);}; 
		if(post_platform.includes("tumblr")){post_red_team(post_platform, formData_tu);}; 
		if(post_platform.includes("twitter")){post_red_team(post_platform, formData_tw);}; 
		
		
	}
	
	
	if(post_platform.includes("facebook") || post_platform.includes("flickr"))
	{

		
		if (post_platform.includes("facebook") && !string_post_fb.includes("FBFINAL\/REST"))
		{
			string_post_fb += "FBFINAL/REST.php?do=";
			string_post += "FBFINAL/REST.php?do=";
		}
		if(post_platform.includes("flickr") && !string_post_fl.includes("DPZ\/REST"))
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
			if (post_platform.includes("facebook"))
			{
				if(message.data.post_imgs.length >= 2)
				{
					if(!string_post_fb.includes("do=MultipleImage"))
					{
						string_post_fb += "MultipleImage";
					}
				}
				else
				{
					if(!string_post_fb.includes("do=PostImage"))
					{
						string_post_fb += "PostImage";
					}
				}
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
			{//We have images in base64data
				
				console.log("Image with data...base64 instead of url ->TO DO:tranform it in url somehow(imgur)");
				parallelizeTrasformBase64dataInUrl(message.data.post_imgs, loopFnTransformInImgur, function(){
					console.log('Done transforming all base64datas to urls');
					if (post_platform.includes("facebook"))
					{
						if (!string_post_fb.includes(encodeURIComponent(imgur_urls[0])))
						{
							string_post_fb += "&image=" + encodeURIComponent(imgur_urls[0]);
						}
						
						if(imgur_urls.length >= 2)
						{
							for (var i = 1; i < imgur_urls.length; i++)
							{
								if (!string_post_fb.includes(encodeURIComponent(imgur_urls[i])))
								{
									string_post_fb += "%2B" + encodeURIComponent(imgur_urls[i]);
								}
							}
						}
						if(message.data.post_text != "")
						{
							if (!string_post_fb.includes(encodeURIComponent(message.data.post_text)))
							{
								string_post_fb += "&mesaj="+encodeURIComponent(message.data.post_text);
							}
						}
						else
						{
							string_post_fb += "&mesaj=";
						}
						if(message.data.post_imgs.length >= 2)
						{
							if (!string_post_fb.includes("&submit=MultipleImage"))
							{
								string_post_fb += "&jwt="+token+"&submit=MultipleImage";
							}
						}
						else
						{
							// string_post_fb += "&fbid="+userid+"&submit=Image";
							if (!string_post_fb.includes("&submit=Image"))
							{
								string_post_fb += "&jwt="+token+"&submit=Image";
							}
						}
						
					}
					if((post_platform == "flickr"))
					{
						string_post_fl += "&image=" + encodeURIComponent(imgur_urls[0]);
						if(imgur_urls.length >= 2)
						{
							for (var i = 1; i < imgur_urls.length; i++)
							{
								string_post_fl += "," + encodeURIComponent(imgur_urls[i]);
							}
						}
						
						if(message.data.post_text != "")
						{
							string_post_fl += "&message="+encodeURIComponent(message.data.post_text);
						}
						else
						{
							string_post_fl += "&mesaj=";
						}
						// string_post_fl += "&userid=" + userid + "&submit=PostImage";
						string_post_fl += "&token=" + token + "&submit=PostImage";
					}
					
					if(post_platform.includes("facebook"))
					{
						console.log("Post fb string= "+string_post_fb);
						post_yellow_team(string_post_fb , post_platform);
					}
					if(post_platform.includes("flickr"))
					{
						console.log("Post fl string= "+string_post_fl);
						post_yellow_team(string_post_fl , post_platform);
					}
					
					imgur_urls = [];
				});
				
				// var file = await base64datatoFile(message.data.post_imgs[0], 'a_'+ post_platform+'.png');
				// console.log("Img base64 transformed with success in file ");
				
				// var url_imgur = "";
				
				// transform_file_in_imgur_url(file, string_post_fb, string_post_fl, function(url_imgur , string_post_fb , string_post_fl ){
					
					// console.log("Img transformed with success from file in url "+url_imgur);
					// console.log("fb string="+string_post_fb +" fl string="+string_post_fl);
					// if(!url_imgur.includes("error"))
					// {
						// if (post_platform == "facebook")
						// {
							// string_post_fb += "&image=" + url_imgur;
							// if(message.data.post_text != "")
							// {
								// string_post_fb += "&mesaj="+message.data.post_text;
							// }
							// else
							// {
								// string_post_fb += "&mesaj=";
							// }
							// string_post_fb += "&fbid=69420&submit=Image";
						// }
						// if((post_platform == "flickr"))
						// {
							// string_post_fl += "&image=" +  url_imgur;
							// if(message.data.post_text != "")
							// {
								// string_post_fl += "&message="+message.data.post_text;
							// }
							// else
							// {
								// string_post_fl += "&mesaj=";
							// }
							// string_post_fl += "&userid=" + userid + "&submit=PostImage";
							// string_post_fl += "&jwt=" + token + "&submit=PostImage";
						// }
						// console.log("fb string="+string_post_fb +" fl string="+string_post_fl);
					// }
					// else
					// {
						// console.log("Failed to transform file in imgur url");
					// }
					
					// if (post_platform == "facebook")
					// {
						// post_yellow_team(string_post_fb , post_platform);
					// }
					// if((post_platform == "flickr"))
					// {
						// post_yellow_team(string_post_fl , post_platform);
					// }
					
				// });
			
			}
			else if (message.data.post_imgs[0].substring(0,30).match('^http'))
			{//We have imgs with url
				console.log("Normal url . Other case(not blob or base64) :"+ message.data.post_imgs[0]);
				
				if (post_platform.includes("facebook"))
				{
					if (!string_post_fb.includes(encodeURIComponent(message.data.post_imgs[0])))
					{
						string_post_fb += "&image="+encodeURIComponent(message.data.post_imgs[0]);
					}
					if(message.data.post_imgs.length >= 2)
					{
						for (var i = 1; i < message.data.post_imgs.length; i++)
						{
							if (!string_post_fb.includes(encodeURIComponent(message.data.post_imgs[i])))
							{
								string_post_fb += "%2B" + encodeURIComponent(message.data.post_imgs[i]);
							}
						}
					}
					if(message.data.post_text != "")
					{ 
						if (!string_post_fb.includes(encodeURIComponent(message.data.post_text)))
						{
							string_post_fb += "&mesaj="+encodeURIComponent(message.data.post_text);
						}
					}
					else
					{
						string_post_fb += "&mesaj= ";
					}
					// string_post_fb += "&fbid="+userid+"&submit=Image";
					if (!string_post_fb.includes("&submit=Image"))
					{
						string_post_fb += "&jwt="+token+"&submit=Image";
					}
					post_yellow_team(string_post_fb , post_platform);
				}
				else if((post_platform == "flickr"))
				{
					string_post_fl += "&image="+encodeURIComponent(message.data.post_imgs[0]);
					if (message.data.post_imgs.length >= 2)
					{
						for (var i = 1; i < message.data.post_imgs.length; i++)
						{
							string_post_fl += ","+encodeURIComponent(message.data.post_imgs[i]);
						}
					}
					if(message.data.post_text != "")
					{
						string_post_fl += "&message="+encodeURIComponent(message.data.post_text);
					}
					else
					{
						string_post_fl += "&message= ";
					}
					// string_post_fl += "&userid=" + userid + "&submit=PostImage";
					string_post_fl += "&token=" + token + "&submit=PostImage";
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
					// string_post_fl += "&messenger="+encodeURIComponent(message.data.post_text)+"&fbid="+userid+"&submit=Message";//bug from yellow team-> only some user work
					string_post_fl += "&messenger="+encodeURIComponent(message.data.post_text)+"&jwt="+token+"&submit=Message";//bug from yellow team-> only some user work
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
	
	for (var value of formData.values())
	{
	   console.log("Red formdata value: " + value);
	}
	
	if(post_platform.includes("tumblr") && default_page_tu == 1 && post_platform.includes("calmiselena.tumblr.com"))
	{
		console.log("Default page already posted -> not post again");
		return 1;
	}
	if(post_platform.includes("linkedin") && default_page_li == 1 && post_platform.includes("urn:li:organization:53085711"))
	{
		console.log("Default page already posted -> not post again");
		return 1;
	}
	if(post_platform == "tumblr"){default_page_tu = 1}
	if(post_platform == "linkedin"){default_page_li = 1}
	
	
	var url = "http://sma-a4.herokuapp.com/"+post_platform+"/post";
	if(post_platform.includes("checkbox_"))
	{
		var s = post_platform;
		var s = s.substring(s.indexOf('_')+1,s.length);
		var post_id = s.substring(s.indexOf('_')+1,s.length);
		url +="?page="+ page_id;
	}
	console.log("We have to request url ": + url);
	return 1;
	var xhttp = new XMLHttpRequest();//build a HTML request for signup
	xhttp.open("POST", url, true);
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
	
	

	if(string_post.includes("submit") && string_post.includes("do=") && !string_post.includes("error"))
	{
		var xhttp = new XMLHttpRequest();//build a HTML request for signup
		var url = "https://web-rfnl5hmkocvsi.azurewebsites.net/" + string_post;
		if(post_platform.includes("checkbox_"))
		{
			var s = post_platform;
			var s = s.substring(s.indexOf('_')+1,s.length);
			var post_id = s.substring(s.indexOf('_')+1,s.length);
			url +="&paginaId="+ page_id;//have to test if is working 
			
		}
		console.log("We have to request url ": + url);
		return 1;
		xhttp.open("GET", url, true);
		xhttp.send();
		
		xhttp.onload = () => {
			if (xhttp.status == 200) // TODO: We have to also check body message from response and errors 
			{

				console.log(xhttp.response);
				// send_login_data( email , password , 'registered');
				if(xhttp.response.includes("Success"))
				{
					document.getElementById("authorize_div").innerHTML += ' '+
								'<p> Posted successfully on ' + post_platform + '  </p>';
				}
				else
				{
					console.error('Post error for ' + post_platform + " code="+ xhttp.status);
					document.getElementById("authorize_div").innerHTML += ' '+
								'<p> Post error for ' + post_platform + " code="+ xhttp.status+ '  </p>';
				}
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
		document.getElementById("authorize_div").innerHTML += ' '+
								'<p> Post error for ' + post_platform + ' malformed request </p>';
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
			// check_profile_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=getUserName&fbid="+userid;//Hardcoded. Yellow team have problems. Resolved	
			check_profile_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=getUserName&jwt="+token;
			// check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=login&userId="+userid+"&redirect=https%3A%2F%2Fwww.google.com%2F";
			// check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=login&userId="+userid+"&redirect=https%3A%2F%2Fwww.google.com%2F";
			check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=login&jwt="+token+"&redirect=https%3A%2F%2Fwww.google.com%2F";
			// check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/FBFINAL/REST.php?do=login&jwt="+token+"&redirect=https%3A%2F%2Fwww.google.com%2F";
		}
		if(clicked_platform == "flickr")
		{
			// check_profile_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/DPZ/REST.php?do=getAccountName&userid="+userid;
			check_profile_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/DPZ/REST.php?do=getAccountName&token="+token;
			// check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/DPZ/REST.php?do=login&userid="+userid+"&redirect=https%3A%2F%2Fwww.google.com%2F";
			check_auth_url = "https://web-rfnl5hmkocvsi.azurewebsites.net/DPZ/REST.php?do=login&token="+token+"&redirect=https%3A%2F%2Fwww.google.com%2F";
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

function parallelizeTrasformBlobToBase64data(bloburl_list, fn, done)
{
	var total = bloburl_list.length,
	doneTask = function() {
	  if (--total === 0) {
		done();
	  }
	};

	bloburl_list.forEach(function(value) {
	  fn(doneTask, value);
	});
}

function parallelizeTrasformBase64dataInUrl(data64_list, fn, done)
{
	var total = data64_list.length,
	doneTask = function() {
	  if (--total === 0) {
		done();
	  }
	};

	data64_list.forEach(function(value) {
	  fn(doneTask, value);
	});
}
function loopFnTransformInImgur(doneTask, value)
{
	myFuncTransformInImgurUrl(value, doneTask);
}

function loopFnTransformInBase64data(doneTask, value)
{
	myFuncTransformInBase64data(value, doneTask);
}

async function myFuncTransformInBase64data(value, callback)
{
	var xhr = new XMLHttpRequest;
	xhr.responseType = 'blob';
	var blobAsDataUrl = "";
	xhr.onload = function() {
	   var recoveredBlob = xhr.response;

	   var reader = new FileReader;

	   reader.onload = async function() {
			blobAsDataUrl = await reader.result;
			console.log("Blob url transform with success base64data:"+blobAsDataUrl);
			base64data_urls.push(blobAsDataUrl);
			callback(blobAsDataUrl);
			
	   };

	   reader.readAsDataURL(recoveredBlob);
	};

	xhr.open('GET', value);
	await xhr.send();
}
async function myFuncTransformInImgurUrl(value, callback)
{
	var image_file = await base64datatoFile(value, 'file_'+ Math.floor(Math.random() * (100 - 0 + 1)) +'.png');
	console.log("Img base64 transformed with success in file");
	await sleep(Math.floor(Math.random() * (100 - 0 + 1)));//We got blocked by imgur if we upload to fast; 
	imgur_api_url = 'https://api.imgur.com/3/image';
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
			imgur_urls.push(imgur_url);
			callback(imgur_url);
			
		}
		else 
		{

			console.error('Imgur error status :'+xhttp.status);
			console.error('Imgur error response :'+xhttp.response);
			imgur_url =  "error";
			imgur_urls.push(imgur_url);
			callback(imgur_url);
			
		}	
	};
}

function clear_html_containers()
{
	
	document.getElementById("meniu_div").innerHTML = '';
	document.getElementById("login_div").innerHTML = '';
	document.getElementById("register_div").innerHTML = '';
	document.getElementById("authorize_div").innerHTML = '';
	document.getElementById("social_on_div").innerHTML = '';
	document.getElementById("share_on_div").innerHTML = '';
	document.getElementById("share_on_div2").innerHTML = '';
	document.getElementById("share_on_div3").innerHTML = '';
	document.getElementById("share_on_div4").innerHTML = '';
	document.getElementById("share_on_div5").innerHTML = '';
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

function generete_sharemultiple_on_html(multi_pages,platfom)
{
	var multi_pagesArr = multi_pages.split(';');
	var input_string = "";
	for (var i = 1; i < multi_pagesArr.length; i++)
	{
		input_string += '<li><input type="checkbox" id="checkbox_'+platfom+'_'+multi_pagesArr[i]+'"/>'+ multi_pagesArr[i]+'</li>'
	}
	return input_string;
}







//TO DO : Allow multiple linkedin/facebook/tumblr pages. We have to make select on wich of page to post.  - almost done - not tested 
//TO DO : Integreate jwt token - done(flick/fb)
//TO DO : Paralel blob/base64data transform in files/urls - done
//TO DO : Flickr multiple images - done
//TO DO : Facebook multiple images - done 
//TO DO : Check if users are authetificated and ask for login if not;
//TO DO : Dinamicaly check if a user open a post in a social platfom