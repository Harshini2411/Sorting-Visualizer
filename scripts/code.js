$(function () {
                // overlays stuffs
                $('#trigger-about').click(function () {
                    if ($(window).width() > 600) {
                        $('#dark-overlay').fadeIn(function () {
                            $('#about').fadeIn();
                        });
                    }
                    else
                        alert('Sorry, this dialog is too big. Please load it on bigger screen');
                });

                $('#trigger-team').click(function () {
                    if ($(window).width() > 600) {
                        $('#dark-overlay').fadeIn(function () {
                            $('#team').fadeIn();
                        });
                    }
                    else
                        alert('Sorry, this dialog is too big. Please load it on bigger screen');
                });

                $('#trigger-terms').click(function () {
                    if ($(window).width() > 600) {
                        $('#dark-overlay').fadeIn(function () {
                            $('#termsofuse').fadeIn();
                        });
                    }
                    else
                        alert('Sorry, this dialog is too big. Please load it on bigger screen');
                });

                $('#trigger-privacy').click(function () {
                    if ($(window).width() > 600) {
                        $('#dark-overlay').fadeIn(function () {
                            $('#privacy-policy').fadeIn();
                        });
                    }
                    else
                        alert('Sorry, this dialog is too big. Please load it on bigger screen');
                })

                $('.close-overlay').click(function () {
                    $('.overlays').fadeOut(function () {
                        $('#dark-overlay').fadeOut();
                    });
                });

                $('#dark-overlay').click(function () {
                    $('.overlays').fadeOut();
                    $('#dark-overlay').fadeOut();
                });
            })
   
    
           