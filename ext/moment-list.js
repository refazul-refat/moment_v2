Moment_List=(function(){
	var followInterval;
	var lock = false;
	var _private={
		create:function(assetId, videoId){
			// Clear any intervals if they present.
			clearInterval(followInterval);
			$.ajax({
				// __asset_id_moments_get_api_call__
				url:Global.getAPIRoot()+'assets/'+assetId,
				dataType:'json',
				method:'GET',
				success:function(response){
					U.bind(Global.getBaseDir()+'template/moment_list.html',{asset_id:assetId}, function(template){
						$('.p-container').append(template);
						for(var i=0;i<response.length;i++){
							U.bind(Global.getBaseDir()+'template/moment_list_bm_container.html',
								response[i],
								function(innerTemplate) {
									$('#moment_list').append(innerTemplate);
							});

							if(i === response.length-1) {
			    				// VideoMomentList should be rebuilt whenever window size has changed.
			    				setTimeout(function(){
			    					var videoDuration = Youtube.getDuration(videoId);
			    					var resizeTimeout;
			    					_private.build(videoDuration);
									_private.bindings(videoId);
								    $( window ).resize(function() {
				                        clearTimeout(resizeTimeout);
				                        resizeTimeout = setTimeout(function() {
				                    		_private.build(videoDuration);
				                        }, 50);
				                    });

								    // Change new bookmark position each 0.5 second
				                    followInterval = setInterval(function(){
				                    	_private.followBookmark(videoDuration, videoId);
				                    }, 500)
			    				}, 500);
							}

						}
					});

				}
			});
		},
		calculateImage:function(momentBookmark, width, height, rows, columns, position, image) {
			momentBookmark.css({
					'background-image' : 'url(' + image + ')',
					'background-size' : rows * 100 + '% ' + (15 + columns * 100) + '%',
					'background-position' : '-' + ((position%columns)*width)+'px -'+(Math.floor(position/rows)*height)+'px'
			});
		},
		build:function(videoDuration) {
			var StackedLeft        = 0;
	        var StackedRight       = 0;
	        var StackIndentPercent = 2; // The percentage bookmarks will be indented when they overlap on the edges

	        // Number of padding pixels from the top of the window
	        // and the popup window when the scrolling is activated.
	        var ScrollTopPadding   = 70;

	        // Set variables that will determine the size of  bookmarks.
	        // Choose the number of bookmarks that should fix (side by side)
	        // within moment_lists of various absolute widths.
	        var momentListWidth  = $('div#moment_list').width();

	        var bmToFitWidth = 6;
	        var bmStyles = {
	            'line-height' : '0.9',
	            'font-size' : '11px'
	        };
	        if (momentListWidth >  670) {
	            bmToFitWidth =  7;
	            bmStyles = {
	                'line-height' : '1.2',
	                'font-size' : '13px'
	            };
	         }
	        if (momentListWidth >  800) {
	            bmToFitWidth =  8;
	            bmStyles = {
	                'line-height' : '1.2',
	                'font-size' : '13px'
	            };
	        }
			if (momentListWidth >  900) {
	            bmToFitWidth =  9;
	            bmStyles = {
	                'line-height' : '1.2',
	                'font-size' : '13px'
	            };
	        }
	        if (momentListWidth > 1060) {
	            bmToFitWidth = 10;
	            bmStyles = {
	                'line-height' : '1.3',
	                'font-size' : '16px'
	            };
	        }

	        // Count how many bookmarks will stack on the right edge
	        // so we can indent the first bookmark the most, and subsequent bookmarks less.
	        // Otherwise, the last bookmark will be indented furthest.
	        $('.bm_thumbnail').each(function() {
	            var bmCenter = ($(this).data('x-position') * 100) / videoDuration;
	            var bmWidth = ($(this).width() * 100) / $('div#moment_list').width();
	            if (bmCenter + bmWidth/2 > 100 - StackIndentPercent) { StackedRight++; }
	        });

	        $('.bm_thumbnail').each(function() {
	            // data-x-position durations should be provided by backend.

	            // Adjust the size of the bookmark to the absolute width of the moment_list
	            var currentBmHeight = momentListWidth / bmToFitWidth * 9/16;
	            var currentBmWidth = momentListWidth / bmToFitWidth;
	            $(this).css({'width' : currentBmWidth});
	            $(this).css({'height' : currentBmHeight});
	            // Adjust the styling of h4 inside bookmark.
	            $(this).find('h4').css(bmStyles)

	            // bmCenter is place where arrow should be located.
	            // bmLeft is where thumbnail should be located. It should be moved
	            // be 1/2 of the box size into the right, making the arrow at the center.
	            // calculate what percentage width of the one thumbnail in comparision to the whole grid.
	            var bmCenter = ($(this).data('x-position') * 100) / videoDuration;
	            var bmWidth = ($(this).width() * 100) / $('div#moment_list').width();
	            var bmLeft = bmCenter - bmWidth/2;

	            var arrow = $(this).find('.bm_arrow');
	            var arrowWidth = 10 / $(this).width() * 100;
	            // the 25 is from a _variable that defines the height of the arrow, and wthe width = twice that

	            if(bmLeft < StackIndentPercent) {
	                // If it goes out of the box via left side

	                // Start with margin-left: 0, 5% etc.
	                $(this).css({'left' : StackedLeft * StackIndentPercent + '%'});
	                $(this).siblings('.bm_menu').css({
	                    'left' : StackedLeft * StackIndentPercent + '%',
	                    'width' : currentBmWidth,
	                    'height' : currentBmHeight
	                });

	                // The arrow wont be in the middle <i class="fa fa-thumbs-o-up"></i> likealways. Just push it all the way to the left.
	                arrow.css({'left' : '0%'});

	                // How much elements are on the left-side-edge?
	                StackedLeft++;
	            } else if (bmCenter + bmWidth/2 > 100 - StackIndentPercent) {
	                StackedRight--;
	                // Or if it goes out of the box via right side

	                // Start with margin-left: 100%, 95%, 90% etc.
	                $(this).css({'left' : 100 - StackedRight * StackIndentPercent - bmWidth + '%'});
	                $(this).siblings('.bm_menu').css({
	                    'left' :  100 - StackedRight * StackIndentPercent - bmWidth + '%',
	                    'width' : currentBmWidth,
	                    'height' : currentBmHeight
	                });

	                // The arrow wont be in the middle <i class="fa fa-thumbs-o-up"></i> likealways. Just push it all the way to the right.
	                arrow.css({'left' : 100 - arrowWidth*2 + '%'});

	                // Counting down the bookmarks stack on the right
	            } else {
	                // Normal scenario.
	                $(this).css({'left' : bmLeft + '%'});
	                $(this).siblings('.bm_menu').css({
	                    'left'   : bmLeft + '%',
	                    'width'  : currentBmWidth,
	                    'height' : currentBmHeight
	                });
	                arrow.css({'left' : 50 - arrowWidth/2 + '%'});
	            }

	            if(!$(this).hasClass('.bm_new_moment')) {
					_private.calculateImage(
						$(this),
						currentBmWidth,
						currentBmHeight,
						$(this).attr('data-rows'),
						$(this).attr('data-columns'),
						$(this).attr('data-position'),
						$(this).attr('data-image')
					);
				}

	        });


	        if($('.menu_popup').height() + ScrollTopPadding >= $(window).height()) {
	            // Because we'll be affecting the very same popup we are
	            // getting value from, we need to lock its value in order to prevent
	            // 'wideth' from changing in the future.
	            if(typeof lockPopupWidth === 'undefined') {
	                lockPopupWidth = $('.menu_popup').width() + 30;
	            }

	            $('.menu_popup').css({
	                'overflow-y' : 'scroll',
	                'height'     : $(window).height() - ScrollTopPadding,
	                // Add some width because of the sidebar.
	                'width'      : lockPopupWidth
	            });
	        } else {
	            $('.menu_popup').css({
	                'overflow-y' : 'hidden',
	                'height'     : 'auto',
	                'width'      : ''
	            });
	        }

	        // At the end we need to recalculate the height of the moment_list_background

	        // The height is current Thumbnail height + Arrow Height * 2.
	        // Its multiplied by two because the we want padding to be present on both top and bottom.
	        // We parse the 'bottom' css value because the arrow has no actual height (its placed within thumbnail and its
	        // position is aligned using the bottom value )
	        var bmThumbnailPlusArrowHeight = $('.bm_thumbnail').height() + (parseInt($('.bm_arrow').css('bottom')) * -1) * 2;
	        $('.moment_list_background').css({'height' : bmThumbnailPlusArrowHeight});
		},
		bindings:function(videoId) {

			// On mouseover show the "bookmarks" which are below each other.
			// On mosueleave reset the z-indexes.
			$('.bm_thumbnail').on("click", function(){
				Youtube.seekTo($('.p-container iframe').attr('id'), $(this).data('x-position'));
			});
			$('.bm_container').on("mouseover", function(){
			    if(lock === false) {

			    	$(this).find('.menu_save, .menu_cancel, .menu_open').addClass('roll');
			    	// logic for regular thumbnail
			    	var thumbnail = $(this).find('.bm_thumbnail:not(.bm_new_moment)');
			        thumbnail.css({
						'border' : '1px solid #fff',
						'z-index' : '20'
					});
			        thumbnail.siblings('.bm_menu').css({
			        	'visibility' : 'visible', 'z-index' : '15'
			        });
			        thumbnail.find('.bm_arrow').css({
			        	'border-color' : '#ffffff transparent transparent transparent'
			        });

			        // logic for new moment thumbnail
			        var newThumbnail = $(this).find('.bm_thumbnail.bm_new_moment');
			        newThumbnail.css({
						'z-index' : '20'
					});
			    	newThumbnail.siblings('.bm_menu').css({
			        	'visibility' : 'visible', 'z-index' : '15'
			        });
			        newThumbnail.siblings('.bm_menu').find('.menu_open').css({
			        	'display' : 'block',
			        });
			    }
			});
			$('.bm_container').on("mouseleave", function(){
			    if(lock === false) {

			    	$(this).find('.menu_save, .menu_cancel, .menu_open').removeClass('roll');
			    	// logic for regular thumbnail
				    	var thumbnail = $(this).find('.bm_thumbnail:not(.bm_new_moment)');
				        thumbnail.find('.bm_arrow').css({
				        	'border-color' : '#929292 transparent transparent transparent'
				        });

				        // logic for new moment thumbnail
				    	var newThumbnail = $(this).find('.bm_thumbnail.bm_new_moment');
				        newThumbnail.siblings('.bm_menu').find('.menu_open').css({
				        	'display' : 'block',
				        });

				        // We need Timeout because of the .roll animation on buttons.
				        setTimeout(function(){
					        thumbnail.css({
								'border' : '1px solid #929292',
								'z-index' : '10'
							});
							thumbnail.siblings('.bm_menu').css({
					        	'visibility' : 'hidden', 'z-index' : '0'
					        });

					        newThumbnail.css({
							'z-index' : '11'
							});
					    	newThumbnail.siblings('.bm_menu').css({
					        	'visibility' : 'hidden', 'z-index' : '0'
					        });
			    		}, 200);
			    }

				// Close popup menu when roll off of it.
			    $('.menu_popup.opened .button_close').click();
			    $('.menu_popup.opened').removeClass('opened');
			    $(this).find('.bm_menu').css({'visibility' : 'hidden'});
			});

			// Hide description if clicked on close.
			var descriptionHidden = false;
			$('.description_close').on("click tap", function(){
				descriptionHidden = true;
				$('.bm_new_moment_description').hide();
			});
			// Hide bm_moment when clicked on cancel.
			// Will reappear on scrolling off and then on the moment_list
			$('.bm_new_moment_menu .menu_cancel').on("click tap", function(){
				$('.bm_new_moment').hide();
				$('.bm_new_moment_menu').hide();
			});
			// When you roll off the moment_list reenable the new_moment list.
			$('#moment_list').on("mouseleave", function() {
				setTimeout(function(){
					$('.bm_new_moment').show();
					$('.bm_new_moment_menu').show();
					// If description was hidden, don't diplay it.
					if(descriptionHidden === true) {
						$('.bm_new_moment_description').hide();
					}
				}, 200)
			});
			// When clicking on the new_moment
			$('.bm_new_moment').on("click tap", function(){
				Youtube.pause(videoId);
			});
			// Event when editing the new_moment h4 text
			$('.bm_new_moment h4').on("keydown", function(e){
				// If enter is pressed.
				if(e.keyCode == 13) {
			        e.preventDefault();
			        // Click on bg moment to exit the editing mode.
			        $(this).blur();
			        // Play the video
					Youtube.play(videoId);
			    }
			});

			// pl_menu_onMouseClick
			// When cursor is over the .menu_open class
			$('.menu_open').on("click tap", function(){

			    // It means there is lock on the popup, we need to close that popup.
			    if(lock === true) {
			        $('.menu_popup.opened .button_close').click();
			        $('.menu_popup.opened').removeClass('opened');
			    }

			    // Make sure other menus and thumbnails z-indexes are below the
			    // one that is about to get opened/used.
			    $('.bm_thumbnail:not(.bm_new_moment)').css({'z-index' : '10'});
			    $('.bm_menu').css({'z-index' : '0'});

			    // Open the Popup and add z-index for this bm_menu.
			    $(this).siblings('.menu_popup').addClass('opened').show();
			    $(this).parents('.bm_menu').css({'z-index' : '15'});

			    // When Popup is opened, hide the circle button.
			    $(this).hide();
			    lock = true;
			});

			$('.button_close, .button_close_container').on("click", function() {
			    $('.menu_popup').hide();
			    $('.bm_menu').css({'z-index' : '0'});

			    // When Popup is closed, make sure all cricles are visible.
			    // but enable them after delay which is the time when modal is beign closed.
			    setTimeout(function(){
				    $('.menu_open').show();
			    }, 200);

			    lock = false;
			});
		},
		followBookmark:function(videoDuration, videoId) {
			// we call a method on player to get current time for the video
	        // this function will be different for each player cause
	        // not sure but theres always the high chance that some of the video sites
	        // wont allow to get currenttime?

	        currentTime = Youtube.getCurrentTime(videoId);
	        var startTime = 5;

	        // New bookmark should be visible only when the currentTime
	        // is higher than startTime.
	        if(currentTime > startTime) {
	            $('.bm_new_moment').css({'visibility' : 'visible'});

	            $('.bm_new_moment').data('x-position', currentTime)
	            var arrowWidth = 10 / $('.bm_new_moment').width() * 100;
	            var bmCenter = Math.round(($('.bm_new_moment').data('x-position') * 100) / videoDuration, -1);
	            var bmWidth = Math.round(($('.bm_new_moment').width() * 100) / $('div#moment_list').width(), -1);
	            var bmLeft = Math.round(bmCenter - bmWidth/2, -1);
	            var StackIndentPercent = 0; // The percentage bookmarks will be indented when they overlap on the edges
	            if (Math.floor(bmCenter + bmWidth) > 100) {
	                var currentPositionPercentage = ((currentTime * 100) / videoDuration ) - 100;
	                var currentRelativePositionPercentage = (currentPositionPercentage  * -1 * 100) / bmWidth + arrowWidth;
	                var currentRelativePositionPercentage = ((currentRelativePositionPercentage - 100) * -1) % 100;
	                // Lock the new_moment.
	                $('.bm_new_moment').css({'left' : 100 - bmWidth + '%'});
	                // Move only the arrow.
	                $('.bm_new_moment').find('.bm_arrow').css({
	                    'left' : currentRelativePositionPercentage + '%'
	                });

	            } else if (bmLeft < StackIndentPercent) {
	                var currentPositionPercentage = (currentTime * 100) / videoDuration;
	                // maxPositionPercentage is bmWidth.
	                var currentRelativePositionPercentage = (currentPositionPercentage * 100) / bmWidth - arrowWidth;

	                // Lock the new_moment.
	                $('.bm_new_moment').css({'left' : '0'});
	                // Move only the arrow.
	                $('.bm_new_moment').find('.bm_arrow').css({
	                    'left' : currentRelativePositionPercentage + '%',
	                });
	            } else {
	                $('.bm_new_moment').css({'left' : Math.round(bmLeft, -1) + '%'});
	                $('.bm_new_moment').find('.bm_arrow').css({
	                    'left' : 48 - arrowWidth/2 + '%'
	                });
	                $('.bm_new_moment').siblings('.bm_menu').css({
	                    'left'   : Math.round(bmLeft, -1) + '%',
	                    'width'  : $('.bm_new_moment').width(),
	                    'height' : $('.bm_new_moment').height()
	                });
	            }

	            var imageRequest = Youtube.getThumbnailAt(videoId, currentTime);
		        _private.calculateImage(
					$('.bm_new_moment'),
					$('.bm_new_moment').width(),
					$('.bm_new_moment').height(),
					imageRequest.rows,
					imageRequest.columns,
					imageRequest.position,
					imageRequest.url
				)
	        }
		}
	};
	return {
		//
		create:function(apiId, videoId){
			_private.create(apiId, videoId);
		}
	};
})();
