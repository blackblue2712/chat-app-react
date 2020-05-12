export const getUsers = (uid) => {
    return fetch(`${process.env.REACT_APP_API_URL}/users/list/${uid}`, {
        method: "GET",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Application/json"
        }
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log("ERROR GET USERS");
    })
}

export const adminGetUsers = (uid) => {
    return fetch(`${process.env.REACT_APP_API_URL}/users/admin/list/${uid}`, {
        method: "GET",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Application/json"
        }
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log("ERROR GET USERS");
    })
}

export const getLoggedUser = (id, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/users/profile/${id}`, {
        method: "GET",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log(`ERROR POST LOGGED USER ${err}`);
    });
}

export const getUserById = (id) => {
    return fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        method: "GET",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Application/json",
        }
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log(`ERROR POST LOGGED USER ${err}`);
    });
}


export const postSignup = (userInfo) => {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        method: "POST",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(userInfo)
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log(`POST SIGNUP ERROR`);
    });
}

export const postSignin = (userInfo) => {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/signin`, {
        method: "POST",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(userInfo)
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log("POST SIGNIN ERROR");
    })
}

export const authenticate = (data, callback) => {
    window.localStorage.setItem("jwt", JSON.stringify(data));
    callback();
}

export const isAuthenticated = () => {
    if(window.localStorage.getItem("jwt")) {
        return JSON.parse(window.localStorage.getItem("jwt"));
    }
    return false;
}



export const putUpdateInfo = (userInfo, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/users/info/${userInfo.get("id")}`, {
        method: "PUT",
        headers: {
            Accept: "Application/json",
            Authorization: `Bearer ${token}`
        },
        body: userInfo
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log("PUT UPDATE INFO");
    })
}

export const getSignout = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/auth/signout`, {
        method: "GET",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Application/json"
        }
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log("GET SIGN OUT");
    })
}

export const followUser = (followId) => {
    console.log(followId)
    return fetch(`${process.env.REACT_APP_API_URL}/users/follow/${followId.followedId}`, {
        method: "PUT",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(followId)
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log("PUT UPDATE STORY");
    })
}

export const findUser = (name, uid) => {
    return fetch(`${process.env.REACT_APP_API_URL}/users/find?name=${name}&&uid=${uid}`, {
        method: "GET",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Application/json"
        }
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log("FIND USER");
    })
}
