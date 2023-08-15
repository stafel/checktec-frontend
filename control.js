const pb = new PocketBase("https://checktec.pockethost.io");

userinfo = null;

dummy_boxes = [
    {
        boxnr: "MX123456",
        userid: "rafael.stauffer@checktec.ch",
        bezeichnung: "Testcontroller",
        standort: "Präsentationsstand",
        letztes_update: "15.08.2023 15:31",
        ist_leer: false,
    },
    {
        boxnr: "BX123456",
        userid: "rafael.stauffer@checktec.ch",
        bezeichnung: "Testbox",
        standort: "Präsentationsstand",
        letztes_update: "15.08.2023 15:31",
        ist_leer: false,
    },
    {
        boxnr: "BX121212",
        userid: "rafael.stauffer@checktec.ch",
        bezeichnung: "Kirschen",
        standort: "Präsentationsstand",
        letztes_update: "15.08.2023 15:31",
        ist_leer: false,
    },
];

team = [
    {name: "Brian", job: "Projektleiter", img: "brian.png"},
    {name: "Daniel", job: "Stv. Projektleiter, Dokumentation", img: "daniel.png"},
    {name: "Leorant", job: "Maschinenbau", img: "leorant.png"},
    {name: "Ilija", job: "Maschinenbau", img: "ilija.png"},
    {name: "Joel", job: "Elektrotechnik", img: "joel.png"},
    {name: "Dominic", job: "Elektrotechnik", img: "dominic.png"},
    {name: "Elia", job: "Elektrotechnik", img: "elia.png"},
    {name: "Rafael", job: "IT, Frontend", img: "rafael.png"},
    {name: "Marc", job: "IT, Backend", img: "marc.png"},
]

function getTeam() {
    return team;
}

function clearBoxes() {
    localStorage.setItem("boxes", null);
}

function loadBoxes() {
    let boxes = JSON.parse(localStorage.getItem("boxes"));
    if (boxes === null) {
        return dummy_boxes;
    }
    return boxes;
}

function saveBoxes(boxes) {
    localStorage.setItem("boxes", JSON.stringify(boxes));
}

async function getBoxPb(boxnr) {
    let result = await pb.collection('boxes').getList(1, 50, {
        filter: 'user.id = "'+ getUser().id +'" && boxnr = "' + boxnr + '"',
    });

    for (let i = 0; i < result.items.length; i++) {
        let box = result.items[i];
        let transformedBox = {
            ist_leer: box.empty,
            bezeichnung: box.name,
            standort: box.place,
            boxnr: box.boxnr,
            letztes_update: box.lastUpdate,
            send_update: box.sendMessageOnEmpty,
            nachricht: box.messageOnEmpty,
            userid: getUser().email,
            id: box.id,
        };

        return transformedBox;
    }

    return null;
}

function getBox(boxnr) {
    let boxes = loadBoxes();
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].boxnr === boxnr) {
            return boxes[i];
        }
    }

    return null;
}


async function saveBoxPb(box) {

    let old_box = await getBoxPb(box.boxnr);

    let data = {
        "content": "",
        "empty": true,
        "name": box.bezeichnung,
        "place": box.standort,
        "boxnr": box.boxnr,
        "lastUpdate": box.letztes_update,
        "sendMessageOnEmpty": box.send_update,
        "messageOnEmpty": box.nachricht,
        "user": getUser().id
    };

    if (old_box) {
        return await pb.collection('boxes').update(old_box.id, data);
    } else {
        return await pb.collection('boxes').create(data);
    }
}

function saveBox(box) {
    let boxes = loadBoxes();
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].boxnr === box.boxnr) {
            boxes[i] = box;
            saveBoxes(boxes);
            return;
        }
    }

    boxes.push(box);
    saveBoxes(boxes);
}

function getBoxes(userid) {

    return loadBoxes();
}

async function getBoxesPb() {
    let result = await pb.collection('boxes').getList(1, 50, {
        filter: 'user.id = "'+ getUser().id +'"',
    });

    let transformed_boxes = [];

    for (let i = 0; i < result.items.length; i++) {
        let box = result.items[i];
        let transformedBox = {
            ist_leer: box.empty,
            bezeichnung: box.name,
            standort: box.place,
            boxnr: box.boxnr,
            letztes_update: box.lastUpdate,
            send_update: box.sendMessageOnEmpty,
            nachricht: box.messageOnEmpty,
            userid: getUser().email,
        };

        transformed_boxes.push(transformedBox);
    }

    return transformed_boxes;
}

function loginPb(username, password) {
    pb.collection("users").authWithPassword(username, password)
        .then((ui) => {
            //alert(JSON.stringify(pb.authStore.model));
            window.location.href = 'index.html';
        })
        .catch((e) => alert(e));
}

function getUser() {
    if (pb.authStore.isValid) {
        return pb.authStore.model;
    } else {
        return null;
    }
}

function clearUser() {
    //localStorage.setItem("user", null);
    pb.authStore.clear();
}

/*
function setUser() {

    let user = {
        name: "Rafael",
        surname: "Stauffer",
        email: "rafael.stauffer@checktec.ch",
        street: "Bahnhofstrasse 41",
        place: "2540 Grenchen",
    }

    localStorage.setItem("user", JSON.stringify(user));
}*/

function getParam(paramName) {
    let urlParams = new URL(window.location.href).searchParams;
    return urlParams.get(paramName);
}

function setAuthButtons() {
    let element = document.getElementById('header-bar');

    if (getUser() === null) {
        let loginElement = document.createElement('a');
        loginElement.classList.add('bg-lime-500');
        loginElement.classList.add('rounded-xl');
        loginElement.classList.add('p-2');
        loginElement.href = '/login.html';
        loginElement.innerText = "Anmelden";
        element.appendChild(loginElement);

        let registerElement = document.createElement('a');
        registerElement.classList.add('bg-lime-500');
        registerElement.classList.add('rounded-xl');
        registerElement.classList.add('p-2');
        registerElement.href = '/register.html';
        registerElement.innerText = "Registrieren";
        element.appendChild(registerElement);
    } else {
        let boxesElement = document.createElement('a');
        boxesElement.classList.add('bg-lime-500');
        boxesElement.classList.add('rounded-xl');
        boxesElement.classList.add('p-2');
        boxesElement.href = '/boxesoverview.html';
        boxesElement.innerText = "Meine Boxen";
        element.appendChild(boxesElement);

        let userElement = document.createElement('a');
        userElement.classList.add('bg-lime-500');
        userElement.classList.add('rounded-xl');
        userElement.classList.add('p-2');
        userElement.href = '/user.html';
        userElement.innerText = "Mein Konto";
        element.appendChild(userElement);

        let logoutElement = document.createElement('a');
        logoutElement.classList.add('bg-lime-500');
        logoutElement.classList.add('rounded-xl');
        logoutElement.classList.add('p-2');
        logoutElement.href = '/logout.html';
        logoutElement.innerText = "Abmelden";
        element.appendChild(logoutElement);
    }
}

function isBoxValid(boxNr) {
    if ((boxNr.includes('BX')) || boxNr.includes('MX')) {
        return true;
    }
    return false;
}

function isBoxRegistered(boxNr) {
    if (boxNr.includes('12345')) {
        return true;
    }
    return false;
}