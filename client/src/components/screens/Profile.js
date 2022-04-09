import React,{useEffect, useState, useContext} from "react";
import {userContext} from '../../App';
import M from 'materialize-css';

const Profile = () => {
    const [mypics, setPics] = useState([]);
    const {state, dispatch} = useContext(userContext);
    const [image,setImage] = useState("");
    const [password,setPassword] = useState("");
    const [loading ,setLoading] = useState(false);

    useEffect(()=>{
        M.AutoInit();
    },[]);

    useEffect(() => {
        if(image){
        setLoading(true);
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "dzxv0vqnd"); 

        fetch("https://api.cloudinary.com/v1_1/dzxv0vqnd/image/upload",{
            method : "post",
            body : data
        }).then(res => res.json())
        .then(data => {
            
            fetch('/updatepic', {
                method: "put",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    pic : data.url
                })
            }).then(res => res.json())
            .then(result => {
                localStorage.setItem("user", JSON.stringify({...state, pic : result.pic}))
                dispatch({type: "UPDATEPIC", payload: result.pic});
                const modal3 = document.getElementById("modal3");
                var instance = M.Modal.getInstance(modal3);
                setLoading(false);
                instance.close();
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
        }
    }, [image])

    const updatePhoto = (file) => {
        setImage(file)
        
    }

    useEffect(() => {
        fetch("/myposts", {
            headers: {
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            setPics(result.mypost)
        })
    }, [])

    const updatePassword = (password)=>{
        fetch('/changepassword',{
            method:'put',
            headers:{
              "Content-Type":"application/json",
              "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                _id:state._id,
                password
            })
          }).then(res=>res.json())
          .then(data=>{
              if(data.error){
              M.toast({html: data.error, classes:"#c62828 red darken-3"})
              }
              else{
                M.toast({html:data.message,classes:"#2e7d32 green darken-3"})
              }
          }).catch(err=>{
            console.log(err)
          })
    }

    return(
        <div style={{maxWidth: "550px", margin: "0px auto"}}>
            <div style={{margin: "18px 0px", borderBottom: "1px solid grey"}}> 
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <div>
                        <img style={{width:"160px", height:"160px", borderRadius : "80px"}}
                            src={state ? state.pic : "Loading..."}
                        />
                    </div>
                    <div>
                        <h4>{state ? state.name : "loading"}</h4>
                        <h5>{state ? state.email : "loading"}</h5>
                        <div style={{display: "flex", justifyContent: "space-between", width:"115%"}}>
                            <h6>{mypics.length} Posts</h6>
                            <h6>{state ? state.followers.length : '0'} Followers</h6>
                            <h6>{state ? state.following.length : '0'} Following</h6>
                        </div>
                    </div>
                    <div>
                        <a class='dropdown-trigger btn-floating btn-large waves-effect waves-light blue'  data-target='dropdown1'><i class="material-icons">dehaze</i></a>
                        <ul id='dropdown1' class='dropdown-content'>
                        <li>  <a data-target="modal2" class=" modal-trigger">Change Password</a></li>
                        <li class="divider" tabindex="-1"></li>
                        <li><a data-target="modal3" class=" modal-trigger">Update Profile Pic</a></li>
                        </ul>
                    </div>
                </div>    
            </div>

            <div className="gallery">
                {
                    mypics.map(item => {
                        return(
                            <img className="item" src={item.photo} alt={item.title} key={item._id}/>
                        )
                    })
                }
            </div>
            <div id="modal2" className="modal">
                <div className="modal-content" style={{ color: "black" }}>
                <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword((e.target.value))}></input>
                    <button class="modal-close" onClick={()=>updatePassword(password)}>Submit</button>
                </div>
                <div class="modal-footer">
                    <button class="modal-close waves-effect waves-green btn-flat" onClick={() => {setPassword('')}}>Close</button>
                </div>
            </div>
            <div id="modal3" className="modal">
                <div className="modal-content" style={{ color: "black" }}>
                    <input type="file" onChange={(e)=>updatePhoto((e.target.files[0]))} />
                </div>
                <div>
                    {loading && <h4 style={{fontSize:"16px" , color:"green",textAlign:"center"}}>Uploading ...</h4>}
                </div>
                <div class="modal-footer">
                    <button class="modal-close waves-effect waves-green btn-flat" onClick={() => {setImage('')}}>Close</button>
                </div>
            </div>
        </div>
    )
};

export default Profile;