let axios = require('axios')

function shorten(url) {
  return new Promise(async(resolve, reject) => {
    let isurl = /https?:\/\//.test(url)
        let link = isurl ? axios.get('https://tinyurl.com/api-create.php?url='+encodeURIComponent(url)) : ''
    if (typeof link == 'undefined' || link == '') return resolve({ creator: global.creator, status: false })
    resolve({ creator: global.creator, status: true, data: { url: link }})
  })
}

module.exports = { shorten }
