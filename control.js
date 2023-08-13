function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function clearUser() {
    localStorage.setItem("user", null);
}

function setUser() {

    let user = {
        name: "Rafael",
        surname: "Stauffer",
        email: "rafael.stauffer@checktec.ch",
        street: "Bahnhofstrasse 41",
        place: "2540 Grenchen",
    }

    localStorage.setItem("user", JSON.stringify(user));
}

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