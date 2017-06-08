const casper = require("casper").create({
  viewportSize: {
    width: 1080,
    height: 724
  },
  clientScripts:  [
		'node_modules/jquery/dist/jquery.min.js'
	]
});
const ua = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
const url = "https://www.youtube.com/watch?v=KsBJ5PqSrMU";
casper.start()
casper.userAgent(ua)

casper.thenOpen(url, function () {
  this.echo("Starting...")
  this.wait(10000, function () {
    this.echo("Waited..")
    this.evaluate(function () {
      $.initialize('yt-live-chat-text-message-renderer', function () {
        casper.echo($this)
      })
    })
    msgNode = document.querySelectorAll('yt-live-chat-text-message-renderer')
    this.echo(msgNode.toString())
    casper.capture("test.png");
  });
  });

casper.run();