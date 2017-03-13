import Twit from '../node_modules/twit/lib/twitter'
import queryString from 'query-string'
import url from 'url'
import * as keys from './keys'
import ChromeExOAuth from './chrome_ex_oauth'

const oauth = ChromeExOAuth.initBackgroundPage({
  'request_url': keys.TWITTER_REQUEST_URL,
  'authorize_url': keys.TWITTER_AUTHORIZE_URL,
  'access_url': keys.TWITTER_ACCESS_URL,
  'consumer_key': keys.TWITTER_CONSUMER_KEY,
  'consumer_secret': keys.TWITTER_CONSUMER_SECRET,
  'scope': keys.TWITTER_SCOPE_URL,
  'app_name': keys.TWITTER_APP_NAME
})

oauth.authorize(() => console.log('app authorized'))

const client = new Twit({
  consumer_key: keys.TWITTER_CONSUMER_KEY,
  consumer_secret: keys.TWITTER_CONSUMER_SECRET,
  access_token: keys.TWITTER_ACCESS_TOKEN,
  access_token_secret: keys.TWITTER_ACCESS_TOKEN_SECRET
})

chrome.webNavigation.onBeforeNavigate.addListener(details => {
  const urlObj = url.parse(details.url)
  const query = queryString.parse(urlObj.query)
  const hash = queryString.parse(urlObj.hash)
  let searchQuery
  if ( urlObj.hostname === 'www.google.co.uk' || urlObj.hostname === 'www.google.com') {
    searchQuery = query.q || hash.q
    // stop searches from being tweeted if preceded by `|` (allows for private searching)
    if (searchQuery[0] === '|') {
      searchQuery = null
    }
  }
  if (searchQuery) {
    client.post('statuses/update', { status: searchQuery },  function(error, tweet, response) {
      if(error) throw error
      console.log('made tweet: ', tweet, response)
    })
  }
})
