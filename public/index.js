//DOM Loaded
document.addEventListener('DOMContentLoaded', ()=>{
	let updateBtns = document.getElementsByClassName("panda-invasion-btn");

	for(var i=0;i<updateBtns.length;i++){
		updateBtns[i].addEventListener("click", update_animal);
	}
}, false);

//Updating the database
let update_animal = (e) => {
	let voteEle = e.target.parentElement;

	let vote_id = voteEle.id.replace("voteID_","");
	let vote_name = voteEle.getElementsByTagName("span")[0].innerText;
	let vote_animal = voteEle.getElementsByTagName("span")[1].innerText;

	console.log(vote_name+" voted for "+vote_animal+" (id: "+vote_id+") but that's gonna be changed to Panda, cos China, and communism. Plus, I love pandas, deal with it.");

	fetch('votes', {
			method: 'put',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				'id': vote_id,
				'name': vote_name,
				'animal': 'Panda'
			})
		})
		.then(response => {
			if (response.ok) return response.json()
		})
		.then(data => {
			console.log(data)
		})
}
