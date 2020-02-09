import React, { Component } from 'react';


class Notify extends Component {

    ani = () => {
        let element = document.getElementById("notify");
        if(element) {
            setTimeout( () => {
            
                element.classList.add("off");
            }, 5000);
    
            setTimeout( () => {
                element.classList.remove("on");
                element.classList.remove("off");
            }, 5190);
        }
    }
    
    render() {
        if(this.props.class === "on") {
            document.getElementById("notify").classList.add("on");
            document.querySelector("#notify span").innerHTML = this.props.text;
            this.ani();
            this.props.clearMess("");
        }
        return (
            <div id="notify" className={`notify`}>
                <div className="notify--body">
                    <span></span>
                </div>
            </div>
        ) 
    }
}

export default Notify;
