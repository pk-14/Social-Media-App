import React, {useState, useEffect} from "react";
import {useHistory} from 'react-router-dom';
import M from "materialize-css";
import { Chip, TextField,Typography } from '@mui/material';

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");
    useEffect(() => {
        if(url){
            fetch("/createpost", {
                method: "post",
                headers: {
                    "Content-type" : "application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")   
                },
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
            }).then((res) => res.json())
            .then( data => {
                if(data.error){
                    M.toast({html: data.error, classes : "#c62828 red darken-3"})
                }
                else{
                    M.toast({html: "Created Post Successfully!", classes : "#43a047 green darken-1"})
                    history.push("/");
                }
            })
            .catch(err => console.log(err))
        }
    }, [url])

    const postDetails = () => {
        const data = new FormData();
        data.append("file", image);
        data.append("upload_preset", "insta-clone");
        data.append("cloud_name", "dzxv0vqnd"); 

        fetch("https://api.cloudinary.com/v1_1/dzxv0vqnd/image/upload",{
            method : "post",
            body : data
        }).then(res => res.json())
        .then(data => {setUrl(data.url)})
        .catch(err => console.log(err))
    }

    const handleChange = (e)=>{
        console.log(e.target.files[0])
        setImage((e.target.files[0]));
      }
      
    return(
        /* <div className="card input-field"
        style={{margin: "150px auto", maxWidth: "500px", padding: "20px", textAlign: "center"}}
        >
            <input type="text" placeholder="Title" value = {title} onChange={(e) => setTitle(e.target.value) } />
            <input type="text" placeholder="Body" value = {body} onChange={(e) => setBody(e.target.value) }  />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light blue">
                    <span>Upload an Image</span>
                    <input type="file" onChange={(e) => setImage(e.target.files[0]) }/>
                 </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
            <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={() => postDetails()}>
                Submit Post
            </button>
        </div> */
    <div className="card input-field" style={{margin:"20px auto",maxWidth:"500px",padding:"20px",textAlign:"center",alignItems:"flex-start",borderRadius:"10px"}}>
       <TextField
          id="standard-multiline-flexible"
          label="Title"
          multiline
          rows={1}
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          // variant="standard"
          style={{width:"100%",marginBottom:"20px"}}
        />

        <TextField
          id="standard-multiline-flexible"
          label="Description"
          multiline
          rows={4}
          value={body}
          onChange={(e)=>setBody(e.target.value)}
          // variant="standard"
          style={{width:"100%",marginBottom:"20px"}}
        />
      <div style={{marginBottom:"20px"}}>
      <input type="file" id="upload-image" onChange={handleChange}  style={{display:"none"}}/>
      <label htmlFor="upload-image">
        <div style={{display:"flex",justifyContent:"space-evenly"}}>
         <Chip label="Upload image" style={{backgroundColor:"#e09238" , color:"#FFFFFF",cursor:"pointer"}}/>
         {image && <Typography>{image.name}</Typography>}
        </div>
      </label>
      </div>
      <button className="btn waves-effect waves-light #42a5f5 blue lighten-1 " onClick={()=>postDetails()}> Submit post </button>
    </div>
    )
}

export default CreatePost