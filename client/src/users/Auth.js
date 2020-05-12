import React from 'react';
import { postSignup, postSignin, authenticate, isAuthenticated } from '../controllers/UserController';
import './auth.css';


class Auth extends React.Component {
    constructor() {
        super();
        this.state = {
            
        }
    }

    handleChangeUI = (next) => {
        return () => {
            console.log(next);
            let eres = document.querySelector("#form-reg");
            let esig = document.querySelector("#form-sig");
            let efor = document.querySelector("#form-for");
            if(next === "reg") {
                eres.classList.remove("d-none");
                esig.classList.add("d-none");
                efor.classList.add("d-none");
            } else if(next === "sig") {
                esig.classList.remove("d-none");
                eres.classList.add("d-none");
                efor.classList.add("d-none");
            } else {
                efor.classList.remove("d-none");
                esig.classList.add("d-none");
                eres.classList.add("d-none");
            }
        }
    }

    componentWillReceiveProps() {

    }

    componentDidMount() {
        if(isAuthenticated()) {
            this.props.history.push("/");
        }
        const inputRequireDom = Array.from(document.getElementsByTagName("input"));
        inputRequireDom.slice(0, inputRequireDom.length - 1).map( ip => {
            return ip.required = true;
        })
    }

    handleSubmit = () => {
        window.event.preventDefault();
        let email = document.getElementById("l-email").value;
        let password = document.getElementById("l-password").value;
        postSignin( {email, password} )
        .then( res => {
            if(!res.payload) {
                alert(res.message)
            } else {
                authenticate(res.payload, () => {
                    this.props.history.push("/");
                })
            }
        })
    }

    handleRegister = () => {
        window.event.preventDefault();
        let patt = /\d+/;

        let email = document.getElementById("r-email").value;
        let password = document.getElementById("r-password").value;
        let passwordAg = document.getElementById("r-password-again").value;

        if (password.match(patt) === null || password.length < 6) {
            alert("password have at least 6 characters and must contain 1 number");
        } else if(password !== passwordAg) {
            alert("password and password again do not match!")
        } else {
            postSignup( {email, password} )
            .then( res => {
                if(res && !res.payload) {
                    alert(res.message)
                } else {
                    //
                    this.handleChangeUI()("sig");
                }
            })
        }
    }

    // handleSubmitForgot = async () => {
    //     window.event.preventDefault();
    //     let email = document.getElementById("f-email").value;
    //     let btnLoading = document.getElementById("wrap-forgot-btn");
    //     btnLoading.classList.add("btn-loading");
    //     let res = await forgotPassword(email);

    //     if(res.message) {
    //         alert(res.message);
    //     }

    //     btnLoading.classList.remove("btn-loading");
    // }



    render() {
        return ( <div id="wrap-auth">
                <div className="box on" id="form-sig">
                    <h2>Login</h2>
                    <form action="/auth" method="POST">
                        <div className="inputBox">
                            <input
                                type="text" name="email" required="" id="l-email"
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="inputBox">
                            <input
                                type="password" name="password" required="" id="l-password"
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="d-flex align-items-center">
                            <input
                                type="submit" name="" value="Submit"
                                onClick={this.handleSubmit}
                            />
                            <a
                                className="s-btn s-btn__outline s-btn__hovero bd-none ml-auto"
                                style={{
                                    position: "relative",
                                    zIndex: "9999",
                                    color: "black"
                                }}
                                onClick={this.handleChangeUI("reg")}
                                href="#c"
                            >Register a new account</a>
                        </div>
                        <div id="forgot-password" className="mt24">
                            <a
                                className="s-btn s-btn__outline s-btn__hovero bd-none ml-auto"
                                style={{
                                    position: "relative",
                                    zIndex: "9999",
                                    color: "black",
                                    paddingLeft: 0
                                }}
                                onClick={this.handleChangeUI("for")}
                                href="#c"
                            >Forgot password?</a>
                        </div>
                    </form>
                </div>


                <div className="box d-none on" id="form-for">
                    <h2>Fortgot password</h2>
                    <form >
                        <div className="inputBox">
                            <input
                                type="text" name="forgotEmail" required=""  id="f-email"
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="d-flex align-items-center">
                            <div id="wrap-forgot-btn" className="ps-relative">
                                <input
                                    type="submit" name="" value="Submit"
                                    onClick={this.handleSubmitForgot}
                                />
                            </div>
                            <a
                                className="s-btn s-btn__outline s-btn__hovero bd-none ml-auto"
                                style={{
                                    position: "relative",
                                    zIndex: "9999",
                                    color: "black"
                                }}
                                onClick={this.handleChangeUI("sig")}
                                href="#c"
                            >Login</a>
                        </div>
                    </form>
                </div>


                <div className="box d-none on" id="form-reg">
                    <h2>Register</h2>
                    <form action="/auth" method="POST">
                        <div className="inputBox">
                            <input
                                type="email" name="email" required="" autoComplete={"off"} id="r-email"
                            />
                            <label htmlFor="email">Email</label>
                        </div>
                        <div className="inputBox">
                            <input
                                type="password" name="password" required="" id="r-password"
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        <div className="inputBox">
                            <input
                                type="password" name="password-again" required="" id="r-password-again"
                            />
                            <label htmlFor="password-again">Password again</label>
                        </div>
                        <div className="d-flex align-items-center">
                            <input
                                type="submit" name="" value="Submit"
                                onClick={this.handleRegister}
                            />
                            <a
                                className="s-btn s-btn__outline s-btn__hovero bd-none ml-auto"
                                style={{
                                    position: "relative",
                                    zIndex: "9999",
                                    color: "black"
                                }}
                                onClick={this.handleChangeUI("sig")}
                                href="#c"
                            >Login</a>
                        </div>
                    </form>
                </div>

            </div>
        )
        
    }
}


export default Auth;