 $(function () {
                let defaultPlaybackSpeed = 1;
                createPlaybackSpeedSlider(defaultPlaybackSpeed);
                $('#account-dropdown-btn').click(function (e) {
                    $('#account-dropdown-menu').css('display', 'block')
                    $('#language-dropdown-menu').css('display', 'none')
                    e.stopPropagation()
                })
                $(document).click(function (e) {
                    $('#account-dropdown-menu').css('display', 'none')
                });
                //Mobile Design Related DOM Manipulations
                if (isMobile()) {
                    $("#status").css({
                        "bottom": "10%",
                        "height": "12%",
                        "max-height": "54px"
                    });
                    $("#current-action").css("bottom", "22%");
                    $('#status-hide').remove();
                    $('#left-bar').remove();
                    $('#right-bar').remove();
                    $("#mode-menu").remove();
                    $("#codetrace").css("z-index", 1);
                    $("#bottom-bar a").hide();
                    $("#bottom-bar").css("height", $("#topbar").css("height"));
                    $(".speed-dropup-btn").show();
                    $("#go-to-beginning").remove();
                    $("#go-to-end").remove();
                    $("#pause").remove();
                    $("#play").remove();
                    $("#previous").remove();
                    $("#next").remove();

                    //make progress bar longer
                    $("#progress-bar").css({
                        left: "30%",
                        width: "60%",
                        'margin-left': 0
                    })
                }
            })

            let mobilePlaybackOverlayTimeout;
            $(function () {
                $("#viz").on("click", () => {
                    if (isMobile()) {
                        if ($("#mobile-playback-overlay").is(":hidden") && isPlaying) {
                            $("#mobile-playback-overlay").fadeIn();
                            hideMobilePlaybackOverlay(6000);
                        } else {
                            $("#mobile-playback-overlay").fadeOut();
                        }
                    }
                });
                $("#mobile-playback-overlay").on("click", (event) => {
                    if (event.target === event.currentTarget) //to ensure clicks on the controls dont fade the overlay
                        $("#mobile-playback-overlay").fadeOut();
                    else
                        hideMobilePlaybackOverlay(5000);
                })
            });
            function hideMobilePlaybackOverlay(timeOut) {
                if (mobilePlaybackOverlayTimeout)
                    clearTimeout(mobilePlaybackOverlayTimeout);
                mobilePlaybackOverlayTimeout = setTimeout(() => {
                    $("#mobile-playback-overlay").fadeOut();
                }, timeOut);
            }
            function mobilePlaybackPauseOrPlay() {
                if ($("#mobile-playback-overlay").hasClass("playing")) {
                    pause();
                    hideMobilePlaybackOverlay(5000);
                } else {
                    play();
                    hideMobilePlaybackOverlay(3000);
                }
            }
            let rewindLabelTimeout, forwardLabelTimeout;
            function mobilePlaybackRewind() {
                $("#mobile-playback-rewind-label").css("opacity", 1);
                if (rewindLabelTimeout)
                    clearTimeout(rewindLabelTimeout);
                rewindLabelTimeout = setTimeout(() => {
                    $("#mobile-playback-rewind-label").css("opacity", 0);
                }, 800);
                stepBackward(7);
            }
            function mobilePlaybackForward() {
                $("#mobile-playback-forward-label").css("opacity", 1);
                if (forwardLabelTimeout)
                    clearTimeout(forwardLabelTimeout);
                forwardLabelTimeout = setTimeout(() => {
                    $("#mobile-playback-forward-label").css("opacity", 0);
                }, 800);
                stepForward(7);
            }

            //let eLectureSessionHistory = {};
            const sectorColors = ['#05a4d0', '#f1c706', '#fa0202'];
            function setSlideTimelineColor(slideNo) {
                const sectionNo = slideNo.split('-')[0];
                $(`[slideNo="${slideNo}"]`).css('background', sectorColors[(parseInt(sectionNo) % 3)]);
            }

            let currSlideTimer = null; //global so that we can clear the timeout when required

           
            const numSlides = lectureIds.length;
            var sectorJunction12Section = 0, sectorJunction12Slide = 0;
            var sectorJunction23Section = 0, sectorJunction23Slide = 0;
            var sector1Count = 0, sector2Count = 0, sector3Count = 0;
            const sectorLength = Math.floor(numSlides / 3);
            function createELectureTimelineDisplay() {
                for (let j = 0; j < numSlides; ++j) {
                    const currLecture = lectureIds[j].value;
                    if (currLecture.includes('-')) {
                        $('#e-lecture-timeline').append(
                            $(`<div class="e-lecture-timeline-slide" slideNo=${lectureIds[j].value}></div>`)
                        );
                    } else {
                        $('#e-lecture-timeline').append(
                            $(`<div class="e-lecture-timeline-checkpoint" slideNo=${lectureIds[j].value}></div>`)
                        );
                    }
                }
            }

            function setSectorJunctionInfo() {
                //setting the sector junction slide numbers
                const j12 = sectorLength !== 0 ? (sectorLength - 1) : 0;
                const j23 = sectorLength !== 0 ? (2 * sectorLength - 1) : 0;

                const sectorJunction12 = lectureIds[j12].value.split('-');
                sectorJunction12Section = parseInt(sectorJunction12[0]);
                sectorJunction12Slide = sectorJunction12.length > 1 ? parseInt(sectorJunction12[1]) : sectorJunction12Slide;

                const sectorJunction23 = lectureIds[j23].value.split('-');
                sectorJunction23Section = parseInt(sectorJunction23[0]);
                sectorJunction23Slide = sectorJunction23.length > 1 ? parseInt(sectorJunction23[1]) : sectorJunction23Slide;
            }

            function runSlide(slide) { // Steven's patch on 28 Jan 2022: Properly remove slide 99, 99-1, 99-2, 99-3, integrate with the earlier slides
                if (slide == '1') {
                    $("#e-lecture").html("slide " + slide + " (" + 1 + "%)");
                    $('#title-Bubble').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.bubbleSort, "29,10,14,37,14");
                }
                if (slide == '1-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 2 + "%)");

                }
                if (slide == '1-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 3 + "%)");

                }
                if (slide == '1-3') {
                    $("#e-lecture").html("slide " + slide + " (" + 4 + "%)");

                }
                if (slide == '2') {
                    $("#e-lecture").html("slide " + slide + " (" + 6 + "%)");
                    $("#create").click().addClass("menu-highlighted");
                }
                if (slide == '2-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 7 + "%)");
                    $("#create").click().addClass("menu-highlighted");
                }
                if (slide == '2-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 8 + "%)");
                    $('#title-Bubble').click();
                    $("#sort").addClass("menu-highlighted");
                }
                if (slide == '3') {
                    $("#e-lecture").html("slide " + slide + " (" + 9 + "%)");

                }
                if (slide == '4') {
                    $("#e-lecture").html("slide " + slide + " (" + 10 + "%)");

                }
                if (slide == '4-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 12 + "%)");

                }
                if (slide == '5') {
                    $("#e-lecture").html("slide " + slide + " (" + 13 + "%)");

                }
                if (slide == '6') {
                    $("#e-lecture").html("slide " + slide + " (" + 14 + "%)");

                }
                if (slide == '6-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 15 + "%)");

                }
                if (slide == '6-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 16 + "%)");

                }
                if (slide == '6-3') {
                    $("#e-lecture").html("slide " + slide + " (" + 18 + "%)");

                }
                if (slide == '6-4') {
                    $("#e-lecture").html("slide " + slide + " (" + 19 + "%)");

                }
                if (slide == '6-5') {
                    $("#e-lecture").html("slide " + slide + " (" + 20 + "%)");

                }
                if (slide == '6-6') {
                    $("#e-lecture").html("slide " + slide + " (" + 21 + "%)");

                }
                if (slide == '6-7') {
                    $("#e-lecture").html("slide " + slide + " (" + 22 + "%)");

                }
                if (slide == '6-8') {
                    $("#e-lecture").html("slide " + slide + " (" + 24 + "%)");

                }
                if (slide == '6-9') {
                    $("#e-lecture").html("slide " + slide + " (" + 25 + "%)");

                }
                if (slide == '6-10') {
                    $("#e-lecture").html("slide " + slide + " (" + 26 + "%)");

                }
                if (slide == '6-11') {
                    $("#e-lecture").html("slide " + slide + " (" + 27 + "%)");

                }
                if (slide == '7') {
                    $("#e-lecture").html("slide " + slide + " (" + 28 + "%)");
                    $('#title-Bubble').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.bubbleSort, "29,10,14,37,14");
                }
                if (slide == '7-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 30 + "%)");
                    $('#title-Bubble').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.bubbleSort, "29,10,14,37,14");
                }
                if (slide == '7-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 31 + "%)");
                    $('#title-Bubble').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.bubbleSort, "3,6,11,25,39");
                }
                if (slide == '7-3') {
                    $("#e-lecture").html("slide " + slide + " (" + 32 + "%)");
                    $('#title-Bubble').click();
                    $("#sort").addClass("menu-highlighted");
                }
                if (slide == '8') {
                    $("#e-lecture").html("slide " + slide + " (" + 33 + "%)");
                    $('#title-Selection').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.selectionSort, "29,10,14,37,13");
                }
                if (slide == '8-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 34 + "%)");
                    $('#title-Selection').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.selectionSort, "29,10,14,37,13");
                }
                if (slide == '8-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 36 + "%)");
                    $('#title-Selection').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.selectionSort, "29,10,14,37,13");
                }
                if (slide == '9') {
                    $("#e-lecture").html("slide " + slide + " (" + 37 + "%)");
                    $('#title-Insertion').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.insertionSort, "40,13,20,8");
                }
                if (slide == '9-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 38 + "%)");
                    $('#title-Insertion').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.insertionSort, "40,13,20,8");
                }
                if (slide == '9-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 39 + "%)");
                    $('#title-Insertion').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.insertionSort, "40,13,20,8");
                }
                if (slide == '9-3') {
                    $("#e-lecture").html("slide " + slide + " (" + 40 + "%)");
                    $('#title-Insertion').click();
                    $("#sort").addClass("menu-highlighted");
                    changeSortType(gw.insertionSort, "40,13,20,8");
                }
                if (slide == '10') {
                    $("#e-lecture").html("slide " + slide + " (" + 42 + "%)");

                }
                if (slide == '11') {
                    $("#e-lecture").html("slide " + slide + " (" + 43 + "%)");
                    $('#title-Merge').click();
                }
                if (slide == '11-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 44 + "%)");
                    $('#title-Merge').click();
                    changeSortType(gw.mergeSort, "1,5,19,20,2,11,15,17");
                }
                if (slide == '11-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 45 + "%)");
                    $('#title-Merge').click();
                    changeSortType(gw.mergeSort, "1,5,19,20,2,11,15,17");
                }
                if (slide == '11-3') {
                    $("#e-lecture").html("slide " + slide + " (" + 46 + "%)");
                    $('#title-Merge').click();
                }
                if (slide == '11-4') {
                    $("#e-lecture").html("slide " + slide + " (" + 48 + "%)");
                    $('#title-Merge').click();
                }
                if (slide == '11-5') {
                    $("#e-lecture").html("slide " + slide + " (" + 49 + "%)");
                    $('#title-Merge').click();
                }
                if (slide == '11-6') {
                    $("#e-lecture").html("slide " + slide + " (" + 50 + "%)");
                    $('#title-Merge').click();
                    changeSortType(gw.mergeSort, "7,2,6,3,8,4,5");
                }
                if (slide == '11-7') {
                    $("#e-lecture").html("slide " + slide + " (" + 51 + "%)");
                    $('#title-Merge').click();
                }
                if (slide == '11-8') {
                    $("#e-lecture").html("slide " + slide + " (" + 53 + "%)");
                    $('#title-Merge').click();
                }
                if (slide == '11-9') {
                    $("#e-lecture").html("slide " + slide + " (" + 54 + "%)");
                    $('#title-Merge').click();
                }
                if (slide == '11-10') {
                    $("#e-lecture").html("slide " + slide + " (" + 55 + "%)");

                }
                if (slide == '11-11') {
                    $("#e-lecture").html("slide " + slide + " (" + 56 + "%)");

                }
                if (slide == '12') {
                    $("#e-lecture").html("slide " + slide + " (" + 57 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,27,16");
                }
                if (slide == '12-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 59 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,27,16");
                }
                if (slide == '12-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 60 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,27,16");
                }
                if (slide == '12-3') {
                    $("#e-lecture").html("slide " + slide + " (" + 61 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,27,16");
                }
                if (slide == '12-4') {
                    $("#e-lecture").html("slide " + slide + " (" + 62 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,27,16");
                }
                if (slide == '12-5') {
                    $("#e-lecture").html("slide " + slide + " (" + 63 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,27,16");
                }
                if (slide == '12-6') {
                    $("#e-lecture").html("slide " + slide + " (" + 65 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,27,16");
                }
                if (slide == '12-7') {
                    $("#e-lecture").html("slide " + slide + " (" + 66 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,27,16");
                }
                if (slide == '12-8') {
                    $("#e-lecture").html("slide " + slide + " (" + 67 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,27,16");
                }
                if (slide == '12-9') {
                    $("#e-lecture").html("slide " + slide + " (" + 68 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "27,38,12,39,29,16");
                }
                if (slide == '12-10') {
                    $("#e-lecture").html("slide " + slide + " (" + 69 + "%)");
                    $('#title-Quick').click();
                }
                if (slide == '12-11') {
                    $("#e-lecture").html("slide " + slide + " (" + 71 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "5,18,23,39,44,50");
                }
                if (slide == '12-12') {
                    $("#e-lecture").html("slide " + slide + " (" + 72 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "5,18,23,39,44,50");
                }
                if (slide == '12-13') {
                    $("#e-lecture").html("slide " + slide + " (" + 73 + "%)");
                    $('#title-Quick').click();
                    changeSortType(gw.quickSort, "4,1,3,2,6,5,7");
                }
                if (slide == '13') {
                    $("#e-lecture").html("slide " + slide + " (" + 74 + "%)");
                    $('#title-RandomizedQuick').click();
                    changeSortType(gw.randomizedQuickSort, DEFAULT_DATA);
                }
                if (slide == '13-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 75 + "%)");

                }
                if (slide == '13-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 77 + "%)");

                }
                if (slide == '14') {
                    $("#e-lecture").html("slide " + slide + " (" + 78 + "%)");
                    $('#title-Counting').click();
                }
                if (slide == '14-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 79 + "%)");
                    $('#title-Counting').click();
                }
                if (slide == '15') {
                    $("#e-lecture").html("slide " + slide + " (" + 80 + "%)");
                    $('#title-Counting').click();
                }
                if (slide == '16') {
                    $("#e-lecture").html("slide " + slide + " (" + 81 + "%)");
                    $('#title-Radix').click();
                }
                if (slide == '16-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 83 + "%)");
                    $('#title-Radix').click();
                }
                if (slide == '16-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 84 + "%)");
                    $('#title-Radix').click();
                }
                if (slide == '17') {
                    $("#e-lecture").html("slide " + slide + " (" + 85 + "%)");

                }
                if (slide == '17-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 86 + "%)");

                }
                if (slide == '17-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 87 + "%)");

                }
                if (slide == '17-3') {
                    $("#e-lecture").html("slide " + slide + " (" + 89 + "%)");

                }
                if (slide == '18') {
                    $("#e-lecture").html("slide " + slide + " (" + 90 + "%)");

                }
                if (slide == '18-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 91 + "%)");

                }
                if (slide == '18-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 92 + "%)");

                }
                if (slide == '19') {
                    $("#e-lecture").html("slide " + slide + " (" + 93 + "%)");

                }
                if (slide == '19-1') {
                    $("#e-lecture").html("slide " + slide + " (" + 95 + "%)");

                }
                if (slide == '19-2') {
                    $("#e-lecture").html("slide " + slide + " (" + 96 + "%)");

                }
                if (slide == '19-3') {
                    $("#e-lecture").html("slide " + slide + " (" + 97 + "%)");

                }
                if (slide == '19-4') {
                    $("#e-lecture").html("slide " + slide + " (" + 98 + "%)");

                }
                if (slide == '19-5') {
                    $("#e-lecture").html("slide " + slide + " (" + 100 + "%)");

                }
                clearTimeout(currSlideTimer);
            }

            window.onpopstate = function (event) {
                var slide = event.state['slide'];
                openSlide(slide, function () {
                    runSlide(slide);
                });
            };

            function getUrlParameter(sParam) {
                var sPageURL = decodeURIComponent(window.location.search.substring(1)),
                    sURLVariables = sPageURL.split('&'), sParameterName, i;

                for (i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split('=');
                    if (sParameterName[0] === sParam) return sParameterName[1] === undefined ? true : sParameterName[1];
                }
            };
            var slideTimeline = {};

            //reads all visited slides in the slideTimeline and gives them their sector color
            function setVisitedSlideTimelineColors() {
                for (const [sectionNo, visitedSlides] of Object.entries(slideTimeline)) {
                    const visitedSlides = slideTimeline[sectionNo];
                    for (const visitedSlideNo of visitedSlides) {
                        setSlideTimelineColor(visitedSlideNo);
                    }
                }
            }

            //only called on load if there is nothing in session
            function setTimelineForCompletedSector(sectorNum) {
                let len = sectorLength;
                switch (sectorNum) {
                    case 1: len = sectorLength; break;
                    case 2: len = 2 * sectorLength; break;
                    default: len = numSlides;
                }
                let i = 0;
                switch (sectorNum) {
                    case 1: i = 0; break;
                    case 2: i = sectorLength; break;
                    default: i = 2 * sectorLength;
                }
                for (; i < len; i++) {
                    saveELectureTimeline(lectureIds[i].value, true);
                }
            }

            function getUserSectorHistory(callback) {
                $.ajax({
                    type: 'GET',
                    url: "https://visualgo.net/section-info",
                    data: {
                        _token: "xRrjVhfriSU07G42ZE5DTCkNrVfBP8Fiv8mNOSa8",
                        topic: "/sorting".substring(1)
                    }
                }
                ).done(function (data) {
                    if (data.data[0] === 1) {
                        setF1SectorColor(1);
                        setTimelineForCompletedSector(1);
                    }
                    if (data.data[1] === 1) {
                        setF1SectorColor(2);
                        setTimelineForCompletedSector(2);
                    }
                    if (data.data[2] === 1) {
                        setF1SectorColor(3);
                        setTimelineForCompletedSector(3);
                    }
                    callback();
                }).fail(function (data) {
                    console.log('get user sector history failed!');
                });
            }

            function getELectureTimelineFromSession() {
                const page = "/sorting".substring(1);
                const timelineKey = page + '-slide-timeline';
                const storedTimeline = window.sessionStorage.getItem(timelineKey);
                if (storedTimeline) {
                    slideTimeline = JSON.parse(storedTimeline);
                } else {
                    return false;
                }
                let slideInfo = [];
                for (const [sectionNum, slides] of Object.entries(slideTimeline)) {
                    for (const slide of slides) {
                        indicateSlideCompletedUI(slide);
                        slideInfo = slide.split('-');
                        incrementSectorVisits(parseInt(sectionNum), slideInfo.length > 1 ? parseInt(slideInfo[1]) : 0);
                    }
                }
                return true;
            }

            async function initializeELectureTimeline() {
                setSectorJunctionInfo();
                if (!getELectureTimelineFromSession())
                    getUserSectorHistory(sectorBasedModeSelection);
                else
                    sectorBasedModeSelection();

                createELectureTimelineDisplay();
                setVisitedSlideTimelineColors();
            }

            function setF1SectorColor(sectorNum) {
                $(`[sectorNo="${sectorNum}"]`).css('background', sectorColors[(parseInt(sectorNum) % 3)]);
            }

            function updateSectorInDB(sectorNum) {
                $.ajax({
                    type: 'POST',
                    url: "https://visualgo.net/section-info",
                    data: {
                        _token: "xRrjVhfriSU07G42ZE5DTCkNrVfBP8Fiv8mNOSa8",
                        section: (sectorNum - 1),
                        topic: "/sorting".substring(1)
                    }
                }
                ).done(function (data) {
                    //console.log("Saved the sector " + sectorNum + " as done " + JSON.stringify(data));
                }).fail(function (data) {
                    console.log("Setting sector done failed new attempt! " + JSON.stringify(data));
                });
            }

            //If 87.5% or more of the slides in sector are done
            function setF1SectorCompleted(sectorNum, isInitializationCall) {
                setF1SectorColor(sectorNum);
                //avoid api call on initialization
                if (!isInitializationCall) {
                    updateSectorInDB(sectorNum);
                    $(`[sectorNo="${sectorNum}"]`).css("animation", "green-pulse 2s 4");
                    setTimeout(() => {
                        $(`[sectorNo="${sectorNum}"]`).css("animation", "");
                    }, 8000);
                }
            }

            function incrementSectorVisits(sectionNum, slideNumWithinSection, isInitializationCall) {
                //updating sector count
                if (sectionNum < sectorJunction12Section
                    || (sectionNum === sectorJunction12Section && slideNumWithinSection <= sectorJunction12Slide)) {
                    ++sector1Count;
                    if (sector1Count >= Math.ceil(0.875 * sectorLength))
                        setF1SectorCompleted(1, isInitializationCall);
                } else if (sectionNum < sectorJunction23Section
                    || (sectionNum === sectorJunction23Section && slideNumWithinSection <= sectorJunction23Slide)) {
                    ++sector2Count;
                    if (sector2Count >= Math.ceil(0.875 * sectorLength))
                        setF1SectorCompleted(2, isInitializationCall);
                } else {
                    ++sector3Count;
                    if (sector3Count >= Math.ceil(0.875 * (numSlides - 2 * sectorLength)))
                        setF1SectorCompleted(3, isInitializationCall);
                }
            }

            function saveELectureTimeline(slideNo, isInitialization) {
                const slideInfo = slideNo.split('-');
                const sectionNo = slideInfo[0];
                const slideNumWithinSection = slideInfo.length > 1 ? parseInt(slideInfo[1]) : 0;
                if (slideTimeline[sectionNo]) {
                    if (!slideTimeline[sectionNo].includes(slideNo)) {
                        slideTimeline[sectionNo].push(slideNo);
                        const sectionNum = parseInt(sectionNo);
                        incrementSectorVisits(sectionNum, slideNumWithinSection, isInitialization);
                    }
                } else {
                    slideTimeline[sectionNo] = [];
                    slideTimeline[sectionNo].push(slideNo);
                    const sectionNum = parseInt(sectionNo);
                    incrementSectorVisits(sectionNum, slideNumWithinSection, isInitialization);
                }
                setSlideTimelineColor(slideNo);
                indicateSlideCompletedUI(slideNo);
            }

            function saveELectureTimelineToSession() {
                const page = "/sorting".substring(1);
                const timelineKey = page + '-slide-timeline';
                window.sessionStorage.setItem(timelineKey, JSON.stringify(slideTimeline));
            }

            function handleTimelineOnRunSlide(slideValue) {
                const slideInfo = slideValue.split('-');
                const sectionNo = slideInfo[0];
                const slideNumWithinSection = slideInfo.length > 1 ? parseInt(slideInfo[1]) : 0;
                //start timer only if the slide isnt already done
                if (!slideTimeline[sectionNo] || !slideTimeline[sectionNo].includes(slideValue)) {
                    const slideTextLength = $('#electure-' + slideValue + " p").text().length + $('#electure-' + slideValue + " li").text().length;
                    const CHARS_READ_PER_MS = 0.05; //when fast, 50 characters a second
                    //setting max reading time as 10 seconds for around 500 character slide
                    const minSlideReadingTime = Math.min(Math.max(2000, (slideTextLength / CHARS_READ_PER_MS) + + (2000 * $('#electure-' + slideValue + " img").length)), 10000);
                    currSlideTimer = setTimeout(() => {
                        saveELectureTimeline(slideValue);
                    }, minSlideReadingTime);
                }
            }

            function indicateSlideCompletedUI(slide) {
                $('#electure-' + slide).css("box-shadow", "3px 3px 8px green"); //set green shadow for completed slides
                $('#electure-' + slide + ' .electure-read-status').html("&#10004;");
                $('#electure-' + slide + ' .electure-read-status').attr("title", "Slide Completed!");
                $('#electure-' + slide + ' .electure-read-status').css("font-size", "17px");
            }

            function pushState(slideValue) {
                var url = '/en/sorting';
                if (typeof slideValue != 'undefined' && slideValue != null) {
                    url += '?slide=' + slideValue;
                }
                window.history.pushState({ slide: slideValue }, "slide " + slideValue, url);
            }

            function showPopup(callback) {
                $('#popup').fadeIn(100, callback);
            }

            function hidePopup(callback) {
                $('#popup').fadeOut(100, callback);
            }

            function showOverlay() {
                $('#overlay').css('opacity', 0.5);
                $('#overlay').show();

                $("#e-lecture-timeline").show();
                $("#e-lecture-f1map").show();
            }

            function hideOverlay() {
                $('#overlay').hide();
                $("#e-lecture").html("");
                $("#e-lecture-timeline").hide();
                $("#e-lecture-f1map").hide();
                clearTimeout(currSlideTimer);
            }

            function makeOverlayTransparent() {
                $('#overlay').css('opacity', 0);
            }

            function hideSlide(callback) {
                isPlaying = true;
                closeSlide(cur_slide, function () {
                    makeOverlayTransparent();
                    setTimeout(callback, 700); // don't immediately run the animation, wait for 500ms+ first
                });
            }

            function showSlide() {
                isPlaying = false;
                openSlide(cur_slide);
                showOverlay();
            }

            function sectorBasedModeSelection() {
                const urlSearchParams = new URLSearchParams(window.location.search);
                const params = Object.fromEntries(urlSearchParams.entries());
                //check params are empty and then that all sectors are completed or not
                if (!Object.keys(params).length
                    && sector1Count === sectorLength && sector2Count === sectorLength && sector3Count === (numSlides - 2 * sectorLength)) {
                    hideOverlay();
                }
                else
                    $('#mode-menu a').click();
            }

            $(function () {
                if (isMobileOS() && portraitMatcher.matches) {
                    $('#rotateDeviceOverlay').show();
                    $('#rotateDeviceText').show();
                    $('#widenDeviceText').hide();
                    $('#topbar').css("z-index", 10001);
                } else if (matchMediaNarrow.matches) {
                    $('#rotateDeviceOverlay').show();
                    $('#rotateDeviceText').hide();
                    $('#widenDeviceText').show();
                    $('#topbar').css("z-index", 10001);
                } else {
                    $('#rotateDeviceOverlay').hide();
                    $('#topbar').css("z-index", "");
                }

                matchMediaNarrow.addEventListener('change', e => {
                    //screws up for square device! NEED RESIZE EVENT
                    if (e.matches) {
                        if ($('#rotateDeviceOverlay').is(":hidden")) {
                            $('#rotateDeviceOverlay').show();
                            $('#rotateDeviceText').hide();
                            $('#widenDeviceText').show();
                            $('#topbar').css("z-index", 10001);
                        }
                    } else {
                        $('#rotateDeviceOverlay').hide();
                        $('#topbar').css("z-index", "");
                    }
                });
                portraitMatcher.addEventListener('change', e => {
                    if (e.matches && isMobileOS()) {
                        if ($('#rotateDeviceOverlay').is(":hidden")) {
                            $('#rotateDeviceOverlay').show();
                            $('#rotateDeviceText').show();
                            $('#widenDeviceText').hide();
                            $('#topbar').css("z-index", 10001);
                        }
                    } else {
                        $('#rotateDeviceOverlay').hide();
                        $('#topbar').css("z-index", "");
                    }
                });
                const urlSearchParams = new URLSearchParams(window.location.search);
                const params = Object.fromEntries(urlSearchParams.entries());
                let slide = getUrlParameter('slide');
                if (typeof slide !== undefined && slide != null) {
                    cur_slide = slide;
                }
                //do all timeline and slide stuff only if specific params not provided
                if (!Object.keys(params).length || params["slide"]) {
                    if (!isMobile()) {
                        $('#mode-menu a').click();
                    }
                }
                $('.mcq-submit').click(function () {
                    var questionId = parseInt($(this).attr('id').split('-')[1]);
                    var answer = $('#mcq-answer-' + questionId).val();
                    var userAnswer = $('input[type=radio][name=mcq-' + questionId + '-choice]:checked').val();

                    if (answer === userAnswer) {
                        $('#answer-status-' + questionId).html('<font color="green"><b>Correct!</b></font>');
                    }
                    else {
                        $('#answer-status-' + questionId).html('<font color="red"><b>Wrong Answer! Try again...</b></font>');
                    }
                    $('#answer-status-' + questionId).show();
                    setTimeout(function () {
                        $('#answer-status-' + questionId).fadeOut(1000);
                    }, 1000);
                });

                $('.msq-submit').click(function () {
                    var questionId = parseInt($(this).attr('id').split('-')[1]);
                    var answer = $('#msq-answer-' + questionId).val();

                    var answers = [];
                    $('input[type=checkbox][class=msq-choice]:checked').each(function () {
                        answers.push($(this).attr('id').split('-')[3]);
                    });
                    answers.sort();
                    var userAnswer = answers.join(',');

                    if (answer === userAnswer) {
                        $('#answer-status-' + questionId).html('<font color="green">Correct!</font>');
                    }
                    else {
                        $('#answer-status-' + questionId).html('<font color="red">Wrong Answer! Try again...</font>');
                    }
                    $('#answer-status-' + questionId).show();
                    setTimeout(function () {
                        $('#answer-status-' + questionId).fadeOut(1000);
                    }, 1000);
                });

                $('select.lecture-dropdown').change(function () {
                    var nextSlide = $(this).val();
                    openSlide(nextSlide, function () {
                        runSlide(nextSlide);
                        pushState(nextSlide);
                    });
                });

                $('#hide-popup').click(function () {
                    hidePopup();
                });

                $('#popup').hover(function () {
                    $('#hide-popup').show();
                }, function () {
                    $('#hide-popup').hide();
                });

                $('#electure-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('1-1');
                    pushState('1-1');
                });
                $('#electure-1-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('1-2');
                    pushState('1-2');
                });
                $('#electure-1-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('1');
                    pushState('1');
                });
                $('#electure-1-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('1-3');
                    pushState('1-3');
                });
                $('#electure-1-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('1-1');
                    pushState('1-1');
                });
                $('#electure-1-3 .electure-next').click(function () {
                    hidePopup();
                    runSlide('2');
                    pushState('2');
                });
                $('#electure-1-3 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('1-2');
                    pushState('1-2');
                });
                $('#electure-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('2-1');
                    pushState('2-1');
                });
                $('#electure-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('1-3');
                    pushState('1-3');
                });
                $('#electure-2-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('2-2');
                    pushState('2-2');
                });
                $('#electure-2-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('2');
                    pushState('2');
                });
                $('#electure-2-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('3');
                    pushState('3');
                });
                $('#electure-2-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('2-1');
                    pushState('2-1');
                });
                $('#electure-3 .electure-next').click(function () {
                    hidePopup();
                    runSlide('4');
                    pushState('4');
                });
                $('#electure-3 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('2-2');
                    pushState('2-2');
                });
                $('#electure-4 .electure-next').click(function () {
                    hidePopup();
                    runSlide('4-1');
                    pushState('4-1');
                });
                $('#electure-4 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('3');
                    pushState('3');
                });
                $('#electure-4-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('5');
                    pushState('5');
                });
                $('#electure-4-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('4');
                    pushState('4');
                });
                $('#electure-5 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6');
                    pushState('6');
                });
                $('#electure-5 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('4-1');
                    pushState('4-1');
                });
                $('#electure-6 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-1');
                    pushState('6-1');
                });
                $('#electure-6 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('5');
                    pushState('5');
                });
                $('#electure-6-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-2');
                    pushState('6-2');
                });
                $('#electure-6-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6');
                    pushState('6');
                });
                $('#electure-6-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-3');
                    pushState('6-3');
                });
                $('#electure-6-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-1');
                    pushState('6-1');
                });
                $('#electure-6-3 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-4');
                    pushState('6-4');
                });
                $('#electure-6-3 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-2');
                    pushState('6-2');
                });
                $('#electure-6-4 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-5');
                    pushState('6-5');
                });
                $('#electure-6-4 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-3');
                    pushState('6-3');
                });
                $('#electure-6-5 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-6');
                    pushState('6-6');
                });
                $('#electure-6-5 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-4');
                    pushState('6-4');
                });
                $('#electure-6-6 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-7');
                    pushState('6-7');
                });
                $('#electure-6-6 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-5');
                    pushState('6-5');
                });
                $('#electure-6-7 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-8');
                    pushState('6-8');
                });
                $('#electure-6-7 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-6');
                    pushState('6-6');
                });
                $('#electure-6-8 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-9');
                    pushState('6-9');
                });
                $('#electure-6-8 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-7');
                    pushState('6-7');
                });
                $('#electure-6-9 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-10');
                    pushState('6-10');
                });
                $('#electure-6-9 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-8');
                    pushState('6-8');
                });
                $('#electure-6-10 .electure-next').click(function () {
                    hidePopup();
                    runSlide('6-11');
                    pushState('6-11');
                });
                $('#electure-6-10 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-9');
                    pushState('6-9');
                });
                $('#electure-6-11 .electure-next').click(function () {
                    hidePopup();
                    runSlide('7');
                    pushState('7');
                });
                $('#electure-6-11 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-10');
                    pushState('6-10');
                });
                $('#electure-7 .electure-next').click(function () {
                    hidePopup();
                    runSlide('7-1');
                    pushState('7-1');
                });
                $('#electure-7 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('6-11');
                    pushState('6-11');
                });
                $('#electure-7-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('7-2');
                    pushState('7-2');
                });
                $('#electure-7-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('7');
                    pushState('7');
                });
                $('#electure-7-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('7-3');
                    pushState('7-3');
                });
                $('#electure-7-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('7-1');
                    pushState('7-1');
                });
                $('#electure-7-3 .electure-next').click(function () {
                    hidePopup();
                    runSlide('8');
                    pushState('8');
                });
                $('#electure-7-3 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('7-2');
                    pushState('7-2');
                });
                $('#electure-8 .electure-next').click(function () {
                    hidePopup();
                    runSlide('8-1');
                    pushState('8-1');
                });
                $('#electure-8 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('7-3');
                    pushState('7-3');
                });
                $('#electure-8-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('8-2');
                    pushState('8-2');
                });
                $('#electure-8-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('8');
                    pushState('8');
                });
                $('#electure-8-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('9');
                    pushState('9');
                });
                $('#electure-8-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('8-1');
                    pushState('8-1');
                });
                $('#electure-9 .electure-next').click(function () {
                    hidePopup();
                    runSlide('9-1');
                    pushState('9-1');
                });
                $('#electure-9 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('8-2');
                    pushState('8-2');
                });
                $('#electure-9-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('9-2');
                    pushState('9-2');
                });
                $('#electure-9-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('9');
                    pushState('9');
                });
                $('#electure-9-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('9-3');
                    pushState('9-3');
                });
                $('#electure-9-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('9-1');
                    pushState('9-1');
                });
                $('#electure-9-3 .electure-next').click(function () {
                    hidePopup();
                    runSlide('10');
                    pushState('10');
                });
                $('#electure-9-3 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('9-2');
                    pushState('9-2');
                });
                $('#electure-10 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11');
                    pushState('11');
                });
                $('#electure-10 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('9-3');
                    pushState('9-3');
                });
                $('#electure-11 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-1');
                    pushState('11-1');
                });
                $('#electure-11 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('10');
                    pushState('10');
                });
                $('#electure-11-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-2');
                    pushState('11-2');
                });
                $('#electure-11-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11');
                    pushState('11');
                });
                $('#electure-11-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-3');
                    pushState('11-3');
                });
                $('#electure-11-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-1');
                    pushState('11-1');
                });
                $('#electure-11-3 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-4');
                    pushState('11-4');
                });
                $('#electure-11-3 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-2');
                    pushState('11-2');
                });
                $('#electure-11-4 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-5');
                    pushState('11-5');
                });
                $('#electure-11-4 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-3');
                    pushState('11-3');
                });
                $('#electure-11-5 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-6');
                    pushState('11-6');
                });
                $('#electure-11-5 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-4');
                    pushState('11-4');
                });
                $('#electure-11-6 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-7');
                    pushState('11-7');
                });
                $('#electure-11-6 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-5');
                    pushState('11-5');
                });
                $('#electure-11-7 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-8');
                    pushState('11-8');
                });
                $('#electure-11-7 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-6');
                    pushState('11-6');
                });
                $('#electure-11-8 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-9');
                    pushState('11-9');
                });
                $('#electure-11-8 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-7');
                    pushState('11-7');
                });
                $('#electure-11-9 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-10');
                    pushState('11-10');
                });
                $('#electure-11-9 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-8');
                    pushState('11-8');
                });
                $('#electure-11-10 .electure-next').click(function () {
                    hidePopup();
                    runSlide('11-11');
                    pushState('11-11');
                });
                $('#electure-11-10 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-9');
                    pushState('11-9');
                });
                $('#electure-11-11 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12');
                    pushState('12');
                });
                $('#electure-11-11 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-10');
                    pushState('11-10');
                });
                $('#electure-12 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-1');
                    pushState('12-1');
                });
                $('#electure-12 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('11-11');
                    pushState('11-11');
                });
                $('#electure-12-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-2');
                    pushState('12-2');
                });
                $('#electure-12-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12');
                    pushState('12');
                });
                $('#electure-12-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-3');
                    pushState('12-3');
                });
                $('#electure-12-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-1');
                    pushState('12-1');
                });
                $('#electure-12-3 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-4');
                    pushState('12-4');
                });
                $('#electure-12-3 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-2');
                    pushState('12-2');
                });
                $('#electure-12-4 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-5');
                    pushState('12-5');
                });
                $('#electure-12-4 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-3');
                    pushState('12-3');
                });
                $('#electure-12-5 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-6');
                    pushState('12-6');
                });
                $('#electure-12-5 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-4');
                    pushState('12-4');
                });
                $('#electure-12-6 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-7');
                    pushState('12-7');
                });
                $('#electure-12-6 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-5');
                    pushState('12-5');
                });
                $('#electure-12-7 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-8');
                    pushState('12-8');
                });
                $('#electure-12-7 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-6');
                    pushState('12-6');
                });
                $('#electure-12-8 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-9');
                    pushState('12-9');
                });
                $('#electure-12-8 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-7');
                    pushState('12-7');
                });
                $('#electure-12-9 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-10');
                    pushState('12-10');
                });
                $('#electure-12-9 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-8');
                    pushState('12-8');
                });
                $('#electure-12-10 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-11');
                    pushState('12-11');
                });
                $('#electure-12-10 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-9');
                    pushState('12-9');
                });
                $('#electure-12-11 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-12');
                    pushState('12-12');
                });
                $('#electure-12-11 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-10');
                    pushState('12-10');
                });
                $('#electure-12-12 .electure-next').click(function () {
                    hidePopup();
                    runSlide('12-13');
                    pushState('12-13');
                });
                $('#electure-12-12 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-11');
                    pushState('12-11');
                });
                $('#electure-12-13 .electure-next').click(function () {
                    hidePopup();
                    runSlide('13');
                    pushState('13');
                });
                $('#electure-12-13 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-12');
                    pushState('12-12');
                });
                $('#electure-13 .electure-next').click(function () {
                    hidePopup();
                    runSlide('13-1');
                    pushState('13-1');
                });
                $('#electure-13 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('12-13');
                    pushState('12-13');
                });
                $('#electure-13-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('13-2');
                    pushState('13-2');
                });
                $('#electure-13-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('13');
                    pushState('13');
                });
                $('#electure-13-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('14');
                    pushState('14');
                });
                $('#electure-13-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('13-1');
                    pushState('13-1');
                });
                $('#electure-14 .electure-next').click(function () {
                    hidePopup();
                    runSlide('14-1');
                    pushState('14-1');
                });
                $('#electure-14 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('13-2');
                    pushState('13-2');
                });
                $('#electure-14-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('15');
                    pushState('15');
                });
                $('#electure-14-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('14');
                    pushState('14');
                });
                $('#electure-15 .electure-next').click(function () {
                    hidePopup();
                    runSlide('16');
                    pushState('16');
                });
                $('#electure-15 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('14-1');
                    pushState('14-1');
                });
                $('#electure-16 .electure-next').click(function () {
                    hidePopup();
                    runSlide('16-1');
                    pushState('16-1');
                });
                $('#electure-16 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('15');
                    pushState('15');
                });
                $('#electure-16-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('16-2');
                    pushState('16-2');
                });
                $('#electure-16-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('16');
                    pushState('16');
                });
                $('#electure-16-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('17');
                    pushState('17');
                });
                $('#electure-16-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('16-1');
                    pushState('16-1');
                });
                $('#electure-17 .electure-next').click(function () {
                    hidePopup();
                    runSlide('17-1');
                    pushState('17-1');
                });
                $('#electure-17 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('16-2');
                    pushState('16-2');
                });
                $('#electure-17-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('17-2');
                    pushState('17-2');
                });
                $('#electure-17-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('17');
                    pushState('17');
                });
                $('#electure-17-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('17-3');
                    pushState('17-3');
                });
                $('#electure-17-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('17-1');
                    pushState('17-1');
                });
                $('#electure-17-3 .electure-next').click(function () {
                    hidePopup();
                    runSlide('18');
                    pushState('18');
                });
                $('#electure-17-3 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('17-2');
                    pushState('17-2');
                });
                $('#electure-18 .electure-next').click(function () {
                    hidePopup();
                    runSlide('18-1');
                    pushState('18-1');
                });
                $('#electure-18 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('17-3');
                    pushState('17-3');
                });
                $('#electure-18-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('18-2');
                    pushState('18-2');
                });
                $('#electure-18-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('18');
                    pushState('18');
                });
                $('#electure-18-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('19');
                    pushState('19');
                });
                $('#electure-18-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('18-1');
                    pushState('18-1');
                });
                $('#electure-19 .electure-next').click(function () {
                    hidePopup();
                    runSlide('19-1');
                    pushState('19-1');
                });
                $('#electure-19 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('18-2');
                    pushState('18-2');
                });
                $('#electure-19-1 .electure-next').click(function () {
                    hidePopup();
                    runSlide('19-2');
                    pushState('19-2');
                });
                $('#electure-19-1 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('19');
                    pushState('19');
                });
                $('#electure-19-2 .electure-next').click(function () {
                    hidePopup();
                    runSlide('19-3');
                    pushState('19-3');
                });
                $('#electure-19-2 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('19-1');
                    pushState('19-1');
                });
                $('#electure-19-3 .electure-next').click(function () {
                    hidePopup();
                    runSlide('19-4');
                    pushState('19-4');
                });
                $('#electure-19-3 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('19-2');
                    pushState('19-2');
                });
                $('#electure-19-4 .electure-next').click(function () {
                    hidePopup();
                    runSlide('19-5');
                    pushState('19-5');
                });
                $('#electure-19-4 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('19-3');
                    pushState('19-3');
                });
                $('#electure-19-5 .electure-prev').click(function () {
                    hidePopup();
                    runSlide('19-4');
                    pushState('19-4');
                });
            });

            function doButtonAction7() {
                POPUP_IMAGE('https://open.kattis.com/images/site-logo');
            }
            function doButtonAction8() {
                SORT();
            }
            function doButtonAction10() {
                SORT();
            }
            function doButtonAction11() {
                SORT();
            }
            function doButtonAction12() {
                SORT();
            }
            function doButtonAction13() {
                SORT();
            }
            function doButtonAction14() {
                SORT();
            }
            function doButtonAction15() {
                SORT();
            }
            function doButtonAction16() {
                SORT();
            }
            function doButtonAction17() {
                URL('../training?diff=Medium&n=7&tl=0&module=sorting');
            }
            function doButtonAction18() {
                POPUP_IMAGE('https://pbs.twimg.com/profile_images/2618373647/image.jpg');
            }
            function doButtonAction19() {
                URL('../login');
            }
            function doButtonAction20() {
                POPUP_IMAGE('https://puu.sh/vfi6a/e532309371.png');
            }
            function doButtonAction33() {
                changeSortType(gw.bubbleSort, "7,6,5,4,3,2,1");
                SORT();
            }
            function doButtonAction95() {
                // add your code here
            }

            $('.electure-print').click(() => {
                window.open(`/en/sorting/print`);
            });
            function adjustPopupToImageSize() {
                var width = $('#popup-image').prop('width');
                var height = $('#popup-image').prop('height');
                $('#popup').width(width + 20);
                $('#popup').height(height + 20);
                if (width == 0 && height == 0) {
                    setTimeout(adjustPopupToImageSize, 200);
                } else {
                    showPopup();
                }
            }

            function POPUP_IMAGE(url) {
                $('#popup-content').html('<img id="popup-image" src="' + url + '">');
                adjustPopupToImageSize();
            }

            function URL(url) {
                window.open(url, '_blank');
            }

            // Implement these functions in each visualisation
            // This function will be called before entering e-Lecture Mode
            function ENTER_LECTURE_MODE() { }

            // This function will be called before returning to Explore Mode
            function ENTER_EXPLORE_MODE() { }

            // Lecture action functions
            function CUSTOM_ACTION(action, data, mode) { }

            $(document).ready(function () {
                setTimeout(function () {
                    $('#change-lang-popup').fadeOut('slow')
                }, 5000)
            })