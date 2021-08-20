
var active_group = 0;

let signup = document.querySelector(".signup")
let groups = document.querySelectorAll(".group")
let userData = {}
// function stopLoadingAnimation()

function validateEmail(email) {
 const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
 return re.test(String(email).toLowerCase());
}

async function authenticate(){
    let obj = {status:false}
    let validity = checkValidatity()
    if(!validity){
        return obj
    }
    let serverData = await sendUserToServer()
    obj["status"] = validity && serverData.status
    if(!serverData.status){

        if(serverData["error"]){
            if(serverData["type"] == "username"){
                groups[0].children[2].children[2].innerHTML = serverData["error"]
                groups[0].children[2].children[2].style.visibility = "visible"

                //other
                groups[0].children[1].children[2].style.visibility = "hidden"
                groups[0].children[0].children[2].style.visibility = "hidden"

            }
            if(serverData["type"] == "email"){
                groups[1].children[0].children[2].innerHTML = "email already exist"
                groups[1].children[0].children[2].style.visibility = "visible"

                //other
                groups[1].children[1].children[2].style.visibility = "hidden"
                groups[1].children[2].children[2].style.visibility = "hidden"
            }
            if(serverData["type"] == "injection"){
                 alert("injection error")
            }
        }
        deload()
    }
    if(serverData["type"] == "sucess"){
        sleep(500)
        window.location.href = '../login'

    }
    return obj
}

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

function checkValidatity(){
    if(active_group == 0){
        userData["firstname"] = groups[0].children[0].children[1].value
        userData["lastname"] = groups[0].children[1].children[1].value
        userData["username"] = groups[0].children[2].children[1].value

        if(userData["firstname"].length == 0){
            groups[0].children[0].children[2].innerHTML = "field is empty"
            groups[0].children[0].children[2].style.visibility = "visible"

            //other
            groups[0].children[1].children[2].style.visibility = "hidden"
            groups[0].children[2].children[2].style.visibility = "hidden"

            deload()
            return false
        }
        if(userData["username"].length == 0){
            groups[0].children[2].children[2].innerHTML = "field is empty"
            groups[0].children[2].children[2].style.visibility = "visible"

            //other
            groups[0].children[1].children[2].style.visibility = "hidden"
            groups[0].children[0].children[2].style.visibility = "hidden"

            deload()
            return false
        }
        if(userData["lastname"].length == 0){
            groups[0].children[1].children[2].innerHTML = "field is empty"
            groups[0].children[1].children[2].style.visibility = "visible"

            //other
            groups[0].children[0].children[2].style.visibility = "hidden"
            groups[0].children[2].children[2].style.visibility = "hidden"

            deload()
            return false
        }

    }
    if(active_group == 1){
        if(validateEmail(groups[1].children[0].children[1].value)){
            userData["email"] = groups[1].children[0].children[1].value
        }else{
            groups[1].children[0].children[2].innerHTML = "email is not valid"
            groups[1].children[0].children[2].style.visibility = "visible"

            //other
            groups[1].children[1].children[2].style.visibility = "hidden"
            groups[1].children[2].children[2].style.visibility = "hidden"

            deload()
            return false
        }
        if(groups[1].children[1].children[1].value.length == 0){
            groups[1].children[1].children[2].innerHTML = "field is empty"
            groups[1].children[1].children[2].style.visibility = "visible"

            //other
            groups[1].children[0].children[2].style.visibility = "hidden"
            groups[1].children[2].children[2].style.visibility = "hidden"
            deload()
            return false
            //password
        }
        if(groups[1].children[1].children[1].value != groups[1].children[2].children[1].value){
            groups[1].children[2].children[2].innerHTML = "Password doesnot match"
            groups[1].children[2].children[2].style.visibility = "visible"

            //other
            groups[1].children[1].children[2].style.visibility = "hidden"
            groups[1].children[0].children[2].style.visibility = "hidden"
            deload()
            return false
        }
        userData["password"] = groups[1].children[1].children[1].value
    }
    return true
}

function deload(){
    signup.classList.remove("load")
}

async function handleNext(){
    signup.classList.add("load")
    await sleep(2000)
    let auth = await authenticate()
    if(auth.status){
        active_group++;
        changeActiveGroup()
        signup.classList.remove("load")
    }

}

function changeActiveGroup(){
    for(const [index,group] of groups.entries()){
        if(index == active_group - 1){
            group.classList.add("lefthidden")
            group.classList.remove("hiddentoactive")
        }else{
            group.classList.add("hidden")
            group.classList.remove("hiddentoactive")

        }
        if(index == active_group){
            group.classList.remove("hidden")
            group.classList.remove("lefthidden")
            group.classList.add("hiddentoactive")
        }
    }
}
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
let res;

async function sendUserToServer(email){
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;


    const request = new Request(
        "user",
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
        body:JSON.stringify({...userData, active_group})
    })
    let res = await response.json()

    return res
}

