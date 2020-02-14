export const getChanels = () => {
    return fetch(`${process.env.REACT_APP_API_URL}/chanels`, {
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
        console.log("ERROR GET CHANELS");
    });
}

export const getSingleChanel = (cid) => {
    return fetch(`${process.env.REACT_APP_API_URL}/chanels/${cid}`, {
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
        console.log("ERROR GET SINGLE CHANELS");
    });
}
export const getChanelMessages = (data, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/chanels/messages/${data.cid}?limit=${data.limit}&skip=${data.skip}`, {
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
        console.log("ERROR GET CHANELS MESSAGES");
    });
}

export const postCreateChanel = (data, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/chanels/create`, {
        method: "POST",
        headers: {
            Accept: "Application/json",
            Authorization: `Bearer ${token}`
        },
        body: data
    })
    .then( res => {
        return res.json();
    })
    .catch( err => {
        console.log("ERROR POST CREATE CHANEL");
    });
}

export const postSaveChanelMessage = (data, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/chanels/new-message`, {
        method: "POST",
        headers: {
            Accept: "Application/json",
            Authorization: `Bearer ${token}`
        },
        body: data
    })
    .then( (res) => {
        return res.json();
    })
    .catch( err => {
        console.log("ERROR POST CHANEL MESSAGE");
    });
}

export const searchYoutube = q => {
    return fetch(`${process.env.REACT_APP_API_URL}/youtube?q=${q}`, {
        method: "GET",
        headers: {
            Accept: "Application/json",
            "Content-Type": "Applcation/json"
        }
    })
    .then( (res) => {
        return res.json();
    })
    .catch( err => {
        console.log("ERROR GET SEARCH YOUTUBE");
    });
}