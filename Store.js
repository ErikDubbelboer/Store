/*
---
description: Local storage with support for multiple browsers. Dropin replacement for Mootools Cookie: http://mootools.net/docs/core/Utilities/Cookie

license: MIT-style

authors:
- Erik Dubbelboer

requires:

provides: [Store]

*/

'use strict'; //!dev


var Store = (function() {
  // Firefox 3.5, Safari 4, IE8, Chrome 4+ and higher
  function isLocalStorageSupported() {
    try {
      return (('localStorage' in window) && window['localStorage']);
    }
    catch (err) {
      return false;
    }
  }
  
  // Firefox 2.x and 3.0
  function isGlobalStorageSupported() {
    try {
      return (('globalStorage' in window) && window['globalStorage'] && window['globalStorage'][window.location.hostname]);
    }
    catch (err) {
      return false;
    }
  }
  
  

  var api = {
    write:   function(name, value) {
    },
    read:    function(name) {
      return null;
    },
    dispose: function(name) {
    }
  };


  if (isLocalStorageSupported()) {
    var storage = window['localStorage'];

    api = {
      write: function(name, value) {
        storage.setItem(name, JSON.encode(value));
      },
      read: function(name) {
        return JSON.decode(storage.getItem(name));
      },
      dispose: function(name) {
        storage.removeItem(name);
      }
    };
  } else if (isGlobalStorageSupported()) {
    var storage = window['globalStorage'][window.location.hostname];

    api = {
      write: function(name, value) {
        storage[name] = JSON.encode(value);
      },
      read: function(name) {
        if (storage[name]) {
          return JSON.decode(storage[name].value);
        } else {
          return null;
        }
      },
      dispose: function(name) {
        delete storage[name];
      }
    };
  } else if (document.documentElement.addBehavior) { // IE6, IE7
    var storage = function() {
      var s = document.createElement('div');

      s.style.display = 'none';
      s.addBehavior('#default#userdata');

      document.body.appendChild(s);

      storage = function() {
        return s;
      };

      return s;
    };

    api = {
      write: function(name, value) {
        storage().setAttribute(name, JSON.encode(value));
        storage().save('localStorage');
      },
      read: function(name) {
        storage().load('localStorage');

        return JSON.decode(storage().getAttribute(name));
      },
      dispose: function(name) {
        storage().load('localStorage');
        storage().removeAttribute(name);
        storage().save('localStorage');
      }
    };
  }
  
  return api;
})();

