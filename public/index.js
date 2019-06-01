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
	let updateBtns = document.getElementsByClassName("change-name-btn");

	for(i=0;i<updateBtns.length;i++){
		updateBtns[i].addEventListener("click", (e)=>{ updateField(e, "animal", "panda"); });
		updateBtns[i].addEventListener("touchend", (e)=>{ updateField(e, "animal", "panda"); });
	}

	updateBtns = document.getElementsByClassName("change-animal-btn");

	for(i=0;i<updateBtns.length;i++){
		updateBtns[i].addEventListener("click", (e)=>{ updateField(e, "animal", "penguin"); });
		updateBtns[i].addEventListener("touchend", (e)=>{ updateField(e, "animal", "penguin"); });
	}

	let deleteBtns = document.getElementsByClassName("delete-btn");

	for(i=0;i<deleteBtns.length;i++){
		deleteBtns[i].addEventListener("click", (e)=>{ deleteEntry(e); });
		deleteBtns[i].addEventListener("touchend", (e)=>{ deleteEntry(e); });
	}
}, false);

/*=======UPDATING THE DATABASE==========*/
let updateField = (e, field, value) => {
	let i,j;

	e.stopPropagation();

	let voteEle = e.target.parentElement.parentElement;

	let voteInfo = {};

	voteInfo._id = voteEle.id.replace("voteID_","");

	//Populate `voteInfo` variable with existing fields
	let infoEle = voteEle.getElementsByTagName("span");
	let infoType;
	for(i=0;i<infoEle.length;i++){
		infoType = infoEle[i].className.replace("vote_","");
		voteInfo[infoType] = infoEle[i].innerText;
	}

	if(voteInfo.hasOwnProperty(field) && voteInfo[field]===true){
		voteInfo[field] = value;
	}
	else{
		return;
	}

	fetch('votes_form', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(voteInfo)
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

let deleteEntry = (e) => {
	e.stopPropagation();

	let r = confirm("Are you sure you want to delete? This process cannot be undone!");
	if(!r) return;

	let voteEle = e.target.parentElement.parentElement;

	let vote_id = voteEle.id.replace("voteID_","");
	let vote_name = voteEle.getElementsByTagName("span")[0].innerText;
	let vote_animal = voteEle.getElementsByTagName("span")[1].innerText;

	//console.log("Deleting vote with id "+vote_id);

	fetch('votes_form', {
			method: 'delete',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'id': vote_id,
				'name': vote_name,
				'animal': vote_animal
			})
		})
		.then(response => {
			if (response.ok) return response.json()
		})
		.then(data => {
			//Do updates here accordingly!
			if(data._id){
				refreshVotes(data);
			}
		})
}

let refreshVotes = (data)=>{
	let voteEle = document.getElementById("voteID_"+data._id);

	if(data.subject == "delete"){
		voteEle.parentNode.removeChild(voteEle);
		return;
	}

	let i;
	for(i in data){
		if(i=="_id" || !data.hasOwnProperty(i)) continue;
		let el = voteEle.getElementsByClassName("vote_"+i)[0];
		if(el){
			el.innerHTML = data[i];
		}
	}
}
