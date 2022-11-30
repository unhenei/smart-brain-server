const handleImage = (db) => (req, res) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries)
	})
	.catch(err => res.status(400).json('unable to get entries'))
}

const handleApiCall = (req, res) => {
    const requestOptions = {
    	method: 'POST',
	    headers: {
	        "Accept": "application/json",
	        // 'Key ' + PAT
	        "Authorization": "Key 39d74df2b88749ac87f80a2c39754dc3"
	    },
	    body: JSON.stringify({
	      "user_app_id": {
	          "user_id": "pol7sw0nfrd9",
	          "app_id": "smartbrain"
	      },
	      "inputs": [
	          {
	              "data": {
	                  "image": {
	                      "url": req.body.inputUrl
	                  }
	              }
	          }
	      ]
	    })
	}
	res.json(requestOptions)
}

module.exports={
	handleImage,
	handleApiCall
}