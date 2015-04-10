function getPlaylistVideosById(thisid) {
	var thispanels;
	var url = "https://gdata.youtube.com/feeds/api/playlists/" + thisid + "?v=2&alt=jsonc&rel=0&callback=?";
  $.getJSON(url, function (response) {
    if (response) {
      $.each(response.data.items, function (ii, item) {
				thispanels = "<h3>" + $('#' + thisid).html() + " Playlist</h3>";
        $.each(response.data.items, function (i, item) {
          thispanels += '<div class="media"><div class="media-left"><a class="videolink videothumb" href="#video-' + item.video.id + '" title="Watch Video"><img class="media-object"   alt="Watch Video" src="img/video-play.png" style="background-image:url(' + item.video.thumbnail.sqDefault + ');" width="120" height="90" /></a></div><div class="media-body"><h4 class="media-heading"><a class="videolink" href="#video-' + item.video.id + '" title="Watch Video">' + item.video.title + '</a></h4>' + item.video.description + '<div class="text-muted">Duration ' + Math.floor(item.video.duration/60) + ':' + item.video.duration % 60 + '&nbsp; Views ' + item.video.viewCount + '&nbsp; Released ' + item.video.uploaded.substring(0,10) + '</div></div></div>';
        });
        $("#playlist-content").html(thispanels + '');
      });
    }
  });
}

function loadrecent() {
  var url = "https://gdata.youtube.com/feeds/api/users/idahofishgame/uploads?v=2&alt=jsonc&rel=0&callback=?"; // Most Recent Videos
  $.getJSON(url,
    function (response) {
      if (response) {
        var panels = '';
				var oddeven = '';
        panels += '<div id="mostrecent"><h3>Recent Playlist</h3>';
        $.each(response.data.items, function (i, item) {
					if (i==0) {
						if (location.href.indexOf("#video-") != -1) {
							loadvideo(location.href.substring(location.href.indexOf("#video-")+7), 1);
						} else {
							loadvideo(item.id, 0);
						}
					}
					panels += '<div class="media"><div class="media-left"><a class="videolink videothumb" href="#video-' + item.id + '" title="Watch Video"><img class="media-object" alt="Watch Video" src="img/video-play.png" style="background-image:url(' + item.thumbnail.sqDefault + ');" width="120" height="90" /></a></div><div class="media-body"><h4 class="media-heading"><a class="videolink" href="#video-' + item.id + '" title="Watch Video">' + item.title + '</a></h4>' + item.description + '<div class="text-muted">Duration ' + Math.floor(item.duration/60) + ':' + item.duration % 60 + '&nbsp; ' + item.viewCount + '&nbsp; Released ' + item.uploaded.substring(0,10) + '</div></div></div>';
        });
        panels += '</div>';
        $("#playlist-content").html(panels);
      }
    }
  );
}

function populatetabsfromjson() {
	var url = "http://gdata.youtube.com/feeds/api/users/idahofishgame/playlists?v=2&alt=jsonc&callback=?";  // Playlists by Username
  $.getJSON(url, function (response) {
    if (response) {
      $.each(response.data.items, function (i, item) {
        var id = item.id;
        var title = item.title;
        $("#videotabs .nav").append('<li><a id="' + id + '" href="#' + id + '">' + title + '</a></li>');
        //getPlaylistVideosById(id);
      });
    }
  });
}

function loadvideo(videoid, autoplay) {
	$.ajaxSetup({ cache: false });	
  var url = 'https://gdata.youtube.com/feeds/api/videos/' + videoid + '?v=2&alt=jsonc&rel=0&callback=?';
  $.getJSON(url, function (response) {
    if (response) {	
			if (response.data.uploader == 'idahofishgame') {
				$("#playingvideo").html('<iframe width="560" height="315" src="https://www.youtube.com/embed/' + videoid + '?rel=0" frameborder="0" allowfullscreen></iframe>');
        $("#playinginfo").html('<h3>' + response.data.title + '</h3>' + response.data.description);
        $("#playingvideo").fitVids();
			} else {
				$("#playingvideo").html('<div class="panel-body"><h2>Invalid URL</h2><p>Please check the URL in your browser address bar or select a video below.</p></div>');
			}
		}
	});
	scrollTo(0,0);
}

$(document).ready(function () {
  $("#playlist-content").on('click', 'a.videolink', function() {
    loadvideo($(this).attr("href").substring($(this).attr("href").indexOf("#video-")+7), 1);
	});
  $("#videotabs .nav").on('click', 'a', function() {
    getPlaylistVideosById($(this).attr("id"));
	});
  loadrecent(); //Loads the Recent video playlists. 
  populatetabsfromjson();
});
