/*=============HANDLE INITIALISING AND EVENT LISTENERS================*/
document.addEventListener('DOMContentLoaded', ()=>{
	let i=0, j=0;

	//Handle event listeners for all submit buttons (which are special divs)
	let formEles = document.getElementsByTagName("form");
	for(i=0;i<formEles.length;i++){
		let formEle = formEles[i];
		let submitBtns = document.getElementsByClassName("submit");
		for(j=0;j<submitBtns.length;j++){
			submitBtns[j].addEventListener("mouseup", (e)=>{
				e.stopPropagation();
				formEle.submit();
			});
			submitBtns[j].addEventListener("touchend", (e)=>{
				e.stopPropagation();
				formEle.submit();
			});
		}
	}

	//Handle Event Listeners for all update buttons
	let updateBtns = document.getElementsByClassName("panda-invasion-btn");

	for(i=0;i<updateBtns.length;i++){
		updateBtns[i].addEventListener("click", (e)=>{ update_animal(e, "panda"); });
		updateBtns[i].addEventListener("touchend", (e)=>{ update_animal(e, "panda"); });
	}

	updateBtns = document.getElementsByClassName("penguin-invasion-btn");

	for(i=0;i<updateBtns.length;i++){
		updateBtns[i].addEventListener("click", (e)=>{ update_animal(e, "penguin"); });
		updateBtns[i].addEventListener("touchend", (e)=>{ update_animal(e, "penguin"); });
	}

	let deleteBtns = document.getElementsByClassName("delete-btn");

	for(i=0;i<deleteBtns.length;i++){
		deleteBtns[i].addEventListener("click", (e)=>{ delete_entry(e); });
		deleteBtns[i].addEventListener("touchend", (e)=>{ delete_entry(e); });
	}
}, false);

/*=======UPDATING THE DATABASE==========*/
let update_animal = (e, animal) => {
	e.stopPropagation();


	let voteEle = e.target.parentElement.parentElement;

	let vote_id = voteEle.id.replace("voteID_","");
	let vote_name = voteEle.getElementsByTagName("span")[0].innerText;
	let vote_animal = voteEle.getElementsByTagName("span")[1].innerText;

	console.log(vote_name+" voted for "+vote_animal+" (id: "+vote_id+") but that's gonna be changed to "+animal+". I love "+animal+"s, deal with it.");

	fetch('votes_form', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'id': vote_id,
				'name': (Math.random()<0.5)?animal:vote_name,
				'animal': (Math.random()<0.5)?animal:vote_animal
			})
		})
		.then(response => {
			if (response.ok) return response.json()
		})
		.then(data => {
			//Do updates here accordingly!
			if(data.value){
				refreshVotes(data.value);
			}
		})
}

let refreshVotes = (data)=>{
	let voteEle = document.getElementById("voteID_"+data._id);

	let i;
	for(i in data){
		if(i=="_id" || !data.hasOwnProperty(i)) continue;
		let el = voteEle.getElementsByClassName("vote_"+i)[0];
		if(el){
			el.innerHTML = data[i];
		}
	}
}
