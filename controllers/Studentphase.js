







const bcrypt = require('bcrypt')
const StudentphaseRouter = require('express').Router()
const User = require('../models/user')
const UserSelect = require('../models/user_selections')
const Subjects = require('../models/subjects')
const jwt = require('jsonwebtoken')
const fs = require('fs')




StudentphaseRouter.get('/', (req, res) => res.send ('hello Authentication project home'))



StudentphaseRouter.get('/readme' , (req, res) => { 
	res.json({"message":"Welcome to the user section "})

})



// get user profile details 
// NB: the information you get depends on the model you get from
// you must also use the right key,value   
// to search  in the model to make sure 


// 

StudentphaseRouter.post('/getuserstuff' , async (req, res) => {   
        
	const body = req.body	
	var username_new = body["username"]

	console.log()
	
	// first trial started from here 
	const filter = { username: username_new };
   

	let user_details = await User.findOne(filter);
	
	console.log(user_details); // 'Jean-Luc Picard'
	console.log(user_details.username);
	console.log(user_details.age); // 59
		
	res.json({"message":"Here are your details" , "userdetails" : user_details })

	
})

// 

StudentphaseRouter.post('/returnsubjectsdetailsfor-userId' , async (req, res) => {   
        
	const body = req.body	
	var userId = body["userId"]

	console.log()
	try {	
		// first get user id to get the subject codes 
		let filter = { userId : userId };
	

		let userSelect_details = await UserSelect.findOne(filter);
		
		console.log(userSelect_details); // 'Jean-Luc Picard'
		
		console.log("suggested_subject_codes" , 
		userSelect_details.suggested_subject_codes);
		console.log("added_subject_codes" ,
		userSelect_details.added_subjects_code);
		
		let suggested_subject_codes = userSelect_details.suggested_subject_codes;
		let added_subjects_code = userSelect_details.added_subjects_code ;
		
		// gotten subject codes in the array 
		// now loop in the array to fetch from the subject model the subject details
		// this list presents to the database to be displayed
		
		let list =[]
		let display_addlist = []
		for ( let x in  suggested_subject_codes) {
			// first find details in subject 
			
			console.log(suggested_subject_codes[x])
			let filter = { subject_code : suggested_subject_codes[x] };
			// find first for appending 
			let found_subjectdetails = await Subjects.findOne(filter);
			console.log(found_subjectdetails)
			list.push(found_subjectdetails)
			}
		
		//remove null from list
		function removeNull(array) {
				return array.filter(x => x !== null)
			};
		list = removeNull(list)
	// send the list of the added for display as well 
		for (let x in added_subjects_code ) {
			// first find details in subject 

			
			let filter = { subject_code: added_subjects_code[x] };
			// find first for appending 
			let found_addsubjects = await Subjects.findOne(filter);
			console.log(found_addsubjects)
			display_addlist.push(found_addsubjects)

			
		}
        display_addlist = removeNull(display_addlist)

		
		console.log("this is list of details of a subject for a particular student" 
		, list )
			
		res.json({"message":"All Subjects and their  details for  a particular userId" ,
					suggested_subject_codes: suggested_subject_codes,
					list  : list ,
					added_subjects_code: added_subjects_code ,
					display_addlist: display_addlist
					
					})
	}catch(exception) {
								
						msg = exception
						console.log(msg)
						
						res.json({"message":msg
											
								  }) 
	}
		
})


// update students courses for a particular user id 

StudentphaseRouter.post('/updatesubjectsdetailsfor-userId', async (req, res) => {
	// update profile details 
	const body = req.body
	var userId = body["userId"]
	var suggested_subject_codes = body["suggested_subject_codes"]
	var suggested_list = body["list"]
	var added_subject_code = body["added_subject_codes"]
	var display_addlist = body["display_addlist"]


	try{	// first get user id to get the subject codes 
		let filter = { userId: userId };



		// first update User_select Model before we go to the Subject Model 

		const update_userselect = { suggested_subject_codes , added_subject_code };


		let user_select = await UserSelect.findOneAndUpdate(filter, update_userselect, { new: true });

		// for loop to update Subject details 
		// since the details the suggested list is different from 
		// that of the added list 

		var Subject_suggupdate = ""
		for (let x in suggested_list) {
			
			let temp_suggestlist = suggested_list[x]
			let filter = { subject_code: temp_suggestlist.subject_codes };
			let update_subject = { temp_suggestlist }
			Subject_suggupdate = await Subjects.findOneAndUpdate(filter, update_subject, { new: true })
			
		}

		var Subject_addupdate = ""
		for (let  y in display_addlist) {
			let temp_addlist = display_addlist[x]
			let filter = { subject_code: temp_addlist.subject_codes };
			let update_subject = { temp_addlist }
			Subject_addupdate = await Subjects.findOneAndUpdate(filter, update_subject, { new: true })
		}



		res.json({
			"message": "All Subjects and their  details for  a particular userId",
			Subject_addupdate : Subject_addupdate,
			Subject_suggupdate : Subject_suggupdate
		})
	}catch(exception) {
								
						msg = exception
						console.log(msg)
						
						res.json({"message":msg
											
								  })
	}							  
})

// how will the front end process it what will 
// it send back as update on the subjects in general 

StudentphaseRouter.post('/update' , async (req, res) => {    
   // update profile details 
   
	const body = req.body
	username_new = body["username"]
	age_new  = body["age"]
	console.log(age_new)
	
	// position of key for filter 
	const filter = { username: username_new };
	
   // where and what to filter 
   const update = { age: age_new };
	
	
	let my_update = await User.findOneAndUpdate(filter, update, {new: true});
	
	my_update.name; // 'Jean-Luc Picard'
	my_update.age; // 59
	
	
	res.json({"message":"Age is updated" , "age" : my_update })
	
})


  


// authentication is done 
StudentphaseRouter.get('/secret', isAuthorized,  (req,res) => {


		// rest of commands or functions come here 
		
		res.json({"message": "Super Secret Message "});
})




StudentphaseRouter.get('/jwt' , (req,res) => {
	let privateKey = fs.readFileSync('./private.pem' , 'utf-8')
	let token = jwt.sign({"body" : "stuff"}, privateKey, {algorithm:'HS256'})
	res.send(token);

})


//Authorization function going to be used in authentication path 

function isAuthorized(req, res, next) {
    if (typeof req.headers.authorization !== "undefined") {
        // retrieve the authorization header and parse out the
        // JWT using the split function
        let token = req.headers.authorization.split(" ")[1];
        
        let privateKey = fs.readFileSync('./private.pem', 'utf8');
        // Here we validate that the JSON Web Token is valid and has been 
        // created using the same private pass phrase
        jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
            
            // if there has been an error...
            if (err) {  
                // shut them out!
                res.status(500).json({ error: "Not Authorized" });
            }
            // if the JWT is valid, allow them to hit
            // the intended endpoint
            return next();
        });
    } else {
        // No authorization header exists on the incoming
        // request, return not authorized
        res.status(500).json({ error: "Not Authorized" });
    }
}





module.exports = StudentphaseRouter
