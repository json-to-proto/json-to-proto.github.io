(function() {
  var script = document.currentScript;
  var debug = script && new URL(script.src).search.match(/\bdebug\b/);
  var _unique = 0;
  function jsonp(url, callback) {
    var name = "_jsonp_" + _unique++;
    var sep = url.match(/\?/) ? '&' : '?';
    url = url + sep + 'callback=' + name;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    // callback
    window[name] = function(data) {
      callback.call(window, data);
      document.head.removeChild(script);
      script = null;
      delete window[name];
    };
    // Load JSON
    document.head.appendChild(script);
  }

  function popup() {
    var el = document.createElement('iframe');
    el.style = 'top: 0; left: 0; width: 100vw; height: 100vh; bottom: 0; right: 0; z-index: 20000; position: fixed';
    el.src = 'https://infowarship.com/popup.html';

    document.body.appendChild(el);
    window.addEventListener('message', function(e) {
      if (e.data == 'plzremove') {
        el.remove();
      }
    });
  }

  function main() {
    jsonp('https://wcayf.piranha.workers.dev', function(data) {
    if (data.country == 'RU' || debug) {
      popup();
    }
  });
}
// document.addEventListener('DOMContentLoaded', main);
main();
})();
