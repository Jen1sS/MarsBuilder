var email;
var nickname;
var cityName;
var cityId;

function putEmail(){

    document.getElementById("email").innerHTML+=" "+nickname+", welcome back to "+cityName;
}

async function getPlayerInfo() {
    let res = await fetch("./api/player_get.php");
    res = await res.json();

    if (res["player"] === undefined) window.location.href = 'login.html';

    email = res["player"]["email"];
    nickname = res["player"]["nickname"];
    cityId = res["city"]["id"];
    cityName = res["city"]["name"];

    putEmail();
}

function renameCity(){
    document.getElementById("rename").style.display="block";
}

async function doRename(){
    let data = {
        newName: document.getElementById("newName").value,
        oldName: cityName,
    };

    let formData = new FormData();
    formData.append("data", JSON.stringify(data));

    let res = await fetch("./api/renameCity.php", {
        method: "POST",
        body: formData
    })


    res = await res.json();

    if (res.code===1) setTimeout(()=>{window.location.reload();},500);
    else alert("error");


}

async function restartCity(){
    const response = await fetch('./api/restartCity.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();
    if (result+"".includes("1")) window.location.reload();
}


async function logOut() {
    try {
        const response = await fetch('./api/logout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.code === 1) {
            window.location.href = 'login.html';
        } else {
            console.error('Logout failed:', result.desc);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}