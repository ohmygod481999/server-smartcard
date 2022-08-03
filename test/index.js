
function signup () {
    let userName = document.querySelector("#user").value
    let password = document.querySelector("#password").value
    let email = document.querySelector("#email").value

    axios.post(`http://localhost:8888/auth/signup`, {
        userName, email, password
    }).then(res => console.log(res.data))
    .catch(err => console.log(err))
}


function signin () {
    let password = document.querySelector("#password").value
    let email = document.querySelector("#email").value

    axios.post(`http://localhost:8888/auth/signin`, {
        email, password
    }).then(res => console.log(res.data))
    .catch(err => console.log(err))
}

function upload() {

    const file = document.querySelector("#input").files[0];
    const formData = new FormData()
    formData.append('file', file)
    axios.post(`http://localhost:3003/cv/upload`, formData, { headers: {account_id:236}}).then(res => console.log(res.data))
    .catch(err => console.log(err))
}