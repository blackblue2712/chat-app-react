import React from 'react';
import { postCreateChanel } from '../controllers/ChanelController';
import { isAuthenticated } from '../controllers/UserController';
import Notify from '../component/Notify';

class CreateChanel extends React.Component {
    constructor() {
        super();
        this.state = {
            message: ""
        }

        this.formData = new FormData();
    }

    postCreateChanel = () => {
        try {
            let chanelName = document.getElementById("chanel-name").value;
            let chanelDescription = document.getElementById("chanel-description").value;
            let token = isAuthenticated().token;

            this.formData.append("chanelName", chanelName);
            this.formData.append("chanelDescription", chanelDescription);

            postCreateChanel(this.formData, token)
            .then( res => {
                console.log(res)
                this.setState( {message: res.message} );
            })
            .catch( err => {
                console.log(err);
            })
        } catch (e) { console.log(e) }
    }

    previewPhoto = (event) => {
        let reader = new FileReader();
        console.log("preview")
        let inputAvatar = document.getElementById('chanel-photo-background');
        reader.onload = function () {
            inputAvatar.src = reader.result;
        }
        try {
            reader.readAsDataURL(event.target.files[0]);
            this.formData.append("photoBackground", event.target.files[0]);
        } catch(e) {
            // do nothing
        }
    }

    

    closeModalCreateChanel = () => {
        try {
            let modal = document.querySelector(".layout-modal");
            modal.classList.remove("active");
        } catch(e) { console.log(e) }
    }
    
    clearMess = () => {
        this.setState( {message: ""} )
    }

    render() {
        let { message } = this.state;
        return (
            <div className="layout-modal">
                <Notify />
                {message !== "" &&  <Notify class="on" text={message} clearMess={this.clearMess} />}
                <div className="modal modal-add-chanel">
                    <div className="modal-header">
                        <h5>CREATE YOUR CHANEL</h5>
                        <p>By creating a chanel, people can access to free voice and text chat for exchange information about styudy or what ever.</p>
                    </div>
                    <div className="modal-body">
                        <div className="madal-body-main">
                            <div className="container-input">
                                <div className="post-title">
                                    <label htmlFor="chanel-name">CHANEL NAME</label>
                                    <input type="text" className="s-input w-100" id="chanel-name" autoFocus required />
                                </div>
                                <div className="post-title">
                                    <label htmlFor="chanel-name">CHANEL DESCRIPTION</label>
                                    <input type="text" className="s-input w-100" id="chanel-description"></input>
                                </div>
                            </div>
                            <div className="container-photo">
                                <label htmlFor="photoBackground" onClick={() => document.getElementById("photoBackground").click()}>
                                    <input onChange={this.previewPhoto} className="d-none" type="file" name="photoBackground" id="photoBackground" />
                                    <button className="s-btn btn-change-avatar ps-relative">
                                        <img className="chanel-photo-background" id="chanel-photo-background" src="https://res.cloudinary.com/dged6fqkf/image/upload/v1581173169/jbwkupd6wxap1udmgfmz.png" alt="chanle-background" />

                                    </button>
                                </label>
                            </div>
                        </div>
                        <div className="help-text">
                            By creating a chanel, you agree to Liars's
                                            <strong>Community Guidelines</strong>
                        </div>
                    </div>
                    <div className="modal-bottom">
                        <button onClick={this.closeModalCreateChanel} className="close-modal">Close</button>
                        <button onClick={this.postCreateChanel} className="accept-modal loading">Create</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default CreateChanel;