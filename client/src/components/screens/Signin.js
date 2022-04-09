import React, {useState, useContext} from "react";
import {Link, useHistory} from 'react-router-dom';
import M from "materialize-css";
import { userContext } from "../../App";

const Signin = () => {
    const {state, dispatch} = useContext(userContext);
    const history = useHistory();
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const PostData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            return M.toast({html: "Invalid Email!", classes : "#c62828 red darken-3"})
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-type" : "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then((res) => res.json())
        .then( data => {
            if(data.error){
                M.toast({html: data.error, classes : "#c62828 red darken-3"});
            }
            else{
                localStorage.setItem("jwt", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                dispatch({type: "USER", payload: data.user});
                M.toast({html: "Signed in!", classes : "#43a047 green darken-1"});
                history.push("/");
            }
        }).catch(err => {
            console.log(err);
        })
    };


    return(
        <div className="mycard">
            <div class="card auth-card input-field">
                <h2 className="brand-logo">Instagram</h2>
                <input type="email" placeholder="Email"  value = {email} onChange={(e) => setEmail(e.target.value) } />
                <input type="password" placeholder="Password" value = {password} onChange={(e) => setPassword(e.target.value) } />
                <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={() => PostData() }>
                    Login
                </button>
                <h5 className="LoginSignupMessage">
                    <Link to = '/signup'>Don't have an account?</Link>
                </h5>
                <h6 className="LoginSignupMessage" >
                    <Link to="/resetpassword">Forgot Password?</Link>
                </h6>
            </div>
        </div>
    )
};

export default Signin;