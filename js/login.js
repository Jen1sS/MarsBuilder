/*******************************************************************
 FUNZIONI DI NAVIGAZIONE
 *******************************************************************/

function goToGoogle() {
    window.location = "https://www.ecosia.org";
}

/*******************************************************************
 FUNZIONI DI REGISRAZIONE
 *******************************************************************/

function validateEmail(e) {
    const patt = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patt.test(e);
}

async function register() {
    let valid = true;

    if (!validateEmail(document.getElementById("r-email").value)) {
        document.getElementById("errors").innerHTML = "Error: The email is not valid";
        valid=false;
    }
    if (document.getElementById("r-nickname").value === "" ){
        document.getElementById("errors").innerHTML = "Error: The nickname is empty";
        valid=false;
    }
    if ((document.getElementById("r-password").value !== document.getElementById("r-cpassword").value)) {
        document.getElementById("errors").innerHTML = "Error: The passwords are different";
        valid=false;
    }
    if (document.getElementById("r-password").value === "") {
        document.getElementById("errors").innerHTML = "Error: The password is empty";
        valid=false;
    }

    if (valid) {
        let data = {
            id: -1,
            email: document.getElementById("r-email").value,
            nickname: document.getElementById("r-nickname").value,
            avatar: "",
            password: document.getElementById("r-password").value,
        }

        let formData = new FormData();
        formData.append("data", JSON.stringify(data))

        res = await fetch("./api/register.php", {
            method: "POST",
            body: formData
        })

        res = await res.json();

        if (res.code === 1) {
            location.reload()
        } else console.log(res.desc);
    }
}

async function login() {

    let data = {
        email: document.getElementById("l-email").value,
        password: document.getElementById("l-password").value,
    }

    let formData = new FormData();
    formData.append("data", JSON.stringify(data))
    
    res = await fetch("./api/login.php", {
        method: "POST",
        body: formData
    })


    res = await res.json();


    if (res.code === 1) {
        email = document.getElementById("l-email").value;
        window.location.href = "http://127.0.0.1/marsbuilder/index.html"
    } else console.log(res.desc);
}

async function checkSession() {
    res = await fetch("./api/player_get.php");
    res = await res.json();

    if (Object.keys(res).length !== 0) window.location.href = "http://127.0.0.1/marsbuilder/index.html";
}