import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from '../pages/Homepage';
import Readmore from '../pages/Readmore';
import Login from '../pages/Loginpage';
import Newpost from '../pages/Newpost';
import StudentDashboard from '../pages/Studashboard';
import TeachDashboard from '../pages/Teachdashboard';
import SignUp from '../pages/SignUp';


export default function RouterComponent() {
   
   const [isLoggedIn , setIsLoggedIn ] = useState(false)
	const [ username , setUsername ] = useState("")
	const [ userId , setUserId ] = useState("")	
	const [ jwttoken , setJwtToken ] = useState("")
	const [checkstring , setCheckstring ]  = useState("here is chicken")


  return(
    <Router>
      <Switch>
      
       <Route exact path="/student-dashboard" > 
         <StudentDashboard 
         isLoggedIn ={isLoggedIn} 
         setIsLoggedIn = {setIsLoggedIn} 
         username ={username} 
         jwttoken = {jwttoken}
         userId = {userId}
          />       
          </Route>	
            	
      	<Route exact path="/signup-user" >
      	  <SignUp
		      isLoggedIn ={isLoggedIn} 
		      setIsLoggedIn = {setIsLoggedIn}      		
      	      />
      	    </Route>
      	<Route exact path="/teach-dashboard" component={TeachDashboard} />
        
       <Route exact path="/newpost" >       
        <Newpost 
		   isLoggedIn ={isLoggedIn} 
		   setIsLoggedIn = {setIsLoggedIn}          
         setUsername = {setUsername}  username = {username} 
         setJwtToken = {setJwtToken}   jwttoken = {jwttoken}
         setUserId = {setUserId}  userId = {userId} 
         />       
          </Route>         

       <Route exact path="/readmore" >       
        <Readmore 
		   isLoggedIn ={isLoggedIn} 
		   setIsLoggedIn = {setIsLoggedIn}          
         setUsername = {setUsername}  username = {username} 
         setJwtToken = {setJwtToken}   jwttoken = {jwttoken}
         setUserId = {setUserId}  userId = {userId} 
         />       
          </Route>
              
       <Route exact path="/login-user" >       
        <Login 
		   isLoggedIn ={isLoggedIn} 
		   setIsLoggedIn = {setIsLoggedIn}          
         setUsername = {setUsername}  username = {username} 
         setJwtToken = {setJwtToken}   jwttoken = {jwttoken}
         setUserId = {setUserId}  userId = {userId} 
         />       
          </Route>
          
       <Route exact path="/" >       
        <Home 
		   isLoggedIn ={isLoggedIn} 
		   setIsLoggedIn = {setIsLoggedIn}          
         setUsername = {setUsername}  username = {username} 
         setJwtToken = {setJwtToken}   jwttoken = {jwttoken}
         setUserId = {setUserId}  userId = {userId} 
         />       
          </Route>          
        
      </Switch>
    </Router>

  );
}
