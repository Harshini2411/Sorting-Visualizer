 $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': "xRrjVhfriSU07G42ZE5DTCkNrVfBP8Fiv8mNOSa8"
                }
            });

            // handles account dropdown menu
            $(function () {
                $('#language-dropdown-btn').click(function (e) {
                    $('#language-dropdown-menu').css('display', 'block');
                    $('#account-dropdown-menu').css('display', 'none')
                    e.stopPropagation()
                })
                $(document).click(function () {
                    $('#language-dropdown-menu').css('display', 'none')
                })
            })

            $(function () {
                $('#account-dropdown-btn').click(function (e) {
                    $('#account-dropdown-menu').css('display', 'block')
                    $('#language-dropdown-menu').css('display', 'none')
                    e.stopPropagation()
                })
                $(document).click(function (e) {
                    $('#account-dropdown-menu').css('display', 'none')
                })
            })

            // var PHP_DOMAIN = ""; // is this still used? I turn it off on 4 Jan 2022, see if causes issue

            // surprise colour!
            // Referenced to in  home.js and viz.js also
            var colourArray = ["#52bc69", "#d65775"/*"#ed5a7d"*/, "#2ebbd1", "#d9513c", "#fec515", "#4b65ba", "#ff8a27", "#a7d41e"]; // green, pink, blue, red, yellow, indigo, orange, lime

            function disableScroll() { $('html').css('overflow', 'hidden'); }

            function enableScroll() { $('html').css('overflow', 'visible'); }

            function replaceAll(find, replace, str) { return str.replace(new RegExp(find, 'g'), replace); }

            function getColours() {
                var generatedColours = new Array();
                while (generatedColours.length < 4) {
                    var n = (Math.floor(Math.random() * colourArray.length));
                    if ($.inArray(n, generatedColours) == -1)
                        generatedColours.push(n);
                }
                return generatedColours;
            }

            function isOn(value, position) {
                return (value >> position) & 1 === 1;
            }

            function customAlert(msg) {
                $('#custom-alert p').html(msg);
                var m = -1 * ($('#custom-alert').outerHeight() / 2);
                $('#custom-alert').css('margin-top', m + 'px');
                $('#dark-overlay').fadeIn(function () {
                    $('#custom-alert').fadeIn(function () {
                        setTimeout(function () {
                            $('#custom-alert').fadeOut(function () {
                                $('#dark-overlay').fadeOut();
                            });
                        }, 1000);
                    });
                });
            }

            function showLoadingScreen() {
                $('#loading-overlay').show();
                $('#loading-message').show();
            }

            function hideLoadingScreen() {
                $('#loading-overlay').hide();
            }

            function commonAction(retval, msg) {
                if (retval) {
                    $('#current-action').show();
                    $('#current-action').html(mode == "exploration" ? msg : ("e-Lecture Example (auto play until done)<br>" + msg));
                    $('#progress-bar').slider("option", "max", gw.getTotalIteration() - 1);
                    triggerRightPanels();
                    isPlaying = true;
                }
            }

            function getQueryVariable(variable) {
                var query = window.location.search.substring(1);
                var vars = query.split('&');
                for (var i = 0; i < vars.length; ++i) {
                    var pair = vars[i].split('=');
                    //console.log(variable + " : " + pair[0] + " -> " + pair[1]);
                    if (decodeURIComponent(pair[0]) == variable)
                        return decodeURIComponent(pair[1]);
                }
                return "";
            }

            const MOBILE_WIDTH = 1000;
            const matchMediaMobile = window.matchMedia(`only screen and (max-width: ${MOBILE_WIDTH}px)`);
            const matchMediaNarrow = window.matchMedia(`only screen and (max-width: 500px)`);
            function isMobile() {
                return matchMediaMobile.matches;
            }
            //To fix the issue of a narrow desktop window being asked to rotate, I am now checking for it based on the navigator.userAgent to see if its mobile or not. 
            //This may change in the future if browsers decide to change the naming of userAgent for mobile browsers so may need to keep an eye on this.
            function isMobileOS() {
                return /Mobi/i.test(navigator.userAgent) && !/ipad/i.test(navigator.userAgent);
            }
            let portraitMatcher = window.matchMedia("(orientation:portrait)");
            function isPortrait() {
                return portraitMatcher.matches;
            }

            var generatedColours = getColours();
            var surpriseColour = colourArray[generatedColours[0]];
            var colourTheSecond = colourArray[generatedColours[1]];
            var colourTheThird = colourArray[generatedColours[2]];
            var colourTheFourth = colourArray[generatedColours[3]];

            $(function () {
                $('.links').css('background', surpriseColour);
                $('.colour').css("color", surpriseColour);
                $('h4').css("background-color", surpriseColour); // about, contact us etc. button background

                // title
                $('#title a').click(function () {
                    $('#title a').removeClass('selected-viz');
                    $(this).addClass('selected-viz');
                });
            });

            /*
            // test drop on 4 Jan 2022, see if got issues
                  function checkLogin() {
                    $.get('/checklogin', function(data) {
                      var url = data['url'];
                      window.location.href = '/' + url;
                    });
                  }
            */

            // big question mark on 4 Jan 2022: should I drop this GA for a better privacy policy?

            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date(); a = s.createElement(o),
                    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            function setCookie(cname, cvalue, exdays) {
                const d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                let expires = "expires=" + d.toUTCString();
                document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
            }

            $(function () {
                ga('create', 'UA-1566631-4', 'auto');
                ga('send', 'pageview');
            })

            $('#gdpr-privacy-policy').click(function () {
                if ($(window).width() > 600) {
                    $('#dark-overlay').fadeIn(function () {
                        $('#privacy-policy').fadeIn();
                    });
                }
                else
                    alert('Sorry, this dialog is too big. Please load it on bigger screen');
 
            })

            

