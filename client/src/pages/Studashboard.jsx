

import React, { useState,useEffect } from 'react';

import axios from 'axios';

import Navbar from '../component/Navbar';


import Container from '../component/Container';
import Footer from '../component/Footer';
import ArticleCard from '../component/ArticleCard';


import chem from '../images/chem.jpg';
import math from '../images/math.jpg';
import biology from '../images/biolog.jpg';




export default function Studashboard({isLoggedIn, setIsLoggedIn , username,jwttoken,userId}) {
  
	const [list, setList ] = useState([]);
	const [isloading,setIsloading ] = useState(true)
	const [ editmode, setEditMode ] = useState(false)
//	const [disp_addlist, setDisplay_addlist ] = useState(false)
	let display_addlist = []
	let newlist = []
	let added_subject_codes = []
	let suggested_subject_codes = []
	//var editmode = false
	//var isloading = true 
    
	console.log( "Username is here " , username )
	console.log( "Userid from User Model is here " , userId )
	console.log( "JWTToken is here " , jwttoken )
	// console.log( "checkstring is here " , props.checkstring )
	
	// we have to axios.post here to get the information with the userId to get the appropriate information and display first 
	const Edit = () => {
		if (editmode === true){
		    setEditMode(false)
		}else{
			setEditMode(true)
		}
	}
	 
	const getslist = () => {
		axios.post(`/studentphase/returnsubjectsdetailsfor-userId`, {userId})
		.then(function (response) {
			
			console.log(response.data)
			// this is is the set of appended data from the list 
			setList(response.data.list)
			suggested_subject_codes = response.data.suggested_subject_codes
			added_subject_codes = response.data.added_subjects_code
			newlist = response.data.list
			display_addlist = response.data.display_addlist
            console.log("this is my display_addlist" , display_addlist)
			setIsloading(false)
			// trial values for above 

			// test values
			// suggested_subject_codes = [1,2]
			// added_subject_codes = [34,75]
			// newlist = [
			// 			{title:"Computer Science",subject_code:1,students_count:1000,teachers_count:20},
			// 			{title:"Physics",subject_code:2,students_count:850,teachers_count:8}
			// ]

			// display_addlist = [
			// 			{title:"kiswahili",subject_code:34,students_count:340,teachers_count:4},
			// 			{title:"Swahili",subject_code:75,students_count:500,teachers_count:4}
			// ]



			console.log(newlist)
			
		}).catch(function (error) {
			console.log(error);
		})
	}

	function Addfunc(index){
		if (newlist !== undefined ) {
			newlist[index].students_count = newlist[index].students_count++
			display_addlist.push(newlist[index])
			added_subject_codes.push(newlist[index].subject_code)
			//this will pop out what i dont want 
			suggested_subject_codes = suggested_subject_codes.filter(item => item !== newlist[index].subject_code)
			
			newlist = newlist.filter(item => item !== newlist[index])
		}	
	}

	function Rmvefunc(index){

		if (newlist !== undefined && display_addlist !== undefined ) {
			added_subject_codes = added_subject_codes.filter(item => item !== display_addlist[index].subject_code)
			suggested_subject_codes.push(display_addlist[index].subject_code)
			newlist.push(display_addlist[index]);

			for (let y in newlist ){
				if (newlist[y] === display_addlist[index]){
					newlist[y].students_count = newlist[y].students_count--
				};

			};
			display_addlist = display_addlist.filter(item => item !== display_addlist[index])
		}
	}

	const Submit = () => {
		
		axios.post(`/studentphase/updatesubjectsdetailsfor-userId`, { 
			userId ,
			suggested_subject_codes: suggested_subject_codes,			
			added_subjects_code: added_subject_codes,
			list: newlist,
			display_addlist: display_addlist
		 });

		getslist();
		Edit()
	}

	const postData = () => {
	
		let finalsub = { list  }
		axios.post(`/api/postfromstudashboard`, { finalsub })
    .then(res => {
      console.log(res);
      console.log(res.data);
    })

	}


	useEffect(() => {
		setTimeout(function () {
			getslist()
		}, 2000)
	}, []);


  return (
	<>
		<Navbar isLoggedIn ={isLoggedIn} setIsLoggedIn = {setIsLoggedIn} />
		<Container>

	
				<div className="container mx-auto my-5">
					<h1 className="  ml-5 ">  Students Portal</h1>
					
				</div>

			{  isloading === false ? 

			    

				  
				<>
				<div className="container h-100 w-100" style={{ maxWidth: "800px", margin: "auto" }} > 
		 
					<div className="card-deck">
						
						{/* can we use this to map accross an array */}
						
						
						{
							list.map( (course, index) => {
								return ( 

									<CardDisplay 
										key={course.subject_code}
										id={course.subject_code}
										index={index}
										rating = "4.5"
										people={course.students_count}  
										subject={course.title} 
										Addfunc = {Addfunc}
										editmode = {editmode}
									/> 
								)
							})
						}

					</div>
					
						 
					<div className="card-deck">
						
						{/* can we use this to map accross an array */}
						
						
						{
						  display_addlist.map( (course, index) => {
								return ( 

									<CardAddedDisplay 
										key={course.subject_code}
										id={course.subject_code}
										index={index}
										rating = "4.5"
										people={course.students_count}  
										subject={course.title}
										Rmvefunc={Rmvefunc}
										editmode={editmode}
									/> 
								)
							})
						}

					</div>


					
				</div>

					
		{ !editmode ?
			   <button onClick = {Edit}>Edit Courses</button>
			   :
			   <button onClick={ Submit} >Submit Course</button>
		}
         

		 </>
	   
	   :

		<h1>Please Wait your Courses are loading... </h1>

	}
		</Container>
		<Footer />
	</>
  )
}


//index being passed to them with on Add and on remove 

function CardDisplay ({ id, index, people, subject, rating ,Addfunc,editmode }) {
	// add function is needed here
	function OnAdd(index) {
	//	pick add functin defined in main function and pass it here 
		Addfunc(index)
	}


	

	return (
		<div className="card">

			<img className="card-img-top" src={chem} alt="Card  cap"/>
			<div className="card-body">
				<h5 className="card-title"> { subject } </h5>
				<h3 className="card-title">{ rating }~<small className="text-muted">ratings</small></h3>

				
				<p className="card-text">
					<small className="text-muted">{ people }k people  registered for this course</small>
				</p>

				

			</div>
			{ editmode ?	
			 <button onClick={OnAdd(index)}> Add Course</button>
			 :null 
			 }	
		</div>  
	)
}



function CardAddedDisplay({ id, index, people, subject, rating , Rmvefunc,editmode}) {

	function OnRmve(index) {
		//	pick add functin defined in main function and pass it here 
		Rmvefunc(index)
	}

	return (
		<div className="card">

			<img className="card-img-top" src={chem} alt="Card  cap" />
			<div className="card-body">
				<h5 className="card-title"> {subject} </h5>
				<h3 className="card-title">{rating}~<small className="text-muted">ratings</small></h3>


				<p className="card-text">
					<small className="text-muted">{people}k people  registered for this course</small>
				</p>



			</div>
			{ editmode ?
			<button onClick={OnRmve(index)}> Add Course</button>
			:null	
             }
		</div>
	)
}







