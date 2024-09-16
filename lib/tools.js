const axios = require('axios'), cheerio = require('cheerio')

function tiktokStalk(username) {
    return new Promise(async (resolve, reject) => {
      await axios
        .request({
          baseURL: 'https://tiktokstalk.com',
          url: "/user/" + username,
          method: "GET"
      })
      .then(( response ) => {
        const $ = cheerio.load(response.data)
        const result = {
          status: 200,
          profile: $("div.row > div.col-lg-7.separate-column > div.user-info > figure > img").attr("src"),
          username: $("div.row > div.col-lg-7.separate-column > div.user-info > div.article > div.top > div.title > h1").text().trim(),
          name: $("div.row > div.col-lg-7.separate-column > div.user-info > div.article > div.top > div.title > h2").text().trim(),
          desc: $("div.row > div.col-lg-7.separate-column > div.user-info > div.article > div.description > p").text().trim(),
          likes: $("div.col-lg-5.separate-column > div.row > div.col > div.number-box > .count").eq(0).text().trim(),
          followers: $("div.col-lg-5.separate-column > div.row > div.col > div.number-box > .count").eq(1).text().trim(),
          following: $("div.col-lg-5.separate-column > div.row > div.col > div.number-box > .count").eq(2).text().trim(),
        }
        resolve({creator: global.creator, status: true, result})
      })
      .catch((e) => {
        console.log(e)
        reject({
          status: 300,
          message: "request failed",
        });
      })
    })
}

exports.tiktokStalk = tiktokStalk