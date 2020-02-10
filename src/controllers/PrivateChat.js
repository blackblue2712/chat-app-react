export const getMessageIndividualUser = (senderId, receiverId, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/pm/messages?senderId=${senderId}&receiverId=${receiverId}`, {
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
        console.log("ERROR GET PM");
    });
}

export const postSavePrivateMessage = (data, token) => {
    return fetch(`${process.env.REACT_APP_API_URL}/pm/new-message`, {
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
        console.log("ERROR POST PRIVATE MESSAGE");
    });
}