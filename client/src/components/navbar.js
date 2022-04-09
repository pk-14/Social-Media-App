import React, {useContext,useRef,useEffect,useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {userContext} from '../App';
import M from 'materialize-css';


const NavBar = () => {
  const searchModal = useRef(null);
  const [searchUser,setSearchUser] = useState('');
  let [searchResult,setSearchResult] = useState([]);
  const {state, dispatch} = useContext(userContext);
  const history = useHistory();
  useEffect(()=>{
    M.Modal.init(searchModal.current)
  },[]);
  const renderList = () => {
    if(state){
      return([
        <div>
          <li><i data-target="modal1" className="large material-icons modal-trigger" style={{color:"black",cursor: "pointer"}}>search</i></li>
          <li><Link to="/profile">Profile</Link></li>,
          <li><Link to="/create">Create a Post</Link></li>,
          <li><Link to="/myfollowingpost">My Following Posts</Link></li>,
          <li>
            <button className="btn waves-effect waves-light #c62828 red darken-3" type="submit" name="action" onClick={() => {
              localStorage.clear()
              dispatch({type: "CLEAR"})
              history.push("/signin")
            }}>
                    Logout
            </button>
          </li>
        </div>
      ])
    }else{
      return([
        <li><Link to="/signin" >Login</Link></li>,
        <li><Link to="/signup">Signup</Link></li>
    ])
    }
  }

  const fetchUsers = (query)=>{
    setSearchUser(query)
    fetch('/searchusers',{
      method:"post",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          query
        })
    }).then(res=>res.json())
    .then(result=>{
      setSearchResult(result.user)
    }).catch(err=>{
      console.log(err)
    })
  }

    return(
        <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : '/signin'} className="brand-logo left">Instagram</Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
          <div id="modal1" className="modal"  ref={searchModal} >
          <div className="modal-content" style={{color:"black"}}>
            <input type="text" placeholder="Search Users" value={searchUser} onChange={(e)=>fetchUsers((e.target.value))} ></input>
            <div>
              <ul className="collection">
                {searchResult.map(item=>{
                  return <a href={(item._id === state._id ? '/profile' : ('/profile/'+item._id))} className="collection-item" onClick={()=>{
                    setSearchUser('')
                    setSearchResult([])
                    M.Modal.getInstance(searchModal.current).close()
                  }
                  }>{item.name}</a>
                })}
              </ul>
            </div>
          </div>
          <div class="modal-footer">
          <button class="modal-close waves-effect waves-green btn-flat" onClick={()=>{setSearchUser(''); setSearchResult([])}}>Close</button>
          </div>
          </div>
        </div>
      </nav>
    )
}

export default NavBar;