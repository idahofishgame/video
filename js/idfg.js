/*
 * JavaScript for Idaho Fish and Game Main Menu and Accounts Links.
 */
var currentUser = null; // stores the current user information

$(document).ready(function () {
  getUser();
  getMainMenu();
});

// Loads the main menu from IDFG API endpoint
function getMainMenu () {
  $.ajax({
    cache: false
    , crossDomain: true
    , dataType: 'jsonp'
    , jsonpCallback: 'jQuery11120031282627722248435_1439335233466'
    , success: function loadMenuFromJsonSuccessCallback (data, requestStatus) {
        if (requestStatus === 'success') {
          $('#block-idfg-components-menu').replaceWith(data);
          updateCurrentUser();
        }
      }
    , type: 'GET'
    , url: 'https://fishandgame.idaho.gov/ifwis/rest/services/web/site/menu/1.jsonp'
  });
}

// Loads the current user from IDFG API endpoint
function getUser () {
  $('.accounts-login-link a').attr('href', $('#navbar-login a').attr('href') + '?returnurl=' + window.location.href);
  $.getJSON('https://idfg.idaho.gov/accounts/user/state?callback=?', null, function (data) {
    currentUser = data.user;
    updateCurrentUser();
  });
}

// Updates the user display text from 'userInfo' argument
function updateUser (userInfo) {
  if (userInfo) {
    $('.accounts-login-link a .link-text').text(userInfo);
  } else {
    $('.accounts-login-link a .link-text').text("Login");
  }
}

// Convenience function which updates the user display text based on the currentUser variable
function updateCurrentUser () {
  updateUser(currentUser);
}