
let listApartmentsHTML = document.querySelector('.Aptlist');
let listApartmentsSpan = document.querySelector('.title span');
//                   Liked Rooms Data
let likedRoomsHTML = document.querySelector('.RoomsList');
let likedRoomsSpan = document.querySelector('.icon-rooms-cart span');
let iconLikedRooms = document.querySelector('.icon-rooms-cart');
//
let body = document.querySelector('body');
let listApts = [];
let LikedRoomGlobalData = [];
let LikedRoomsData = [];
let likedRoomsByIP = [];

let currentIP;
let darkmode = false;
let currentIndex = 0;

const showLikedRooms = () => {
    body.classList.toggle('showLikedRooms');
}

function updateAptData(id, type){
    let AptDataStorage = JSON.parse(localStorage.getItem("AptDataStorage"));
    //          [ FIND USER -> UPDATE ROOMS ]
    AptDataStorage.forEach(Data => {
        if (Data.id == id){
            if (type == "likes+"){
                AptDataStorage[(AptDataStorage.indexOf(Data))].likes += 1;
            }else if (type == "likes-"){
                AptDataStorage[(AptDataStorage.indexOf(Data))].likes -= 1;
            }
        }
    });
    //          [ UPDATE LOCAL STORAGE ]
    localStorage.setItem("AptDataStorage", JSON.stringify(AptDataStorage));
}



//             STORAGE SYSTEM [ LIKED ROOMS ] -> JSON 
function updateLikedRooms(){
    if (localStorage.getItem("UserDataStorage") == null){
        localStorage.setItem("UserDataStorage","[]");
    }
    else{
        let currentData = JSON.parse(localStorage.getItem("UserDataStorage"));
        let newData = [4];
        
        //          [ FIND USER -> UPDATE ROOMS ]
        currentData.forEach(element => {
            if (element.ip == currentIP){
                currentData[(currentData.indexOf(element))].likedrooms = likedRoomsByIP;
            }
        });
        //          [ UPDATE LOCAL STORAGE ]
        localStorage.setItem("UserDataStorage", JSON.stringify(currentData));

        /*,`
        [{"ip": "10.11.0.0","rooms": [2,4]},
        {"ip": "10.12.1.1","rooms": [1,2]}]`*/
    }
}

function grapUserStorage(UID){
    let darkmodeCheckBox = document.getElementById("darkMode");
    let localdata = JSON.parse(localStorage.getItem("UserDataStorage"));
    likedRoomsByIP = localdata[UID].likedrooms;
    darkmode = localdata[UID].darkmode;
    darkmodeCheckBox.checked = darkmode;
    if (darkmode == true){
        body.classList.add("dark");
    }else {
        body.classList.remove("dark");
    }
}

function checkUserStorage(ip){
    let localdata = JSON.parse(localStorage.getItem("UserDataStorage"));
    let found = false;
    //          [ FIND USER -> UPDATE ROOMS ]
    localdata.forEach(element => {
        if (element.ip == ip){
            found = true;
            currentIP = ip;
            currentIndex = localdata.indexOf(element);
            grapUserStorage(localdata.indexOf(element));
        }
    });
    //          [ UPDATE LOCAL STORAGE ]
    if (found == false){
        localdata.push(JSON.parse(`{"ip": "${currentIP}","likedrooms": [], "darkmode": ${darkmode}}`));
        localStorage.setItem("UserDataStorage",JSON.stringify(localdata));
        console.log(JSON.stringify(localdata));
    }
}

const addDataToHTML = () => {
    listApartmentsHTML.innerHTML = '';
    if(listApts.length > 0){
        listApts.forEach( apt => {
            let newApt = document.createElement('div');
            let likes;
            let views;
            let AptDataStorage = JSON.parse(localStorage.getItem("AptDataStorage"));
            let Tags = [];
            AptDataStorage.forEach(aptStorage => {
                if (aptStorage.id == apt.id){
                    likes = aptStorage.likes;
                    views = aptStorage.views;
                }
            })
            newApt.classList.add('room');
            newApt.classList.add(`${apt.id}`);
            newApt.dataset.id = `${apt.id}`
            newApt.id = `${apt.id}`
            let likeButtonClass = 'addRoom';
            let likeButtonFunction = 'addRoomToLikedList';
            likedRoomsByIP.forEach(id => {
                if(id == apt.id){
                    likeButtonClass = 'addRoom Done';
                    likeButtonFunction = 'removeRoomFromList';
                    LoadLikedRooms();
                }
            });
            
            newApt.innerHTML = `
            <div class="image">
                <img src="${apt.img}" alt="">
                <div class="reviews">
                    <div class="likes">
                        <svg style="scale: 0.85;" class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z"/>
                        </svg>                              
                        ${likes}
                    </div>
                <div class="views">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                    <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                    ${views}
                </div>
            </div>
            </div>
            <div class="tags" id='tags ${apt.id}'>
            </div>
            <hr>
            <div class="info">
                <div class="apt">Apt. ${apt.apt}<div class="rooms">${apt.rooms} Rooms</div></div>
                <div class="price">$${apt.price}<div class="per">Monthly</div></div>
            </div>        
            <div class="buttons">
                <button onclick="${likeButtonFunction}(${apt.id})" class="${likeButtonClass}">
                    <svg class="addRoomsvg" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z"/>
                    </svg>
                </button>
                <button class="viewRooms">
                    More Details
                </button>
            </div>
            `;
            listApartmentsHTML.appendChild(newApt);
            let tagged_apt = document.getElementById(`tags ${apt.id}`);
            Tags = apt.tags;
            for (let i = 0; i < Tags.length; i++) {
                let newTag = document.createElement('div');
                newTag.innerHTML = `<div class="tag">${Tags[i]}</div>`
                tagged_apt.appendChild(newTag);
            }
        })
    }
    listApartmentsSpan.innerText = listApts.length;
    loading();
}

const saveLikedRooms = () => {
    if(LikedRoomsData.length > 0){
        LikedRoomsData.forEach( data => {
            if(data.ip == currentIP){
                likedRoomsByIP = data.rooms;
            }
        });
    }
}

const addRoomToLikedList = (room_id) => {
    let isExist = false;
    listApts.forEach(apt_id => {
        likedRoomsByIP.forEach(check_id => {
            if(room_id == check_id && isExist == false){
                isExist = true;
            }
        });
        
        if(apt_id.id == room_id && isExist == false){
            console.log("added");
            likedRoomsByIP.push(room_id)
            let newLikedRoom = document.createElement('div');
            newLikedRoom.classList.add('room');
            newLikedRoom.dataset.id = room_id;
            newLikedRoom.id = `LikedCard ${room_id}`;
            newLikedRoom.innerHTML = `
            <div class="image">
                <img src="${apt_id.img}" alt="">
            </div>
            <div class="title">
                ${apt_id.apt}
                <div class="rooms">${apt_id.rooms}</div>
            </div>
            <div class="price">$${apt_id.price}<div class="per">Monthly</div></div>
            <button class="removeLike">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z"/>
                </svg>
            </button>
            `
            likedRoomsHTML.appendChild(newLikedRoom);
            updateAptData(room_id, "likes+");
            addDataToHTML();
        }
    });
    likedRoomsSpan.innerText = likedRoomsByIP.length;
    updateLikedRooms();
}

const removeRoomFromList = (id) => {
    let roomHTML = document.getElementById(`LikedCard ${id}`);
    let index = likedRoomsByIP.indexOf(id);
    roomHTML.parentElement.removeChild(roomHTML);
    likedRoomsByIP.splice(index, 1);
    console.log(likedRoomsByIP);
    likedRoomsSpan.innerText = likedRoomsByIP.length;
    updateAptData(id, "likes-");
    addDataToHTML();
    updateLikedRooms();
}

const LoadLikedRooms = () => {
    likedRoomsHTML.innerHTML = '';
    listApts.forEach(apt => {
        likedRoomsByIP.forEach(check_id => {
            if(apt.id == check_id){
                let newLikedRoom = document.createElement('div');
                newLikedRoom.classList.add('room');
                newLikedRoom.dataset.id = check_id;
                newLikedRoom.id = `LikedCard ${check_id}`;
                newLikedRoom.innerHTML = `
                <div class="image">
                    <img src="${apt.img}" alt="">
                </div>
                <div class="title">
                    Apt. ${apt.apt}
                    <div class="rooms">${apt.rooms} Rooms</div>
                </div>
                <div class="price">$${apt.price}<div class="per">Monthly</div></div>
                <button onclick="removeRoomFromList(${check_id})" class="removeLike">
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.833 2c-.507 0-.98.216-1.318.576A1.92 1.92 0 0 0 6 3.89V21a1 1 0 0 0 1.625.78L12 18.28l4.375 3.5A1 1 0 0 0 18 21V3.889c0-.481-.178-.954-.515-1.313A1.808 1.808 0 0 0 16.167 2H7.833Z"/>
                    </svg>
                </button>
                `
                likedRoomsHTML.appendChild(newLikedRoom);
            }
        });
    });
    likedRoomsSpan.innerText = likedRoomsByIP.length;
}

const toggleDarkMode = () => {
    let darkmodeCheckBox = document.getElementById("darkMode");
    let localdata = JSON.parse(localStorage.getItem("UserDataStorage"));
    if (darkmodeCheckBox.checked == true){
        body.classList.add("dark");
    }else {
        body.classList.remove("dark");
    }
    localdata.forEach(data => {
        if (data.ip == currentIP){
            localdata[localdata.indexOf(data)].darkmode = darkmodeCheckBox.checked
        }
    });
    localStorage.setItem("UserDataStorage",JSON.stringify(localdata));
}

//          
//          AptDataStorage = [{"id": 1, "likes": 0, "views": 0}]
//
function SyncAptStorageData(){
    if (localStorage.getItem("AptDataStorage") == "" || localStorage.getItem("AptDataStorage") == null){
        localStorage.setItem("AptDataStorage",`[]`);
    }else {
        let AptDataStorage = JSON.parse(localStorage.getItem("AptDataStorage"));
        let isApt = false;
        listApts.forEach(htmlApt => {
            isApt = false;
            AptDataStorage.forEach(apt => {
                if (apt.id == htmlApt.id){
                    isApt = true;
                }
            });
            if (isApt == false){
                AptDataStorage.push(JSON.parse(`{"id": ${htmlApt.id},"likes": 0, "views": 0}`));
                localStorage.setItem("AptDataStorage",JSON.stringify(AptDataStorage));
            }
        });
        console.log(JSON.stringify(AptDataStorage));
        updateLikedRooms();
    }
}


function GetUserIP(){
    if (localStorage.getItem("UserDataStorage") == null){
        localStorage.setItem("UserDataStorage",`[]`);
    }
    fetch('https://api.ipify.org/?format=json')
    .then(apiData => apiData.json())
    .then(api => {
        currentIP = api.ip;
        checkUserStorage(api.ip);
        fetch('apts.json')
        .then(response => response.json())
        .then(data => {
            listApts = data;
            SyncAptStorageData();
            addDataToHTML();
        });
    });
}

function loading(){
    let progress = document.getElementById('loading-prog');
    let value = progress.style.width;
    let i = 0;
    let count = 0;
    var id = setInterval(frame, 20);
    function frame() {
      if (value >= 10) {
        clearInterval(id);
        i = 0;
        let loaded = setInterval(fadeOut, 20);
        async function fadeOut() {
            ++count;
            if (count > 20) {
                progress.parentElement.style.opacity = 0;
                progress.style.opacity = 0;
                progress.style.opacity = 0;
                if (count >= 30){
                    progress.parentElement.style.zIndex = -3;
                    clearInterval(loaded);
                }
            }
        }
      } else {
        value++;
        progress.style.width = (value * value) + 'px';
        console.log(value * value);
        }
    }
}

const initApp = () => {
    //localStorage.setItem("UserDataStorage",`[{"ip": "0.0.0.0", "likedrooms": [1], "darkmode": false},{"ip": "10.11.0.0", "likedrooms": [3], "darkmode": false}]`);
    GetUserIP();
}
initApp();
