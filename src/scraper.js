var colorizer = require('colorizer').create('Colorizer');
var fs = require('fs')

var casper = require("casper").create({
  viewportSize: {
    width: 1024,
    height: 768
  }
});

url = 'https://www.youtube.com/live_chat?v=0UJfwiqnfsc&is_popout=1'
ua = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'

casper.start()
casper.userAgent(ua);
casper.thenOpen(url, function () {
  this.echo("Starting...", 'INFO')
  this.echo("Waiting 10s", 'INFO')
  this.wait(10000, function () {
    casper.capture('screen-capture.png')
    this.echo('...waited', 'COMMENT')
    this.echo('Captured Screen.', 'COMMENT')
  })
})

var currentMessage = '';

(function getPosts() {
  var post = null;

  casper.wait(1000, function () {
    post = this.evaluate(function () {
      var nodes = document.querySelectorAll('yt-live-chat-text-message-renderer'),
          author = nodes[nodes.length - 1].querySelector('#author-name').textContent,
          message = nodes[nodes.length - 1].querySelector('#message').textContent;
      // ytd-menu-navigation-item-renderer
      return {
        author: author,
        message: message
      };
    });
  });

  casper.then(function () {
    this.echo('Running', 'INFO')
    if (post === null) {
      this.echo("Error with message", 'WARNING')
      return
    } else if (currentMessage !== post.message) {
      currentMessage = post.message;
      this.echo(colorizer.colorize(post.author, 'WARNING') + ' | ' + colorizer.colorize(post.message, 'COMMENT'))
      formattedMsg = (post.author + ' - ' + post.message + ',\n')
      fs.write('log.txt', formattedMsg, 'a')
    } 
  });

  casper.then(function () {
    getPosts();
  });
})();

casper.run();