const requestOptions = (inputUrl) => {
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
                          "url": inputUrl
                      }
                  }
              }
          ]
        })
    }

    module.exports = {
      requestOptions: requestOptions
    }