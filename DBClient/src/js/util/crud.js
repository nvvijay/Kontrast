export default class CRUD {
	static get_list(text) {
		if(!text) {text = ""};
		return fetch("http://localhost:3000/mongo/projects?name="+text);
	}

	static get_id(id) {
		return fetch("http://localhost:3000/mongo/projects/"+id);
	}

	static update_doc(data) {
		var key = data.namespace;
		key.shift(); // remove trailing 0
		if(key.length > 0) {
			key = key.join(".") + "." + data.name;
		}else{
			key = data.name;
		}
		
		var id = data.existing_src[0]._id;
		console.log("to update key:", key, "value", data.new_value);
		return fetch("http://localhost:3000/mongo/projects/"+id, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				key: key,
				value: data.new_value
			})
		});
	}

	static delete_item(data) {
		console.log(data);
		var key = data.namespace;
		key.shift(); // remove trailing 0
		var flag = Number.isInteger(parseInt(key[key.length-1]));
		if(key.length > 0) {
			key = key.join(".") + "." + data.name;
		}else{
			key = data.name;
		}
		var id = data.existing_src[0]._id;
		return fetch("http://localhost:3000/mongo/projects/"+id, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				key: key,
				value: "",
				flag: flag
			})
		});
	}

	static getBusinessInfo(id, type){
		var params = "";
		if(type){
			params = "?type="+type;
		}
		return fetch("http://localhost:3000/mongo/projects/"+id+"/businessInfo"+params);
	}
	static test(arg) {
		console.log(arg)
	};

}
