var BACKSPACE_KEYCODE = 8;
var RETURN_KEYCODE = 13;
var SHIFT_KEYCODE = 16;

function WebZui(logfunc) {
  this._size = [80, 25];
  this._console = null;
  this._activeWindow = 0;
  this._inputString = "";
  this._currentCallback = null;
  this._foreground = "default";
  this._background = "default";
  this._reverseVideo = false;
  this._lastSeenY = 0;
  this._currStyles = ["z-roman"];
  this._expectedHash = window.location.hash;

  if (logfunc) {
    this._log = logfunc;
  } else {
    this._log = function() {};
  }

  var self = this;

  var methods = {
    onConsoleRender: function() {
      var height = $("#top-window").get(0).clientHeight;
      $("#content").get(0).style.padding = "" + height + "px 0 0 0";
      self._scrollBottomWindow();
    },

    _scrollBottomWindow: function() {
      window.scroll(0, self._lastSeenY);
    },

    _finalize: function() {
      if (self._console) {
        self._console.close();
        self._console = null;
      }
      $("#content").empty();
      self._unbindEventHandlers();
    },

    _bindEventHandlers: function() {
      $(document).keypress(self._windowKeypress)
                 .keyup(self._windowKeyup)
                 .keydown(self._windowKeydown)
                 .mousewheel(self._windowMousewheel);
      $(window).resize(self._windowResize);
      self._intervalId = window.setInterval(self._windowHashCheck, 1000);
    },

    _unbindEventHandlers: function() {
      $(document).unbind("keypress", self._windowKeypress)
                 .unbind("keyup", self._windowKeyup)
                 .unbind("keydown", self._windowKeydown)
                 .unbind("mousewheel", self._windowMousewheel);
      $(window).unbind("resize", self._windowResize);
      window.clearInterval(self._intervalId);
    },

    _windowMousewheel: function(event, delta) {
      window.scrollBy(0, -delta * 5);
    },

    // We want to make sure that all key events don't bubble up, so
    // that anything listening in--such as Firefox's "Search for text
    // when I start typing" feature--doesn't think that we're not
    // doing anything with the keypresses.  If we don't do this, such
    // listeners may think that they can intervene and capture
    // keystrokes before they get to us in the future.

    _isHotKey: function(event) {
      return (event.altKey || event.ctrlKey || event.metaKey);
    },

    _windowKeyup: function(event) {
      return self._isHotKey(event);
    },

    _windowKeydown: function(event) {
      if (self._isHotKey(event))
        return true;
      if (!jQuery.browser.mozilla) {
        var newEvent = new Object();
        if (event.keyCode > 20 && event.keyCode < 127) {
          newEvent.charCode = String.fromCharCode(event.keyCode)
                                    .toLowerCase()
                                    .charCodeAt(0);
        } else {
          newEvent.charCode = 0;
          newEvent.keyCode = event.keyCode;
        }
        return self._handleKeyEvent(newEvent);
      } else
        return false;
    },

    _windowKeypress: function(event) {
      if (self._isHotKey(event))
        return true;
      if (jQuery.browser.mozilla)
        return self._handleKeyEvent(event);
      else
        return false;
    },

    _handleKeyEvent: function(event) {
      self._removeBufferedWindows();
      self._lastSeenY = $("#bottom").get(0).offsetTop;
      self._scrollBottomWindow();

      if ($("#current-input").length == 0) {
        // We're not waiting for a line of input, but we may
        // be waiting for a character of input.

        // Note that we have to return a ZSCII keycode here.
        //
        // For more information, see:
        //
        //   http://www.gnelson.demon.co.uk/zspec/sect03.html
        if (self._currentCallback) {
          var keyCode = 0;
          if (event.charCode) {
            keyCode = event.charCode;
          } else {
            // TODO: Deal w/ arrow keys, etc.
            switch (event.keyCode) {
            case RETURN_KEYCODE:
              keyCode = event.keyCode;
              break;
            }
          }
          if (keyCode != 0) {
            var callback = self._currentCallback;

            self._currentCallback = null;
            callback(keyCode);
          }
        }
        return false;
      }

      var oldInputString = self._inputString;

      if (event.charCode) {
        var newChar = String.fromCharCode(event.charCode);
        var lastChar = self._inputString.slice(-1);
        if (!(newChar == " " && lastChar == " ")) {
          self._inputString += newChar;
        }
      } else {
        switch (event.keyCode) {
        case BACKSPACE_KEYCODE:
          if (self._inputString) {
            self._inputString = self._inputString.slice(0, -1);
          }
          break;
        case RETURN_KEYCODE:
          var finalInputString = self._inputString;
          var callback = self._currentCallback;

          self._inputString = "";
          self._currentCallback = null;
          finalInputString = finalInputString.entityify();
          self._lastSeenY = $("#current-input").get(0).offsetTop;
          var styles = $("#current-input").attr("class");
          $("#current-input").replaceWith(
            ('<span class="finished-input ' + styles + '">' +
             finalInputString + '</span><br/>')
          );
          callback(finalInputString);
        }
      }
      if ($("#current-input") &&
          oldInputString != self._inputString) {
        $("#current-input").html(
          self._inputString.entityify() +
            '<span id="cursor">_</span>'
        );
      }
      return false;
    },

    _windowResize: function() {
      var contentLeft = $("#content").get(0).offsetLeft + "px";
      $(".buffered-window").css({left: contentLeft});
    },

    _windowHashCheck: function() {
      if (window.location.hash != self._expectedHash)
        self._restart();
    },

    _removeBufferedWindows: function() {
      var windows = $("#buffered-windows > .buffered-window");
      windows.fadeOut("slow", function() { windows.remove(); });
      // A more conservative alternative to the above is:
      // $("#buffered-windows").empty();
    },

    _eraseBottomWindow: function() {
      $("#content").empty();
      this._lastSeenY = 0;
    },

    _restart: function() {
      self._finalize();
      window.setTimeout(_webZuiStartup, 0);
    },

    setVersion: function(version) {
      self._version = version;
    },

    getSize: function() {
      return self._size;
    },

    onLineInput: function(callback) {
      self._currentCallback = callback;
      $("#content").append(
        '<span id="current-input"><span id="cursor">_</span></span>'
      );
      $("#current-input").attr("class", self._calcFinalStyles());
    },

    onCharacterInput: function(callback) {
      self._currentCallback = callback;
    },

    onSave: function(data) {
      // TODO: Attempt to use other forms of local storage
      // (e.g. Google Gears, HTML 5 database storage, etc) if
      // available; if none are available, we should return false.

      var saveKey = gStory + '_saveData';
      var b64data = encode_base64(data);

      if (window.globalStorage)
        window.globalStorage[location.hostname][saveKey] = b64data;
      window.location.hash = "#" + b64data;
      self._expectedHash = window.location.hash;
      return true;
    },

    onRestore: function() {
      // TODO: Attempt to use other forms of local storage if
      // available; if none are available, we should return null.

      var b64data = null;

      if (window.location.hash)
        b64data = window.location.hash.slice(1);

      if (!b64data && window.globalStorage) {
        var saveData = globalStorage[location.hostname][gStory + '_saveData'];
        if (saveData)
          b64data = saveData.value;
      }

      if (b64data) {
        window.location.hash = "#" + b64data;
        self._expectedHash = window.location.hash;
        return decode_base64(b64data);
      } else
        return null;
    },

    onQuit: function() {
      self._finalize();
    },

    onRestart: function() {
      self._finalize();

      // TODO: It's not high-priority, but according to the Z-Machine
      // spec documentation for the restart opcode, we need to
      // preserve the "transcribing to printer" bit and the "use
      // fixed-pitch font" bit when restarting.

      window.location.hash = "";
      self._restart();
    },

    onWimpOut: function(callback) {
      window.setTimeout(callback, 50);
    },

    onSetStyle: function(textStyle, foreground, background) {
      switch (textStyle) {
      case -1:
        // Don't set the style.
        break;
      case 0:
        this._currStyles = ["z-roman"];
        this._reverseVideo = false;
        break;
      case 1:
        this._reverseVideo = true;
        break;
      case 2:
        this._currStyles.push("z-bold");
        break;
      case 4:
        this._currStyles.push("z-italic");
        break;
      case 8:
        this._currStyles.push("z-fixed-pitch");
        break;
      default:
        throw new FatalError("Unknown style: " + textStyle);
      }

      var colorTable = {0: null,
                        1: "default",
                        2: "black",
                        3: "red",
                        4: "green",
                        5: "yellow",
                        6: "blue",
                        7: "magenta",
                        8: "cyan",
                        9: "white"};

      if (colorTable[foreground])
        this._foreground = colorTable[foreground];
      if (colorTable[background])
        this._background = colorTable[background];
    },

    onSetWindow: function(window) {
      // From the Z-Spec, section 8.7.2.
      if (window == 1)
        self._console.moveTo(0, 0);

      self._activeWindow = window;
    },

    onEraseWindow: function(window) {
      // Set the background color.
      document.body.className = "bg-" + self._background;

      if (window == -2) {
        self._console.clear();
        self._eraseBottomWindow();
      } else if (window == -1) {
        // From the Z-Spec, section 8.7.3.3.
        self.onSplitWindow(0);

        // TODO: Depending on the Z-Machine version, we want
        // to move the cursor to the bottom-left or top-left.
        self._eraseBottomWindow();
      } else if (window == 0) {
        self._eraseBottomWindow();
      } else if (window == 1) {
        self._console.clear();
      }
    },

    onSetCursor: function(x, y) {
      self._console.moveTo(x - 1, y - 1);
    },

    onSetBufferMode: function(flag) {
      // TODO: How to emulate non-word wrapping in HTML?
    },

    onSplitWindow: function(numlines) {
      if (numlines == 0) {
        if (self._console) {
          self._console.close();
          self._console = null;
        }
      } else {
        if (!self._console || self._version == 3) {
          self._console = new Console(self._size[0],
                                      numlines,
                                      $("#top-window").get(0),
                                      self);
        } else if (self._console.height != numlines) {
          // Z-Machine games are peculiar in regards to the way they
          // sometimes overlay quotations on top of the current text;
          // we basically want to preserve any text that is already in
          // the top window "below" the layer of the top window, so
          // that anything it doesn't write over remains visible, at
          // least (and this is an arbitrary decision on our part)
          // until the user has entered some input.

          var newDiv = document.createElement("div");
          newDiv.className = "buffered-window";
          newDiv.innerHTML = self._console.renderHtml();
          newDiv.style.width = self._pixelWidth + "px";
          newDiv.style.lineHeight = self._pixelLineHeight + "px";
          $("#buffered-windows").append(newDiv);

          // Pretend the window was just resized, which will position
          // the new buffered window properly on the x-axis.
          self._windowResize();

          self._console.resize(numlines);
        }
      }
    },

    _calcFinalStyles: function() {
      var fg = self._foreground;
      var bg = self._background;

      if (self._reverseVideo) {
        fg = self._background;
        bg = self._foreground;
        if (fg == "default")
          fg = "default-reversed";
        if (bg == "default")
          bg = "default-reversed";
      }

      var colors = ["fg-" + fg, "bg-" + bg];
      return colors.concat(self._currStyles).join(" ");
    },

    onPrint: function(output) {
      var styles = self._calcFinalStyles();

      self._log("print wind: " + self._activeWindow + " output: " +
                output.quote() + " style: " + styles);

      if (self._activeWindow == 0) {
        var lines = output.split("\n");
        for (var i = 0; i < lines.length; i++) {
          var addNewline = false;

          if (lines[i]) {
            var chunk = lines[i].entityify();
            chunk = '<span class="' + styles + '">' + chunk + '</span>';
            $("#content").append(chunk);
            if (i < lines.length - 1)
              addNewline = true;
          } else
            addNewline = true;

          if (addNewline)
            $("#content").append("<br/>");
        }

        self._scrollBottomWindow();
      } else {
        self._console.write(output, styles);
      }
    },

    _setFixedPitchSizes: function() {
      var row = document.createElement("div");
      row.className = "buffered-window";
      for (var i = 0; i < self._size[0]; i++)
        row.innerHTML += "O";

      // We have to wrap the text in a span to get an accurate line
      // height value, for some reason...
      row.innerHTML = "<span>" + row.innerHTML + "</span>";

      $("#buffered-windows").append(row);
      self._pixelWidth = row.clientWidth;
      self._pixelLineHeight = row.firstChild.offsetHeight;
      $("#buffered-windows").empty();
    }
  };

  for (name in methods)
    self[name] = methods[name];

  self._setFixedPitchSizes();

  $("#top-window").get(0).style.width = self._pixelWidth + "px";
  $("#top-window").get(0).style.lineHeight = self._pixelLineHeight + "px";
  $("#content").get(0).style.width = self._pixelWidth + "px";

  self._windowResize();
  self._bindEventHandlers();
  self._eraseBottomWindow();
}

FatalError.prototype.onError = function(e) {
  var message = e.message;
  if (typeof e.message == "string")
    message = message.entityify();
  $("#content").append('<div class="error">An error occurred:<br/>' +
                       '<pre>' + message + '\n\n' + e.traceback +
                       '</pre></div>');
}

function _webZuiStartup() {
  var logfunc = function() {};

  if (window.console)
    logfunc = function(msg) { console.log(msg); };

  var engine = new GnustoEngine();
  var zui = new WebZui(logfunc);
  var runner = new EngineRunner(engine, zui, logfunc);
  var beret = new Beret(engine);

  beret.load(gZcode.slice());
  logfunc("Story type: " + beret.m_filetype);
  if (window.location.hash) {
    var b64data = window.location.hash.slice(1);
    beret.load(decode_base64(b64data));
    logfunc("Load game story type: " + beret.m_filetype);
  }

  runner.run();
}

function processBase64Zcode(content) {
    gZcode = decode_base64(content);
    _webZuiStartup();
}

var gThisUrl = location.protocol + "//" + location.host + location.pathname;
var gBaseUrl = gThisUrl.slice(0, gThisUrl.lastIndexOf("/"));
var gStory = "";
var gZcode = null;
var IF_ARCHIVE_PREFIX = "if-archive/";

$(document).ready(function() {
  var qs = new Querystring();
  var story = qs.get("story", "stories/troll.z5.js");

  gStory = story;
  jQuery.getScript(story);
});