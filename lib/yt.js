let yts = require('yt-search'), { decode } = require('html-entities'), { servers, yta, ytv } = require('./y2mate'), { shorten } = require('./shorten')

function crop(url) {
	return new Promise(async(resolve, reject) => {
		let sh = await shorten(url)
		if (!sh.status) return resolve(url)
		resolve(sh.data.url)
	})
}

function ytr(url) {
	return new Promise((resolve, reject) => {
		const regex = /(?:http(?:s|):\/\/|)(?:(?:www\.|)youtube(?:\-nocookie|)\.com\/(?:watch\?.*(?:|\&)v=|embed\/|v\/)|youtu\.be\/)([-_0-9A-Za-z]{11})/
		if(!regex.test(url)) return resolve({ status: false })
		let v = regex.exec(url)
		let z = v[1]
        resolve({ status: true, data: z })
    })
}



function search(q) {
	return new Promise(async(resolve, reject) => {
		let yt = await yts(q)
		let videos = yt.videos.slice(0, 10)
		resolve({ creator: global.creator, status: true, data: videos })
	})
}

exports.search = search