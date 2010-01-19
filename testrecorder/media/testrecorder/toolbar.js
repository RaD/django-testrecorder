jQuery.noConflict();
jQuery(function($j) {
	var COOKIE_NAME = 'dj_debug_panel';
	$j.djDebug = function(data, klass) {
		$j.djDebug.init();
	}
	$j.extend($j.djDebug, {
		init: function() {
			var current = null;
			$j('#djDebugPanelList li a').click(function() {
				if (!this.className) {
					return false;
				}
				current = $j('#djDebug #' + this.className);
				if (current.is(':visible')) {
				    $j(document).trigger('close.djDebug');
					$j(this).parent().removeClass('active');
				} else {
					$j('.panelContent').hide(); // Hide any that are already open
					current.show();
					$j.djDebug.open();
					$j('#djDebugToolbar li').removeClass('active');
					$j(this).parent().addClass('active');
				}
				return false;
			});
			$j('#djDebug a.djDebugClose').click(function() {
				$j(document).trigger('close.djDebug');
				$j('#djDebugToolbar li').removeClass('active');
				return false;
			});
			$j('#djDebug a.remoteCall').click(function() {
				$j('#djDebugWindow').load(this.href, {}, function() {
					$j('#djDebugWindow a.djDebugBack').click(function() {
						$j(this).parent().parent().hide();
						return false;
					});
				});
				$j('#djDebugWindow').show();
				return false;
			});
			$j('#djDebugTemplatePanel a.djTemplateShowContext').click(function() {
				$j.djDebug.toggle_arrow($j(this).children('.toggleArrow'))
				$j.djDebug.toggle_content($j(this).parent().next());
				return false;
			});
			$j('#djHideToolBarButton').click(function() {
				$j.djDebug.hide_toolbar(true);
				return false;
			});
			$j('#djShowToolBarButton').click(function() {
				$j.djDebug.show_toolbar();
				return false;
			});
			$j('#djDebugPanelList li a.djDebugCodePanel').click(function(){
				var area = $j('#djTestCaseCodeArea')
				area.val('Loading...');
				$j.get(this.href, {}, function(data){
					area.val(data);
				}, 'text');
				return false;
			});
			$j('#djGetCodeToolBarButton').click(function(){
				$j.djDebug.show_toolbar();
				$j('#djDebugPanelList li a.djDebugCodePanel').click();
			});
			
			function _delete_record_handler(){
				$j.get(this.href, {}, function(data){
					$j('#djDebugRecordRequestsPanel div.scroll').html(data);
					$j('a.djDeleteRequest').click(_delete_record_handler);
				}, 'text');
				return false;				
			}
			
			$j('.djEdit').editable(djRecToolbarBASE_URL+'/change_func_name/', { 
			      indicator : "save...",
			      tooltip   : "Doubleclick to edit...",
			      event     : "dblclick",
			      style  : "inherit"
			});
			
			$j('a.djDeleteRequest').click(_delete_record_handler);
			
			$j('a.jsStartRecord').click(function(e) {
				$j.get(this.href);
				$j('a.jsStartRecord').hide();
				$j('a.jsStopRecord').show();
				return false;
			});	
			$j('a.jsStopRecord').click(function(e) {
				$j.get(this.href);
				$j('a.jsStopRecord').hide();
				$j('a.jsStartRecord').show();
				return false;
			});						
			if ($j.cookie(COOKIE_NAME)) {
				$j.djDebug.hide_toolbar(false);
			} else {
				$j.djDebug.show_toolbar(false);
			}
		},
		open: function() {
			// TODO: Decide if we should remove this
		},
		toggle_content: function(elem) {
			if (elem.is(':visible')) {
				elem.hide();
			} else {
				elem.show();
			}
		},
		close: function() {
			$j(document).trigger('close.djDebug');
			return false;
		},
		hide_toolbar: function(setCookie) {
			// close any sub panels
			$j('#djDebugWindow').hide();
			// close all panels
			$j('.panelContent').hide();
			$j('#djDebugToolbar li').removeClass('active');
			// finally close toolbar
			$j('#djDebugToolbar').hide('fast');
			$j('#djDebugToolbarHandle').show();
			// Unbind keydown
			$j(document).unbind('keydown.djDebug');
			if (setCookie) {
				$j.cookie(COOKIE_NAME, 'hide', {
					path: '/',
					expires: 10
				});
			}
		},
		show_toolbar: function(animate) {
			// Set up keybindings
			$j(document).bind('keydown.djDebug', function(e) {
				if (e.keyCode == 27) {
					$j.djDebug.close();
				}
			});
			$j('#djDebugToolbarHandle').hide();
			if (animate) {
				$j('#djDebugToolbar').show('fast');
			} else {
				$j('#djDebugToolbar').show();
			}
			$j.cookie(COOKIE_NAME, null, {
				path: '/',
				expires: -1
			});
		},
		toggle_arrow: function(elem) {
			var uarr = String.fromCharCode(0x25b6);
			var darr = String.fromCharCode(0x25bc);
			elem.html(elem.html() == uarr ? darr : uarr);
		}
	});
	$j(document).bind('close.djDebug', function() {
		// If a sub-panel is open, close that
		if ($j('#djDebugWindow').is(':visible')) {
			$j('#djDebugWindow').hide();
			return;
		}
		// If a panel is open, close that
		if ($j('.panelContent').is(':visible')) {
			$j('.panelContent').hide();
			return;
		}
		// Otherwise, just minimize the toolbar
		if ($j('#djDebugToolbar').is(':visible')) {
			$j.djDebug.hide_toolbar(true);
			return;
		}
	});
});
jQuery(function() {
	jQuery.djDebug();
});
jQuery.cookie = function(b, j, m){
    if (typeof j != "undefined") {
        m = m || {};
        if (j === null) {
            j = "";
            m.expires = -1
        }
        var e = "";
        if (m.expires && (typeof m.expires == "number" || m.expires.toUTCString)) {
            var f;
            if (typeof m.expires == "number") {
                f = new Date();
                f.setTime(f.getTime() + (m.expires * 24 * 60 * 60 * 1000))
            }
            else {
                f = m.expires
            }
            e = "; expires=" + f.toUTCString()
        }
        var l = m.path ? "; path=" + (m.path) : "";
        var g = m.domain ? "; domain=" + (m.domain) : "";
        var a = m.secure ? "; secure" : "";
        document.cookie = [b, "=", encodeURIComponent(j), e, l, g, a].join("")
    }
    else {
        var d = null;
        if (document.cookie && document.cookie != "") {
            var k = document.cookie.split(";");
            for (var h = 0; h < k.length; h++) {
                var c = jQuery.trim(k[h]);
                if (c.substring(0, b.length + 1) == (b + "=")) {
                    d = decodeURIComponent(c.substring(b.length + 1));
                    break
                }
            }
        }
        return d
    }
};