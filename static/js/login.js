let login_form = document.querySelector(".login")
let group = login_form.children[2].children[0]
let username_input = group.children[0]
let password_input = group.children[1]
let userData = {}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function load(){
	login_form.classList.add("load")
}
function deload(){
	login_form.classList.remove("load")
}


async function authenticate(){
	let obj = {status:false}
	let serverData = await sendUserToServer()
	if(!serverData["status"]){
		if(serverData["type"] == "username"){
			showError(username_input,"username or email doesnot exist",password_input)
		}else{
			showError(password_input,"password doesnot match",username_input)
		}
		deload()
	}else{
		window.location.href = "../"
	}
}

function getValue(input_group){
	return input_group.children[1].value
}

function isEmptyInput(input_group){
	return getValue(input_group).length == 0
}

function showError(input_group,error,input_group2){
	input_group.children[2].innerHTML = error
	input_group.children[2].style.visibility = "visible"

	input_group2.children[2].style.visibility = "hidden"
}

function recordUserData(){
	if(isEmptyInput(username_input)){
		showError(username_input,"field is empty",password_input)
		deload()
	}else if(isEmptyInput(username_input)){
		showError(username_input,"field is empty",password_input)
		deload()
	}else{
		userData["username_email"] = getValue(username_input)
		userData["password"] = getValue(password_input)
		return true
	}
	return false

}

async function handleLogin(){
	load()
	if(recordUserData()){
		await sleep(2000)
		let auth = await authenticate()
	}
}

async function sendUserToServer(email){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const request = new Request("user_login",
        {
        headers: {
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            }
        }
    );
    let response = await fetch(request, {
        method: 'POST',
        mode: 'same-origin',
        body:JSON.stringify({...userData})
    })
    let res = await response.json()

    return res
}