
/**
 * Copyright (c) The FreeKCD Project.  See LICENSE.
 */

var oauth = ChromeExOAuth.initBackgroundPage({
    'request_url': 'https://api.twitter.com/oauth/request_token',
    'authorize_url': 'https://api.twitter.com/oauth/authorize',
    'access_url': 'https://api.twitter.com/oauth/access_token',
    'consumer_key': TWITTER_CONSUMER_KEY,
    'consumer_secret': TWITTER_CONSUMER_SECRET,
    'scope': TWITTER_UPDATE_URL,
    'app_name': 'huhgesbot'
});

function notify(iconUrl, title, message) {
    chrome.notifications.create('huhgesbot', {
        type: 'basic',
        iconUrl: iconUrl,
        title: title,
        message: message
    }, function(id) {
        window.setTimeout(function() {
            chrome.notifications.clear(id, function() {});
        }, 3000);
    });
}

oauth.authorize(function() {
    chrome.omnibox.onInputChanged.addListener(function(text) {
        chrome.omnibox.setDefaultSuggestion({
            description: String(140-text.length) + ' characters remaining.'
        });
    });
    chrome.omnibox.onInputEntered.addListener(function(text) {
        var url = 'https://api.twitter.com/1.1/statuses/update.json';
        var request = {'method': 'POST', 'parameters': {'status': text}}
        function callback(response, xhr) {
            var result = JSON.parse(response);
            if (result.errors !== undefined) {
                notify('icon128.png', 'Oops! There was an error.',
                    result.errors[0].message);
            } else {
                notify(result.user.profile_image_url_https, result.user.name,
                    result.text);
            }
        }
        oauth.sendSignedRequest(url, callback, request);
    });
});

            
/*    oauth.authorize(function() {
            var surl = document.URL;
            if (surl.indexOf('https://www.google.co.uk/') > -1 && surl.indexOf('q=') > -1 ) {
            var text = surl.substring(surl.lastIndexOf('q=')+2, surl.length);
            if (surl.indexOf('&') > -1 ) {
                text = text.substring(0, text.indexOf('&'));
            }
            if (text.indexOf(' + ') > -1 ) {
                //do nothing
            } else {
                text = text.split('+').join(' ');
            }
            console.log( text );
            }
            var url = 'https://api.twitter.com/1.1/statuses/update.json';
            var request = {'method': 'POST', 'parameters': {'status': text}}
            function callback(response, xhr) {
                var result = JSON.parse(response);
                if (result.errors !== undefined) {
                    notify('icon128.png', 'Oops! There was an error.',
                        result.errors[0].message);
                } else {
                    notify(result.user.profile_image_url_https, result.user.name,
                        result.text);
                }
            }
            
            oauth.sendSignedRequest(url, callback, request);
        });
        */