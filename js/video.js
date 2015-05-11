/**
 * Loads all the videos for a given playlist.
 */
function getPlaylistVideosById(playlistId) {
	var check = true;
	var videoId;
	var url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + playlistId + "&key=AIzaSyCeIgHG1yOHGO1Im8oyWqbpwZMqM0dm_OU&callback=?";
  $.getJSON(url, function (response) {
    if (response) {
		  $("#playlist-content").html("<h3>" + $('#' + playlistId).html() + " Playlist</h3>");
      $("#playlist-title").html($('#' + playlistId).html() + " Playlist");
      $.each(response.items, function (i, item) {
        $("#playlist-content").append("<div id=\"" + item.snippet.resourceId.videoId + "\" class=\"media\"><div class=\"media-left\"><a class=\"videolink videothumb\" href=\"#video-" + item.snippet.resourceId.videoId + "\" title=\"Watch Video\"><img class=\"media-object\" alt=\"Watch Video\" src=\"images/video-play.png\" style=\"background-image:url(" + item.snippet.thumbnails.default.url + ");\" width=\"120\" height=\"90\" /></a></div><div class=\"media-body\"><h4 class=\"media-heading\"><a class=\"video-title\" href=\"#video-" + item.snippet.resourceId.videoId + "\" title=\"Watch Video\">" + item.snippet.title + "</a></h4><div class=\"video-description\">" + item.snippet.description + "</div></div></div>");
        if (i == 0) {
	  	    if (location.href.indexOf("#video-") != -1) {
      		  videoId = location.href.substring(location.href.indexOf("#video-")+7);
				  } else {
					  videoId = item.snippet.resourceId.videoId;
					  check = false;
				  }
        }
      });
		  // Render or check video.
		  if (check) {
	      checkVideo(videoId);
	    } else {
	      renderVideo(videoId, true);
	    }
    }
  });
}

/**
 * Loads list of all video channels to nav.
 */
function populateTabsFromJSON(defaultPlaylist) {
  var url = "https://www.googleapis.com/youtube/v3/playlists?part=snippet&maxResults=50&channelId=UCUdrx_nZUNlfrGVsc2cj9Gg&key=AIzaSyCeIgHG1yOHGO1Im8oyWqbpwZMqM0dm_OU&callback=?";
  $.getJSON(url, function (response) {
    if (response) {
		  var playlists = [];
      var weight = "";
      var attributes = "";
      $.each(response.items, function (i, item) {
				// Set default playlist to active.
				if (item.id == defaultPlaylist) {
				  attributes = " class=\"active\"";
			  } else {
				  attributes = "";
				}
				// Primitive sorting.  Featured, Regions then Alpha.
				weight = item.snippet.title;
				if (weight == "Featured") {
				  weight = "aaaFeatured";
				}
				if (weight.indexOf("Region") > -1) {
				  weight = "aa" + weight;
				}
				// Build playlist array with weighted titles.
				playlists.push({"display":"<li" + attributes + "><a id=\"" + item.id + "\" href=\"#" + item.id + "\">" + item.snippet.title + "</a></li>", "weight":weight});
      });
			// Now sort by Weight.
			var byWeight = playlists.slice(0);
      byWeight.sort(function(a,b) {
        var x = a.weight.toLowerCase();
        var y = b.weight.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
      });
      // Render videos.
			for (i=0;i<byWeight.length;i++) {
			  $("#video-tabs .nav").append(byWeight[i]['display']);
			}
      getPlaylistVideosById(defaultPlaylist);
    }
  });
}

function checkVideo(videoId) {
  var url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&key=AIzaSyCeIgHG1yOHGO1Im8oyWqbpwZMqM0dm_OU&callback=?";
	$.getJSON(url, function (response) {
	  if (response) {
	    if (response.items[0].snippet.channelTitle == "idahofishgame") {
		    renderVideo(videoId, true);
		  } else {
			  renderVideo(videoId, false);
			}
		} else {
		  renderVideo(videoId, false);
		}
	});
}

function renderVideo(videoId, display) {
  if (display) {
    $("#video-player").html("<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/" + videoId + "?rel=0\" frameborder=\"0\" allowfullscreen></iframe>");
    $("#video-title").html($("#" + videoId + " .video-title").text());
    $("#video-description").html($("#" + videoId + " .video-description").html());
    $("#video-player").fitVids();
  } else {
    $("#video-title").html("Fish &amp; Game Video");
    $("#video-player").html("<div class=\"panel-body\"><div class=\"alert alert-warning\"><h2>Video Not Found</h2><p>This video does not exist in the Idaho Fish and Game YouTube playlist.</p></div></div>");
  }
  var p = $("#page-header");
  var o = p.offset();
  console.log(o.top);
  scrollTo(0,o.top);
}

$(document).ready(function () {
  $("#playlist-content").on('click', 'a.video-title', function() {
    renderVideo($(this).attr("href").substring($(this).attr("href").indexOf("#video-")+7), true);
	});
  $("#video-tabs .nav").on('click', 'a', function() {
    getPlaylistVideosById($(this).attr("id"));
    $("#playlists li").removeClass('active');
    $(this).parent('li').addClass('active');
	});
	var defaultPlaylist = "PL622AC92E518CB04A"; // Featured Playlist.
	if (location.href.indexOf("#PL") != -1) {
    defaultPlaylist = location.href.substring(location.href.indexOf("#PL")+1);
  }
  populateTabsFromJSON(defaultPlaylist);
	$("#context-menu-dropdown").click( function() {
	  $("#context-menu-dropdown .glyphicon").toggleClass("glyphicon-chevron-down");
		$("#context-menu-dropdown .glyphicon").toggleClass("glyphicon-chevron-up");
	});
});
