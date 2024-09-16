const axios = require('axios');

process.env.SPOTIFY_CLIENT_ID = '4c4fc8c3496243cbba99b39826e2841f';
process.env.SPOTIFY_CLIENT_SECRET = 'd598f89aba0946e2b85fb8aefa9ae4c8';

async function convert(ms) {
  var minutes = Math.floor(ms / 60000);
  var seconds = ((ms % 60000) / 1000).toFixed(0);
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

async function spotifyCreds() {
  return new Promise(async (resolve) => {
    try {
      const json = await (
        await axios.post(
          'https://accounts.spotify.com/api/token',
          'grant_type=client_credentials',
          {
            headers: {
              Authorization:
                'Basic ' +
                Buffer.from(
                  process.env.SPOTIFY_CLIENT_ID +
                    ':' +
                    process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64'),
            },
          }
        )
      ).data;
      if (!json.access_token)
        return resolve({
          creator: global.creator,
          status: false,
          msg: 'Tidak dapat menghasilkan token!',
        });
      resolve({
        creator: global.creator,
        status: true,
        data: json,
      });
    } catch (e) {
      resolve({
        creator: 'Budy x creator',
        status: false,
        msg: e.message,
      });
    }
  });
}

async function getInfo(url) {
  return new Promise(async (resolve) => {
    try {
      const creds = await spotifyCreds();
      if (!creds.status) return resolve(creds);
      const json = await (
        await axios.get('https://api.spotify.com/v1/tracks/' + url.split('track/')[1], {
          headers: {
            Authorization: 'Bearer ' + creds.data.access_token,
          },
        })
      ).data;
      resolve({
        creator: global.creator,
        status: true,
        data: {
          thumbnail: json.album.images[0].url,
          title: json.artists[0].name + ' - ' + json.name,
          artist: json.artists[0],
          duration: convert(json.duration_ms),
          preview: json.preview_url,
        },
      });
    } catch (e) {
      resolve({
        creator: global.creator,
        status: false,
        msg: e.message,
      });
    }
  });
}

async function searching(query, type = 'track', limit = 20) {
  return new Promise(async (resolve) => {
    try {
      const creds = await spotifyCreds();
      if (!creds.status) return resolve(creds);
      const json = await (
        await axios.get(
          'https://api.spotify.com/v1/search?query=' +
            query +
            '&type=' +
            type +
            '&offset=0&limit=' +
            limit,
          {
            headers: {
              Authorization: 'Bearer ' + creds.data.access_token,
            },
          }
        )
      ).data;
      if (!json.tracks.items || json.tracks.items.length < 1)
        return resolve({
          creator: global.creator,
          status: false,
          msg: 'Musik tidak ditemukan!',
        });
      let data = [];
      json.tracks.items.map((v) =>
        data.push({
          title: v.album.artists[0].name + ' - ' + v.name,
          duration: convert(v.duration_ms),
          popularity: v.popularity + '%',
          preview: v.preview_url,
          url: v.external_urls.spotify,
        })
      );
      resolve({
        creator: global.creator,
        status: true,
        data,
      });
    } catch (e) {
      resolve({
        creator: global.creator,
        status: false,
        msg: e.message,
      });
    }
  });
}

async function spotifydl(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const yanzz = await axios.get(
        `https://api.fabdl.com/spotify/get?url=${encodeURIComponent(url)}`,
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'sec-ch-ua': 'Not)A;Brand;v=24, Chromium;v=116',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': 'Android',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            Referer: 'https://spotifydownload.org/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        }
      );
      const yanz = await axios.get(
        `https://api.fabdl.com/spotify/mp3-convert-task/${yanzz.data.result.gid}/${yanzz.data.result.id}`,
        {
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'sec-ch-ua': 'Not)A;Brand;v=24, Chromium;v=116',
            'sec-ch-ua-mobile': '?1',
            'sec-ch-ua-platform': 'Android',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            Referer: 'https://spotifydownload.org/',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
          },
        }
      );
      const result = {};
      result.title = yanzz.data.result.name;
      result.type = yanzz.data.result.type;
      result.artis = yanzz.data.result.artists;
      result.durasi = yanzz.data.result.duration_ms;
      result.image = yanzz.data.result.image;
      result.download = 'https://api.fabdl.com' + yanz.data.result.download_url;
      resolve({creator: global.creator, status: true, result});
    } catch (error) {
      reject(error);
    }
  });
}

async function tiktokS(query) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        method: 'POST',
        url: 'https://tikwm.com/api/feed/search',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Cookie': 'current_language=en',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
        },
        data: {
          keywords: query,
          count: 10,
          cursor: 0,
          HD: 1
        }
      });
      const videos = response.data.data.videos;
      if (videos.length === 0) {
        reject("Tidak ada video ditemukan.");
      } else {
        const gywee = Math.floor(Math.random() * videos.length);
        const videorndm = videos[gywee]; 

        const result = {
          title: videorndm.title,
          cover: videorndm.cover,
          origin_cover: videorndm.origin_cover,
          no_watermark: videorndm.play,
          watermark: videorndm.wmplay,
          music: videorndm.music
        };
          resolve({creator: global.creator, status: true, result});
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function tiktok(url) {
  return new Promise(async (resolve, reject) => {
  try {
    const ngaji = await axios.get('https://api.tiklydown.eu.org/api/download?url=' +
        encodeURIComponent(url)
    )
    let result = ngaji.data
    resolve({creator: global.creator, status: true, mssg: 'link cuma Support Tiktok ori bukan lite', result});
      
  } catch (e) {
    resolve(e)
  }
  })
}

exports.tiktok = tiktok
exports.tiktokS = tiktokS
exports.searching = searching 
exports.getInfo = getInfo
exports.spotifydl = spotifydl