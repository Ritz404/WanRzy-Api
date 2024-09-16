const axios = require('axios');
const cheerio = require('cheerio');
const ytdl = require('ytdl-core');
const { shorten } = require('./shorten');
const yts = require('yt-search');


function ytmp4(url) {
  return new Promise((resolve, reject) => {
    try {
      const id = ytdl.getVideoID(url);
      const yutub = ytdl.getInfo(`https://www.youtube.com/watch?v=${id}`)
        .then((data) => {
          let pormat = data.formats;
          let video = [];
          for (let i = 0; i < pormat.length; i++) {
            if (pormat[i].container == 'mp4' && pormat[i].hasVideo == true && pormat[i].hasAudio == true) {
              let vid = pormat[i];
              video.push(vid.url);
            }
          }
          const title = data.player_response.microformat.playerMicroformatRenderer.title.simpleText;
          const thumb = data.player_response.microformat.playerMicroformatRenderer.thumbnail.thumbnails[0].url;
          const channel = data.player_response.microformat.playerMicroformatRenderer.ownerChannelName;
          const views = data.player_response.microformat.playerMicroformatRenderer.viewCount;
          const published = data.player_response.microformat.playerMicroformatRenderer.publishDate;
          const duration = data.player_response.lengthSeconds;

const result = {
            title: title,
            duration: duration,
            thumb: thumb,
            channel: channel,
            published: published,
            views: views,
            url: video[0]
          };
    resolve({creator: global.creator, status: true, result})
        })
    } catch (error) {
      resolve({creator: global.creator, status: false, message: error})
    }
  });
}

function ytmp3(url) {
	return new Promise(async(resolve, reject) => {
	
    try {
        const {
            videoDetails
        } = await ytdl.getInfo(url, {
            lang: "id"
        });

        const stream = ytdl(url, {
            filter: "audioonly",
            quality: 140
        });
        const chunks = [];

        stream.on("data", (chunk) => {
            chunks.push(chunk);
        });

        await new Promise((resolve, reject) => {
            stream.on("end", resolve);
            stream.on("error", reject);
        });

        const buffer = Buffer.concat(chunks);

        let data = {
            meta: {
                title: videoDetails.title,
                channel: videoDetails.author.name,
                seconds: videoDetails.lengthSeconds,
                description: videoDetails.description,
                image: videoDetails.thumbnails.slice(-1)[0].url,
            },
            buffer: buffer,
            size: buffer.length,
        };
        resolve({ creator: global.creator, status: true, data })
    } catch (error) {
        resolve({creator: global.creator, status: false})
    }
    })
};

function video(q) {
	return new Promise(async(resolve, reject) => {
	try {
    let search = await yts(q);
    let vid = search.videos[Math.floor(Math.random() * search.videos.length)];
		
    let res = await ytmp4(vid.url)
    let videos = res.result
		let datas = {
        title: videos.title,
        duration: videos.duration,
        thumb: videos.thumb,
        channel: videos.channel,
        published: videos.published,
        views: videos.views,
        url: videos.url
		};
    
    
    resolve({ creator: global.creator, status: true, datas })
	} catch (e) {
		    resolve({ creator: global.creator, status: false, message: e })
		}
	})
}

exports.video = video
exports.ytmp3 = ytmp3
exports.ytmp4 = ytmp4


