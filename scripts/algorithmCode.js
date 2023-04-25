
            var Sorting = function () {
                var computeInversionIndex = true; // Quick hack on 26 Dec 2021, it will be true from now onwards for Bubble and Merge sort...

                // constants
                var HIGHLIGHT_NONE = "lightblue";
                var HIGHLIGHT_STANDARD = "green";
                var HIGHLIGHT_SPECIAL = "#DC143C";
                var HIGHLIGHT_SORTED = "orange";

                var HIGHLIGHT_LEFT = "#3CB371";
                var HIGHLIGHT_RIGHT = "#9932CC";
                var HIGHLIGHT_PIVOT = "yellow";

                var HIGHLIGHT_GRAY = "#CCCCCC";

                var HIGHLIGHT_RAINBOW = [
                    "#FF0000",
                    "#FF4000",
                    "#FF8000",
                    "#FFBF00",
                    "#FFFF00",
                    "#BFFF00",
                    "#80FF00",
                    "#40FF00",
                    //"#00FF00",
                    "#00FF40",
                    "#00FF80",
                    "#00FFBF",
                    "#00FFFF",
                    "#00BFFF",
                    "#0080FF",
                    "#0040FF",
                    "#0000FF",
                    "#4000FF",
                    "#8000FF",
                    "#BF00FF",
                    "#FF00FF"
                ];

                var HIGHLIGHT_BLUESHADES = [
                    HIGHLIGHT_GRAY,
                    HIGHLIGHT_NONE,
                    "#9DC4E8",
                    "#8EB1EB",
                    "#7E9DED",
                    "#6E89EF",
                    "#5E76F1",
                    "#4F62F4",
                    "#3F4FF6",
                    "#2F3BF8",
                    "#1F27FA",
                    "#1014FD",
                    "#0000FF",
                    "#0000FF",
                    "#0000FF",
                    "#0000FF",
                    "#0000FF",
                    "#0000FF",
                    "#0000FF",
                    "#0000FF",
                    "#0000FF"
                ];

                var POSITION_USE_PRIMARY = "a";
                var POSITION_USE_SECONDARY_IN_DEFAULT_POSITION = "b";

                // Objects definition
                var Entry = function (value, highlight, position, secondaryPositionStatus) {
                    this.value = value; // number
                    this.highlight = highlight; // string, use HIGHLIGHT_ constants
                    this.position = position; // number
                    this.secondaryPositionStatus = secondaryPositionStatus; // integer, +ve for position overwrite, -ve for absolute postion (-1 for 0th absolution position)
                }

                var Backlink = function (value, highlight, entryPosition, secondaryPositionStatus) {
                    this.value = value; // number
                    this.highlight = highlight; // string, use HIGHLIGHT_ constants
                    this.entryPosition = entryPosition; // number
                    this.secondaryPositionStatus = secondaryPositionStatus; // integer, +ve for position overwrite
                }

                var State = function (entries, backlinks, barsCountOffset, status, lineNo) {
                    this.entries = entries; // array of Entry's
                    this.backlinks = backlinks; // array of Backlink's
                    this.barsCountOffset = barsCountOffset; // how many bars to "disregard" (+ve) or to "imagine" (-ve) w.r.t. state.entries.length when calculating the centre position
                    this.status = status;
                    this.lineNo = lineNo; //integer or array, line of the code to highlight
                }

                //Helpers
                var EntryBacklinkHelper = new Object();
                EntryBacklinkHelper.appendList = function (entries, backlinks, numArray) {
                    for (var i = 0; i < numArray.length; ++i) {
                        EntryBacklinkHelper.append(entries, backlinks, numArray[i]);
                    }
                }

                EntryBacklinkHelper.append = function (entries, backlinks, newNumber) {
                    entries.push(new Entry(newNumber, HIGHLIGHT_NONE, entries.length, POSITION_USE_PRIMARY));
                    backlinks.push(new Backlink(newNumber, HIGHLIGHT_NONE, backlinks.length, POSITION_USE_PRIMARY));
                }

                EntryBacklinkHelper.update = function (entries, backlinks) {
                    for (var i = 0; i < backlinks.length; ++i) {
                        entries[backlinks[i].entryPosition].highlight = backlinks[i].highlight;
                        entries[backlinks[i].entryPosition].position = i;
                        entries[backlinks[i].entryPosition].secondaryPositionStatus = backlinks[i].secondaryPositionStatus;
                    }
                }

                EntryBacklinkHelper.copyEntry = function (oldEntry) {
                    return new Entry(oldEntry.value, oldEntry.highlight, oldEntry.position, oldEntry.secondaryPositionStatus);
                }

                EntryBacklinkHelper.copyBacklink = function (oldBacklink) {
                    return new Backlink(oldBacklink.value, oldBacklink.highlight, oldBacklink.entryPosition, oldBacklink.secondaryPositionStatus);
                }

                EntryBacklinkHelper.swapBacklinks = function (backlinks, i, j) {
                    var swaptemp = backlinks[i];
                    backlinks[i] = backlinks[j];
                    backlinks[j] = swaptemp;
                }

                var StateHelper = new Object();
                StateHelper.createNewState = function (numArray) {
                    var entries = new Array();
                    var backlinks = new Array();
                    EntryBacklinkHelper.appendList(entries, backlinks, numArray);
                    return new State(entries, backlinks, 0, "", 0);
                }

                StateHelper.copyState = function (oldState) {
                    var newEntries = new Array();
                    var newBacklinks = new Array();
                    for (var i = 0; i < oldState.backlinks.length; ++i) {
                        newEntries.push(EntryBacklinkHelper.copyEntry(oldState.entries[i]));
                        newBacklinks.push(EntryBacklinkHelper.copyBacklink(oldState.backlinks[i]));
                    }

                    var newLineNo = oldState.lineNo;
                    if (newLineNo instanceof Array)
                        newLineNo = oldState.lineNo.slice();

                    return new State(newEntries, newBacklinks, oldState.barsCountOffset, oldState.status, newLineNo);
                }

                StateHelper.updateCopyPush = function (list, stateToPush) {
                    EntryBacklinkHelper.update(stateToPush.entries, stateToPush.backlinks);
                    list.push(StateHelper.copyState(stateToPush));
                }

                var FunctionList = new Object();
                FunctionList.text_y = function (d) {
                    var barHeight = scaler(d.value);
                    if (barHeight < 32) return -15;
                    return barHeight - 15;
                }

                FunctionList.g_transform = function (d) {
                    if (d.secondaryPositionStatus == POSITION_USE_PRIMARY)
                        return 'translate(' + (centreBarsOffset + d.position * barWidth) + ", " + (maxHeight - scaler(d.value)) + ')';
                    else if (d.secondaryPositionStatus == POSITION_USE_SECONDARY_IN_DEFAULT_POSITION)
                        return 'translate(' + (centreBarsOffset + d.position * barWidth) + ", " + (maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows - scaler(d.value)) + ')';
                    else if (d.secondaryPositionStatus >= 0)
                        return 'translate(' + (centreBarsOffset + d.secondaryPositionStatus * barWidth) + ", " + (maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows - scaler(d.value)) + ')';
                    else if (d.secondaryPositionStatus < 0)
                        return 'translate(' + ((d.secondaryPositionStatus * -1 - 1) * barWidth) + ", " + (maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows - scaler(d.value)) + ')';
                    else
                        return 'translation(0, 0)'; // error
                }

                FunctionList.radixElement_left = function (d) {
                    if (d.secondaryPositionStatus == POSITION_USE_PRIMARY)
                        return d.position * 65 + centreBarsOffset + "px";
                    return d.secondaryPositionStatus * 65 + 17.5 + "px";
                }

                FunctionList.radixElement_bottom = function (d, i) {
                    if (d.secondaryPositionStatus == POSITION_USE_PRIMARY)
                        return 500 - 24 + "px";
                    //console.log(i + " " + radixSortBucketOrdering[i]);
                    return radixSortBucketOrdering[i] * 30 + 5 + "px";
                }

                FunctionList.radixElement_html = function (d) {
                    if (d.highlight == HIGHLIGHT_NONE)
                        return d.value;

                    var text = "" + d.value;
                    while (text.length != 4)
                        text = " " + text;

                    var positionToHighlight = 0; //positionToHighlight = log_to_base_10(d.highlight), assumes d.highlight is power of 10
                    var positionCounter = d.highlight;
                    while (positionCounter != 1) {
                        positionToHighlight++;
                        positionCounter /= 10;
                    }

                    positionToHighlight = 3 - positionToHighlight;

                    if (text.charAt(positionToHighlight) != " ") {
                        text = text.slice(0, positionToHighlight) +
                            "<span style='color: #B40404;'>" +
                            text.charAt(positionToHighlight) +
                            "</span>" +
                            text.slice(positionToHighlight + 1);
                    }

                    text = text.trim();
                    return text;
                }

                var makePaler = function (hexColor) {
                    var red = Math.floor(parseInt(hexColor.slice(1, 3), 16) + 150);
                    var green = Math.floor(parseInt(hexColor.slice(3, 5), 16) + 150);
                    var blue = Math.floor(parseInt(hexColor.slice(5, 7), 16) + 150);

                    if (red > 255) red = 255;
                    if (green > 255) green = 255;
                    if (blue > 255) blue = 255;

                    red = red.toString(16);
                    green = green.toString(16);
                    blue = blue.toString(16);

                    if (red.length == 1) red = "0" + red;
                    if (green.length == 1) green = "0" + green;
                    if (blue.length == 1) blue = "0" + blue;
                    return "#" + red + green + blue;
                }

                // Variables/Settings
                this.currentNumList = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48]; // the default

                var barWidth = 50;
                var maxHeight = 230;
                var gapBetweenBars = 5;
                var maxNumOfElements = 18; // dropped from 20 to 15 on 25 Feb, changed to 18 on 18 Mar (otherwise too far left after mobile design integration)
                var gapBetweenPrimaryAndSecondaryRows = 120; // 30; // of the bars

                var maxCountingSortElementValue = 9; // Note that this isn't really customizable, as the code for counting sort is written with this value = 9 in mind.
                var maxRadixSortElementValue = 9999; // Note that this isn't really customizable, as the code for radix sort is written with this value = 9999 in mind.
                var maxElementValue = 50; // for all other sorts - this is fully customizable (seriously)

                var graphElementSize = 10; // The width of the square in the side-graph representing 1 element
                var graphElementGap = 2; // The width of the gap between each element in the side-graph
                var graphRowGap = 10; // The height of the gap between each row in the side graph

                //Code body
                var statelist = new Array();
                var secondaryStatelist = new Array();
                var transitionTime = 500;
                var currentStep = 0;
                var animInterval;
                var issPlaying; //so named so as not to mess with the isPlaying in viz.js

                var quickSortUseRandomizedPivot; //true-false flag
                var mergeSortInversionIndexCounter; //used by merge sort to count the inversion index
                var centreBarsOffset; // x offset to centre the bars in the canvas
                var radixSortBucketOrdering; // used to order the elements inside each bucket (for radix sort). for formatting purposes.

                var isRadixSort = false;
                var isCountingSort = false;

                this.selectedSortFunction;
                // this.useEnhancedBubbleSort = false;
                // this.computeInversionIndex = false; // Quick hack on 26 Dec 2021, it will be true from now onwards for Bubble and Merge sort...

                var canvas = d3.select("#viz")
                    .attr("height", maxHeight * 2 + gapBetweenPrimaryAndSecondaryRows)
                    .attr("width", barWidth * maxNumOfElements);

                var countingSortSecondaryCanvas = d3.select("#viz-counting-sort-secondary-canvas")
                    .attr("height", 30) // 25 Feb, previously 60
                    .attr("width", barWidth * maxNumOfElements);

                var radixSortCanvas = d3.select("#viz-radix-sort-canvas");

                var scaler = d3.scale
                    .linear()
                    .range([0, maxHeight]);

                var drawState = function (stateIndex) {
                    if (isCountingSort)
                        maxHeight = 230; // /2; // make the bars shorter by half for counting sort
                    else
                        maxHeight = 230;

                    if (isRadixSort)
                        drawRadixSortCanvas(statelist[stateIndex], secondaryStatelist[stateIndex]);
                    else
                        drawBars(statelist[stateIndex]);

                    $('#status p').html(statelist[stateIndex].status);
                    highlightLine(statelist[stateIndex].lineNo);

                    if (isCountingSort)
                        drawCountingSortCounters(secondaryStatelist[stateIndex]);
                };

                var drawBars = function (state) {
                    scaler.domain([0, d3.max(state.entries, function (d) {
                        return d.value;
                    })]);

                    centreBarsOffset = (maxNumOfElements - (state.entries.length - state.barsCountOffset)) * barWidth / 2;

                    var canvasData = canvas.selectAll("g").data(state.entries);

                    // Exit ==============================
                    var exitData = canvasData.exit()
                        .remove();

                    // Entry ==============================
                    var newData = canvasData.enter()
                        .append("g")
                        .attr("transform", FunctionList.g_transform);

                    newData.append("rect")
                        .attr("height", 0)
                        .attr("width", 0);

                    newData.append("text")
                        .attr("dy", ".35em")
                        .attr("x", (barWidth - gapBetweenBars) / 2)
                        .attr("y", FunctionList.text_y)
                        .text(function (d) {
                            return d.value;
                        });

                    // Update ==============================
                    canvasData.select("text")
                        .transition()
                        .attr("y", FunctionList.text_y)
                        .text(function (d, i) {
                            return d.value;
                        });

                    canvasData.select("rect")
                        .transition()
                        .attr("height", function (d) {
                            return scaler(d.value);
                        })
                        .attr("width", barWidth - gapBetweenBars)
                        .style("fill", function (d) {
                            return d.highlight;
                        });

                    canvasData.transition()
                        .attr("transform", FunctionList.g_transform)
                };

                var drawCountingSortCounters = function (state) {
                    var canvasData;
                    if (state == null)
                        canvasData = countingSortSecondaryCanvas.selectAll("text").data([]);
                    else
                        canvasData = countingSortSecondaryCanvas.selectAll("text").data(state);

                    // Exit ==============================
                    var exitData = canvasData
                        .exit()
                        .remove();

                    // Entry ==============================

                    var newData = canvasData
                        .enter()
                        .append("text")
                        .attr("dy", ".35em")
                        .attr("x", function (d, i) {
                            return -235 + (i + 5) * barWidth + (barWidth - gapBetweenBars) / 2; // this one controls the frequency text for counting sort, offset -235 to make it go a bit to the left?
                        })
                        .attr("y", 10) // 25 Feb, previously 20
                        .text(function (d) {
                            return d;
                        });

                    // Update ==============================

                    canvasData
                        .transition()
                        .text(function (d) {
                            return d;
                        });
                };

                var drawRadixSortCanvas = function (state, secondaryState) {
                    centreBarsOffset = (1000 - (state.entries.length * 65 - 10)) / 2; //uh, it's not really bars now, but just reusing the variable - same concept still

                    var canvasData = radixSortCanvas.selectAll("div").data(state.entries);
                    var radixSortBucketCount = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    radixSortBucketOrdering = new Array(state.backlinks.length);

                    for (var i = 0; i < state.backlinks.length; ++i) {
                        if (state.backlinks.secondaryPositionStatus != POSITION_USE_PRIMARY)
                            radixSortBucketOrdering[state.backlinks[i].entryPosition] = radixSortBucketCount[state.backlinks[i].secondaryPositionStatus]++;
                    }

                    // Handle the buckets' DIV's
                    if (secondaryState)
                        $("#radix-sort-bucket-labels-collection").show();
                    else
                        $("#radix-sort-bucket-labels-collection").hide();

                    // Exit ==============================
                    var exitData = canvasData.exit()
                        .remove();

                    // Entry ==============================
                    var newData = canvasData.enter()
                        .append("div")
                        .classed({ "radix-sort-element": true })
                        .style({
                            "left": FunctionList.radixElement_left,
                            "bottom": FunctionList.radixElement_bottom
                        })
                        .html(FunctionList.radixElement_html);

                    // Update ==============================
                    canvasData.html(FunctionList.radixElement_html)
                        .transition()
                        .style({
                            "left": FunctionList.radixElement_left,
                            "bottom": FunctionList.radixElement_bottom
                        });
                };

                var generateRandomNumberArray = function (size, limit) {
                    var numArray = new Array();
                    for (var i = 0; i < size; ++i) {
                        numArray.push(generateRandomNumber(1, limit));
                    }
                    return numArray;
                };

                var generateRandomNumber = function (min, max) { // generates a random integer between min and max (both inclusive)
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };

                var convertToNumber = function (num) {
                    return +num;
                };

                this.createList = function (type) {
                    var numArrayMaxListSize = 15; // on 25 Feb 2022, I lower this from 20 down to 15... (to make it nicer on mobile)
                    var numArrayMaxElementValue = maxElementValue;
                    if (this.selectedSortFunction == this.radixSort) {
                        numArrayMaxListSize = 15;
                        numArrayMaxElementValue = maxRadixSortElementValue;
                    }
                    else if (this.selectedSortFunction == this.countingSort) {
                        numArrayMaxElementValue = maxCountingSortElementValue;
                    }

                    var numArray = generateRandomNumberArray(generateRandomNumber(10, numArrayMaxListSize), numArrayMaxElementValue);
                    if (type.indexOf("many") != -1) {
                        var range = generateRandomNumber(1, 4); // 1, 2, 3, or 4 different numbers only
                        numArray = generateRandomNumberArray(generateRandomNumber(10, numArrayMaxListSize), range);
                    }

                    switch (type) {
                        case 'random':
                        case 'many-duplicates':
                            break; // already done above
                        case 'sorted-non-decreasing':
                        case 'nearly-sorted-non-decreasing':
                            numArray.sort(d3.ascending);
                            break;
                        case 'sorted-non-increasing':
                        case 'nearly-sorted-non-increasing':
                            numArray.sort(d3.descending);
                            break;
                        case 'userdefined':
                            numArray = $('#userdefined-input').val().split(",");

                            if (numArray.length > numArrayMaxListSize) {
                                $("#create-err").html('You can&#39;t have more than {maxSize} elements!'.replace("{maxSize}", numArrayMaxListSize));
                                return false;
                            }

                            for (var i = 0; i < numArray.length; ++i) {
                                var temp = convertToNumber(numArray[i]);

                                if (numArray[i].trim() == "") {
                                    $("#create-err").html('There seems to be a missing element (a duplicate comma somewhere perhaps?)');
                                    return false;
                                }
                                if (isNaN(temp)) {
                                    $("#create-err").html('There seems to be an invalid element (not a number): {num}.'.replace("{num}", numArray[i]));
                                    return false;
                                }
                                if (temp < 1 || temp > numArrayMaxElementValue) {
                                    $("#create-err").html('Sorry, you&#39;re restricted to values between 1 and {maxValue} inclusive. (Out of range number: {num}.)'.replace("{maxValue}", numArrayMaxElementValue).replace("{num}", numArray[i]));
                                    return false;
                                }

                                numArray[i] = convertToNumber(numArray[i]);
                            }
                            break;
                    }

                    if (type.indexOf("nearly") != -1) {
                        // To make the list nearly sorted, we take the already sorted list and make swaps
                        // such that the list becomes not sorted. The number of such swaps varies from 1 to 2 (customizable).
                        // The idea is that the more swaps we make, the less "sorted" the list is.
                        //
                        // Another limitation is that each swap occurs between elements that are at most 3 positions away.
                        while (true) {
                            var newNumArray = numArray.slice();

                            var numOfSwaps = generateRandomNumber(1, 2);
                            for (var i = 0; i < numOfSwaps; ++i) {
                                var firstSwappingIndex = generateRandomNumber(0, newNumArray.length - 4);
                                var secondSwappingIndex = generateRandomNumber(1, 3) + firstSwappingIndex;

                                var temp = numArray[firstSwappingIndex];
                                newNumArray[firstSwappingIndex] = numArray[secondSwappingIndex];
                                newNumArray[secondSwappingIndex] = temp;
                            }

                            // We compare the numArray with newNumArray, if they're are the same,
                            // we try again, else we reassign numArray to newNumArray and break.
                            var isEquals = true;
                            for (var i = 0; i < numArray.length; ++i) {
                                if (numArray[i] != newNumArray[i]) {
                                    isEquals = false;
                                    break;
                                }
                            }

                            if (!isEquals) {
                                numArray = newNumArray;
                                break;
                            }
                        }
                    }

                    this.loadNumberList(numArray);
                }

                this.loadNumberList = function (numArray) {
                    $("#create-err").html("");

                    issPlaying = false;
                    currentStep = 0;
                    this.currentNumList = numArray;

                    //console.log("numArray: " + numArray);

                    statelist = [StateHelper.createNewState(numArray)];
                    secondaryStatelist = [null]; // the initial secondary state will be an empty state
                    drawState(0);
                }

                this.setSelectedSortFunction = function (f) {
                    this.selectedSortFunction = f;
                    isRadixSort = (this.selectedSortFunction == this.radixSort);
                    isCountingSort = (this.selectedSortFunction == this.countingSort);
                }

                this.sort = function (callback) {
                    return this.selectedSortFunction(callback);
                }

                this.radixSort = function (callback) {
                    var numElements = statelist[0].backlinks.length;
                    var state = StateHelper.copyState(statelist[0]);

                    populatePseudocode([
                        'create 10 buckets (queues) for each digit (0 to 9)',
                        'for each digit placing',
                        '  for each element in list',
                        '    move element into respective bucket',
                        '  for each bucket, starting from smallest digit',
                        '    while bucket is non-empty',
                        '      restore element to list'
                    ]);

                    secondaryStatelist = [false]; // showBucket flag - if true, shows the DIV's representing the bucketss
                    var currentPlacing = 1;
                    var targetPlacing = 1;
                    var backlinkBuckets = [[], [], [], [], [], [], [], [], [], []];

                    var maxValue = d3.max(state.backlinks, function (d) {
                        return d.value;
                    });
                    while (maxValue >= 10) {
                        targetPlacing *= 10;
                        maxValue = Math.floor(maxValue / 10);
                    }

                    state.lineNo = 1;

                    for (; currentPlacing <= targetPlacing; currentPlacing *= 10) {
                        for (var i = 0; i < numElements; ++i)
                            state.backlinks[i].highlight = currentPlacing;

                        state.lineNo = 2;
                        state.status = 'Processing the {currentPlacing}'.replace('{currentPlacing}', currentPlacing == 1 ? 'Ones' : currentPlacing == 10 ? 'Tens' : currentPlacing == 100 ? 'Hundreds' : 'Thousands');
                        StateHelper.updateCopyPush(statelist, state);
                        secondaryStatelist.push(true);

                        for (var i = 0; i < numElements; ++i) {
                            var currentDigit = Math.floor(state.backlinks[i].value / currentPlacing) % 10;
                            state.backlinks[i].secondaryPositionStatus = currentDigit;
                            backlinkBuckets[currentDigit].push(state.backlinks[i]);
                            state.lineNo = [3, 4];
                            state.status = 'Moving {val} to bucket no {bucket}'.replace('{val}', state.backlinks[i].value).replace('{bucket}', currentDigit);
                            StateHelper.updateCopyPush(statelist, state);
                            secondaryStatelist.push(true);
                        }

                        for (var i = 0, j = 0; i <= 9;) {
                            if (backlinkBuckets[i].length == 0) {
                                ++i;
                                continue;
                            }

                            state.backlinks[j++] = backlinkBuckets[i].shift();
                        }

                        for (var i = 0; i < numElements; ++i) {
                            state.backlinks[i].secondaryPositionStatus = POSITION_USE_PRIMARY;
                            state.lineNo = [5, 6, 7];
                            state.status = 'Restoring element to position {i} in the list'.replace('{i}', i); // + state.backlinks[i]; //[i].secondaryPositionStatus;
                            StateHelper.updateCopyPush(statelist, state);
                            secondaryStatelist.push(true);
                        }
                    }

                    for (var i = 0; i < numElements; ++i)
                        state.backlinks[i].highlight = HIGHLIGHT_NONE;
                    state.lineNo = [];
                    state.status = 'We are done';
                    StateHelper.updateCopyPush(statelist, state);
                    secondaryStatelist.push(false);

                    this.play(callback);
                    return true;
                }

                this.countingSort = function (callback) {
                    // Note that while we have the maxCountingSortElementValue variable, it isn't really customizable.
                    // The code here written is really just for the range 1 to 9.

                    var numElements = statelist[0].backlinks.length;
                    var state = StateHelper.copyState(statelist[0]);

                    populatePseudocode([
                        'create key (counting) array',
                        'for each element in list',
                        '  increase the respective counter by 1',
                        'for each counter, starting from smallest key',
                        '  while counter is non-zero',
                        '    restore element to list',
                        '    decrease counter by 1'
                    ]);

                    var secondaryState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                    var backlinkBuckets = [[], [], [], [], [], [], [], [], []];

                    state.barsCountOffset = maxCountingSortElementValue;

                    for (var i = 1; i <= maxCountingSortElementValue; ++i) {
                        EntryBacklinkHelper.append(state.entries, state.backlinks, i);
                        state.backlinks[numElements + i - 1].highlight = HIGHLIGHT_GRAY;
                        state.backlinks[numElements + i - 1].secondaryPositionStatus = i * -1 - 5;
                    }

                    state.lineNo = 1;
                    state.status = 'Create the key (counting) array (from 1 to 9).';

                    StateHelper.updateCopyPush(statelist, state);
                    secondaryStatelist.push(secondaryState.slice()); // copy the array and push it into the secondary statelist

                    for (var i = 0; i < numElements; ++i) {
                        var currentValue = state.backlinks[i].value;

                        backlinkBuckets[currentValue - 1].push(state.backlinks[i]);

                        state.backlinks[i].secondaryPositionStatus = currentValue * -1 - 5;

                        ++secondaryState[currentValue - 1];

                        state.backlinks[currentValue + numElements - 1].highlight = HIGHLIGHT_BLUESHADES[secondaryState[currentValue - 1]];

                        state.lineNo = [2, 3];
                        state.status = 'Increase the counter with key {curVal} by 1.'.replace("{curVal}", currentValue);

                        StateHelper.updateCopyPush(statelist, state);
                        secondaryStatelist.push(secondaryState.slice()); // copy the array and push it into the secondary statelist
                    }

                    for (var i = 0, j = 0; i < maxCountingSortElementValue;) {
                        if (backlinkBuckets[i].length == 0) {
                            ++i;
                            continue;
                        }

                        state.backlinks[j++] = backlinkBuckets[i].shift();
                    }

                    for (var i = 0; i < numElements; ++i) {
                        var currentValue = state.backlinks[i].value;

                        state.backlinks[i].secondaryPositionStatus = POSITION_USE_PRIMARY;

                        --secondaryState[currentValue - 1];

                        state.backlinks[currentValue + numElements - 1].highlight = HIGHLIGHT_BLUESHADES[secondaryState[currentValue - 1]];

                        state.lineNo = [4, 5, 6, 7];
                        state.status = 'Restore element {curVal}, and decrease the counter with that key by 1.'.replace("{curVal}", currentValue);

                        StateHelper.updateCopyPush(statelist, state);
                        secondaryStatelist.push(secondaryState.slice()); //copy the array and push it into the secondary statelist
                    }

                    state.barsCountOffset = 0;

                    for (var i = 1; i <= maxCountingSortElementValue; ++i) {
                        state.entries.pop();
                        state.backlinks.pop();
                    }

                    state.lineNo = 0;
                    state.status = 'List is sorted!';
                    StateHelper.updateCopyPush(statelist, state);
                    secondaryStatelist.push(null); //copy the array and push it into the secondary statelist

                    this.play(callback);
                    return true;
                }

                this.randomizedQuickSort = function (callback) {
                    quickSortUseRandomizedPivot = true;
                    quickSortStart();

                    this.play(callback);
                    return true;
                }

                this.quickSort = function (callback) {
                    quickSortUseRandomizedPivot = false;
                    quickSortStart();

                    this.play(callback);
                    return true;
                }

                var quickSortStart = function () {
                    var numElements = statelist[0].backlinks.length;
                    var state = StateHelper.copyState(statelist[statelist.length - 1]);

                    populatePseudocode([
                        'for each (unsorted) partition',
                        (quickSortUseRandomizedPivot) ? 'randomly select pivot, swap with first element' : 'set first element as pivot',
                        '  storeIndex = pivotIndex+1',
                        '  for i = pivotIndex+1 to rightmostIndex',
                        '    if ((a[i] &lt; a[pivot]) or (equal but 50% lucky))',
                        '      swap(i, storeIndex); ++storeIndex',
                        '  swap(pivot, storeIndex-1)'
                    ]);

                    quickSortSplit(state, 0, numElements - 1);

                    state.lineNo = 0;
                    state.status = 'List is sorted!';

                    for (var i = 0; i < numElements; ++i)
                        state.backlinks[i].highlight = HIGHLIGHT_NONE; //unhighlight everything
                    StateHelper.updateCopyPush(statelist, state);
                }

                var quickSortSplit = function (state, startIndex, endIndex) { //startIndex & endIndex inclusive
                    var cur_partition = state.backlinks.slice(startIndex, endIndex + 1).map(function (d) {
                        return d.value;
                    });
                    if (cur_partition.toString().length > 20)
                        cur_partition = cur_partition.toString().substr(0, 20) + '...';
                    state.status = 'Working on partition [{partition}] (index {startIndex} to {endIndex}).'
                        .replace("{partition}", cur_partition)
                        .replace("{startIndex}", startIndex).replace("{endIndex}", endIndex);
                    state.lineNo = 1;

                    if (startIndex > endIndex)
                        return;

                    if (startIndex == endIndex) {
                        state.status += ' Since partition size == 1, element inside partition is necessarily at sorted position.';
                        state.backlinks[startIndex].highlight = HIGHLIGHT_SORTED;
                        StateHelper.updateCopyPush(statelist, state);
                        return;
                    }

                    var middleIndex = quickSortPartition(state, startIndex, endIndex);
                    quickSortSplit(state, startIndex, middleIndex - 1);
                    quickSortSplit(state, middleIndex + 1, endIndex);
                }

                var quickSortPartition = function (state, startIndex, endIndex) {
                    var pivotIndex;
                    if (quickSortUseRandomizedPivot) {
                        pivotIndex = generateRandomNumber(startIndex, endIndex);

                        state.status += ' Randomly selected {pivot} (index {index}) as pivot.'.replace("{pivot}", state.backlinks[pivotIndex].value).replace("{index}", pivotIndex);
                        state.lineNo = [1, 2];

                        state.backlinks[pivotIndex].highlight = HIGHLIGHT_PIVOT;
                        StateHelper.updateCopyPush(statelist, state);

                        if (pivotIndex != startIndex) {
                            state.status = 'Swap pivot ({pivot}, index {index}) with first element ({first}, index {firstIndex}). (storeIndex = {storeIndex}.)'.replace("{pivot}", state.backlinks[pivotIndex].value).replace("{index}", pivotIndex)
                                .replace("{first}", state.backlinks[startIndex].value).replace("{firstIndex}", startIndex).replace("{storeIndex}", (startIndex + 1));

                            state.lineNo = [2, 3];

                            EntryBacklinkHelper.swapBacklinks(state.backlinks, pivotIndex, startIndex);
                            pivotIndex = startIndex;
                            StateHelper.updateCopyPush(statelist, state);
                        }
                    }
                    else {
                        pivotIndex = startIndex;

                        state.status += ' Selecting {pivot} as pivot. (storeIndex = {storeIndex}).'.replace("{pivot}", state.backlinks[pivotIndex].value).replace("{storeIndex}", (startIndex + 1));
                        state.lineNo = [1, 2, 3];

                        state.backlinks[pivotIndex].highlight = HIGHLIGHT_PIVOT;
                        StateHelper.updateCopyPush(statelist, state);
                    }

                    var storeIndex = pivotIndex + 1;
                    var pivotValue = state.backlinks[pivotIndex].value;

                    for (var i = storeIndex; i <= endIndex; ++i) {
                        state.status = 'Checking if {val} &lt; {pivot} (pivot) (or if they are equal but 50% lucky).'.replace("{val}", state.backlinks[i].value).replace("{pivot}", pivotValue);
                        state.lineNo = [4, 5];

                        state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
                        StateHelper.updateCopyPush(statelist, state);
                        if ((state.backlinks[i].value < pivotValue) || ((state.backlinks[i].value == pivotValue) && (Math.random() < 0.5))) {
                            state.status = '{val} &lt;= {pivot} (pivot) is true. Swapping index {idx} (value = {val}) with element at storeIndex {storeIdx} (value = {storeVal}). (Value of storeIndex is now = {newStoreIdx}).'
                                .replace("{val}", state.backlinks[i].value)
                                .replace("{pivot}", pivotValue)
                                .replace("{idx}", i).replace("{storeIdx}", storeIndex)
                                .replace("{val}", state.backlinks[i].value)
                                .replace("{storeVal}", state.backlinks[storeIndex].value)
                                .replace("{newStoreIdx}", (storeIndex + 1));
                            state.lineNo = [4, 6];

                            //if (i != storeIndex) { // small behavioral fix on 12 Feb 2022, swap with itself is animated
                            EntryBacklinkHelper.swapBacklinks(state.backlinks, storeIndex, i);
                            StateHelper.updateCopyPush(statelist, state);
                            //}

                            state.backlinks[storeIndex].highlight = HIGHLIGHT_LEFT;
                            ++storeIndex;
                        }
                        else {
                            state.backlinks[i].highlight = HIGHLIGHT_RIGHT;
                        }
                    }
                    state.status = 'Iteration complete.';
                    state.lineNo = 4;
                    StateHelper.updateCopyPush(statelist, state);
                    if (storeIndex - 1 != pivotIndex) {
                        state.status = 'Swapping pivot (index = {pivotIdx}, value = {pivot}) with element at storeIndex - 1 (index = {newIdx}, value = {newVal}).'.replace("{pivotIdx}", pivotIndex).replace("{pivot}", pivotValue)
                            .replace("{newIdx}", (storeIndex - 1)).replace("{newVal}", state.backlinks[storeIndex - 1].value);
                        state.lineNo = 7;
                        EntryBacklinkHelper.swapBacklinks(state.backlinks, storeIndex - 1, pivotIndex);
                        StateHelper.updateCopyPush(statelist, state);
                    }

                    state.status = 'Pivot is now at its sorted position.';
                    state.lineNo = 7;

                    for (var i = startIndex; i <= endIndex; ++i)
                        state.backlinks[i].highlight = HIGHLIGHT_NONE; //unhighlight everything
                    state.backlinks[storeIndex - 1].highlight = HIGHLIGHT_SORTED;
                    StateHelper.updateCopyPush(statelist, state);

                    return storeIndex - 1;
                }

                this.mergeSort = function (callback) {
                    var numElements = statelist[0].backlinks.length;
                    var state = StateHelper.copyState(statelist[0]);

                    populatePseudocode([
                        'split each element into partitions of size 1',
                        'recursively merge adjacent partitions',
                        '  for i = leftPartIdx to rightPartIdx',
                        '    if leftPartHeadValue <= rightPartHeadValue',
                        '      copy leftPartHeadValue',
                        '    else: copy rightPartHeadValue' + (computeInversionIndex ? '; Increase InvIdx' : ""),
                        'copy elements back to original array'
                    ]);

                    mergeSortInversionIndexCounter = 0;

                    for (var i = 0; i < numElements; ++i) {
                        state.backlinks[i].highlight = HIGHLIGHT_RAINBOW[i];
                    }

                    state.status = 'We split the array into partitions of 1 (each partition takes on a distinct color).';
                    status.lineNo = 1;
                    StateHelper.updateCopyPush(statelist, state);

                    this.mergeSortSplitMerge(state, 0, numElements);

                    for (var i = 0; i < numElements; ++i)
                        state.backlinks[i].highlight = HIGHLIGHT_NONE; // unhighlight everything

                    state.status = 'List is sorted!';
                    if (computeInversionIndex)
                        state.status += '<br>(Inversion Index = {idx}.)'.replace("{idx}", mergeSortInversionIndexCounter);

                    state.lineNo = 0;
                    StateHelper.updateCopyPush(statelist, state);

                    this.play(callback);
                    return true;
                }

                this.mergeSortSplitMerge = function (state, startIndex, endIndex) { // startIndex inclusive, endIndex exclusive
                    if (endIndex - startIndex <= 1)
                        return;

                    var middleIndex = Math.ceil((startIndex + endIndex) / 2);
                    this.mergeSortSplitMerge(state, startIndex, middleIndex);
                    this.mergeSortSplitMerge(state, middleIndex, endIndex);
                    this.mergeSortMerge(state, startIndex, middleIndex, endIndex)

                    // Copy array back
                    state.status = 'We copy the elements from the new array back into the original array.';
                    state.lineNo = 7;

                    var duplicateBacklinks = new Array();
                    for (var i = startIndex; i < endIndex; ++i) {
                        var newPosition = state.backlinks[i].secondaryPositionStatus;
                        duplicateBacklinks[newPosition] = state.backlinks[i];
                    }

                    for (var i = startIndex; i < endIndex; ++i) {
                        state.backlinks[i] = duplicateBacklinks[i];
                    }

                    for (var i = startIndex; i < endIndex; ++i) {
                        state.backlinks[i].secondaryPositionStatus = POSITION_USE_PRIMARY;
                        StateHelper.updateCopyPush(statelist, state);
                    }
                }

                this.mergeSortMerge = function (state, startIndex, middleIndex, endIndex) {
                    var leftIndex = startIndex;
                    var rightIndex = middleIndex;

                    var newHighlightColor = state.backlinks[startIndex].highlight;

                    state.status = 'Merge partitions [{partition1}] (index {startIdx1} to {endIdx1}) and [{partition2}] (index {startIdx2} to {endIdx2}).'
                        .replace('{partition1}', state.backlinks.slice(startIndex, middleIndex).map(function (d) {
                            return d.value;
                        }))
                        .replace("{startIdx1}", startIndex).replace("{endIdx1}", (middleIndex - 1))
                        .replace("{partition2}", state.backlinks.slice(middleIndex, endIndex).map(function (d) {
                            return d.value;
                        }))
                        .replace("{startIdx2}", middleIndex).replace("{endIdx2}", (endIndex - 1));
                    state.lineNo = 2;

                    state.backlinks[leftIndex].highlight = makePaler(state.backlinks[leftIndex].highlight);
                    state.backlinks[rightIndex].highlight = makePaler(state.backlinks[rightIndex].highlight);
                    StateHelper.updateCopyPush(statelist, state);

                    for (var i = startIndex; i < endIndex; ++i) {
                        // Note here we don't actually copy the elements into a new array, like in a usual mergesort.
                        // This is left instead to the mergeSortSplitMerge to handle as it's easier there.
                        // (We use the useSecondaryPostion property to overcome this lack-of-copying.)
                        if (leftIndex < middleIndex && (rightIndex >= endIndex || state.backlinks[leftIndex].value <= state.backlinks[rightIndex].value)) {
                            state.backlinks[leftIndex].highlight = newHighlightColor;
                            state.backlinks[leftIndex].secondaryPositionStatus = i;

                            if (rightIndex < endIndex) {
                                state.status = 'Since {leftPart} (left partition) &lt;= {rightPart} (right partition), we take {leftPart}.'
                                    .replace("{leftPart}", state.backlinks[leftIndex].value)
                                    .replace("{rightPart}", state.backlinks[rightIndex].value)
                                    .replace("{leftPart}", state.backlinks[leftIndex].value);
                            }
                            else {
                                state.status = 'Since right partition is empty, we take {leftPart} (left partition).'.replace("{leftPart}", state.backlinks[leftIndex].value);
                            }
                            state.lineNo = [3, 4, 5];

                            leftIndex++;
                            if (leftIndex != middleIndex)
                                state.backlinks[leftIndex].highlight = makePaler(state.backlinks[leftIndex].highlight);

                            StateHelper.updateCopyPush(statelist, state);
                        }
                        else {
                            state.backlinks[rightIndex].highlight = newHighlightColor;
                            state.backlinks[rightIndex].secondaryPositionStatus = i;

                            if (leftIndex < middleIndex) {
                                state.status = 'Since {leftPart} (left partition) &gt; {rightPart} (right partition), we take {rightPart}.'
                                    .replace("{leftPart}", state.backlinks[leftIndex].value)
                                    .replace("{rightPart}", state.backlinks[rightIndex].value)
                                    .replace("{rightPart}", state.backlinks[rightIndex].value);
                            }
                            else {
                                state.status = 'Since left partition is empty, we take {rightPart} (right partition).'.replace("{rightPart}", state.backlinks[rightIndex].value);
                            }

                            if (computeInversionIndex) {
                                mergeSortInversionIndexCounter += middleIndex - leftIndex;
                                state.status += '<br>(We add size_of_left_partition (= {sizeofleft}) to <b>InvIdx&nbsp;</b>({inversionidxcounter}).)'
                                    .replace("{sizeofleft}", (middleIndex - leftIndex)).replace("{inversionidxcounter}", mergeSortInversionIndexCounter);
                            }
                            //        else {
                            //          state.status += 'weird'; // what is this?
                            //        }
                            state.lineNo = [3, 6];

                            ++rightIndex;
                            if (rightIndex != endIndex)
                                state.backlinks[rightIndex].highlight = makePaler(state.backlinks[rightIndex].highlight);

                            StateHelper.updateCopyPush(statelist, state);
                        }
                    }
                }

                this.insertionSort = function (callback) {
                    var numElements = statelist[0].backlinks.length;
                    var state = StateHelper.copyState(statelist[0]);

                    populatePseudocode([
                        'mark first element as sorted',
                        'for each unsorted element X',
                        '  &#39;extract&#39; the element X',
                        '  for j = lastSortedIndex down to 0',
                        '    if current element j &gt; X',
                        '      move sorted element to the right by 1',
                        '    break loop and insert X here'
                    ]);

                    // First element always sorted
                    state.lineNo = 1;
                    // Mark the first element ({firstVal}) as sorted.
                    state.status = 'Mark the first element ({firstVal}) as sorted.'.replace("{firstVal}", state.backlinks[0].value);
                    state.backlinks[0].highlight = HIGHLIGHT_SORTED;
                    StateHelper.updateCopyPush(statelist, state);

                    for (var i = 1; i < numElements; ++i) {
                        // Highlight first unsorted element
                        state.lineNo = [2, 3];
                        // Extract the first unsorted element ({val}).
                        state.status = 'Extract the first unsorted element ({val}).'.replace("{val}", state.backlinks[i].value);
                        state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
                        state.backlinks[i].secondaryPositionStatus = POSITION_USE_SECONDARY_IN_DEFAULT_POSITION;
                        StateHelper.updateCopyPush(statelist, state);

                        for (var j = i - 1; j >= 0; --j) {
                            state.lineNo = 4;
                            // Figure where to insert extracted element.
                            // Comparing with sorted element {val}.
                            state.status = 'Figure where to insert extracted element; comparing with sorted element {val}.'.replace("{val}", state.backlinks[j].value);;
                            state.backlinks[j].highlight = HIGHLIGHT_STANDARD;
                            StateHelper.updateCopyPush(statelist, state);

                            if (state.backlinks[j].value > state.backlinks[j + 1].value) {
                                state.lineNo = [5, 6];
                                // {val1} > {val2} is true.
                                // Hence move current sorted element ({val1}) to the right by 1.
                                state.status = '{val1} > {val2} is true, hence move current sorted element ({val1}) to the right by 1.'.replace("{val1}", state.backlinks[j].value).replace("{val2}", state.backlinks[j + 1].value).replace("{val1}", state.backlinks[j].value);
                                EntryBacklinkHelper.swapBacklinks(state.backlinks, j, j + 1);
                                StateHelper.updateCopyPush(statelist, state);
                                state.backlinks[j + 1].highlight = HIGHLIGHT_SORTED;
                            }
                            else {
                                state.lineNo = 7;
                                // {val1} > {val2} is false.
                                // Insert extracted element at current position.
                                state.status = '{val1} > {val2} is false, insert element at current position.'.replace("{val1}", state.backlinks[j].value).replace("{val2}", state.backlinks[j + 1].value);
                                state.backlinks[j].highlight = HIGHLIGHT_SORTED;
                                state.backlinks[j + 1].secondaryPositionStatus = POSITION_USE_PRIMARY;
                                state.backlinks[j + 1].highlight = HIGHLIGHT_SORTED;
                                StateHelper.updateCopyPush(statelist, state);
                                break;
                            }
                        }

                        if (state.backlinks[0].secondaryPositionStatus == POSITION_USE_SECONDARY_IN_DEFAULT_POSITION) {
                            state.lineNo = 4;
                            // At beginning of array (nothing to compare).
                            // Hence insert extracted element at current position.
                            state.status = 'At beginning of array (nothing to compare), hence insert element at current position.';
                            state.backlinks[0].secondaryPositionStatus = POSITION_USE_PRIMARY;
                            state.backlinks[0].highlight = HIGHLIGHT_SORTED;
                            StateHelper.updateCopyPush(statelist, state);
                        }
                    }

                    for (var i = 0; i < numElements; ++i)
                        state.backlinks[i].highlight = HIGHLIGHT_NONE; //unhighlight everything
                    state.lineNo = 0;
                    // The array/list is now sorted.
                    state.status = 'List is sorted!';
                    StateHelper.updateCopyPush(statelist, state);

                    this.play(callback);
                    return true;
                }

                this.selectionSort = function (callback) {
                    var numElements = statelist[0].backlinks.length;
                    var state = StateHelper.copyState(statelist[0]);

                    populatePseudocode([
                        'repeat (numOfElements - 1) times',
                        '  set the first unsorted element as the minimum',
                        '  for each of the unsorted elements',
                        '    if element < currentMinimum',
                        '      set element as new minimum',
                        '  swap minimum with first unsorted position'
                    ]);

                    for (var i = 0; i < numElements - 1; ++i) {
                        var minPosition = i;

                        // Iteration {iteration}: Set {val} as the current minimum.
                        // Then iterate through the rest to find the true minimum.
                        state.status = 'Iteration {iteration}: Set {val} as the current minimum, then iterate through the remaining unsorted elements to find the true minimum.'.replace("{iteration}", (i + 1)).replace("{val}", state.backlinks[i].value);
                        state.lineNo = [1, 2, 3];
                        state.backlinks[minPosition].highlight = HIGHLIGHT_SPECIAL;

                        StateHelper.updateCopyPush(statelist, state);

                        for (var j = i + 1; j < numElements; ++j) {
                            // Check if {val} is smaller than the current minimum ({minVal}).
                            state.status = 'Check if {val} is smaller than the current minimum ({minVal}).'.replace("{val}", state.backlinks[j].value).replace("{minVal}", state.backlinks[minPosition].value);
                            state.lineNo = 4;
                            state.backlinks[j].highlight = HIGHLIGHT_STANDARD;
                            StateHelper.updateCopyPush(statelist, state);

                            state.backlinks[j].highlight = HIGHLIGHT_NONE;

                            if (state.backlinks[j].value < state.backlinks[minPosition].value) {
                                state.status = 'Set {val} as the new minimum.'.replace("{val}", state.backlinks[j].value);
                                state.lineNo = 5;
                                state.backlinks[minPosition].highlight = HIGHLIGHT_NONE;
                                state.backlinks[j].highlight = HIGHLIGHT_SPECIAL;

                                minPosition = j;
                                StateHelper.updateCopyPush(statelist, state);
                            }
                        }

                        if (minPosition != i) { // Highlight the first-most unswapped position, if it isn't the minimum
                            // Set {val} as the new minimum.
                            state.status = 'Swap the minimum ({minVal}) with the first unsorted element ({element}).'.replace("{minVal}", state.backlinks[minPosition].value).replace("{element}", state.backlinks[i].value);
                            state.lineNo = 6;
                            state.backlinks[i].highlight = HIGHLIGHT_SPECIAL;
                            StateHelper.updateCopyPush(statelist, state);

                            EntryBacklinkHelper.swapBacklinks(state.backlinks, minPosition, i);
                            StateHelper.updateCopyPush(statelist, state);
                        }
                        else {
                            // As the minimum is the first unsorted element, no swap is necessary.
                            state.status = 'As the minimum is the first unsorted element, no swap is necessary.';
                            state.lineNo = 6;
                            StateHelper.updateCopyPush(statelist, state);
                        }

                        // {val} is now considered sorted.
                        state.status = '{val} is now considered sorted.'.replace("{val}", state.backlinks[i].value);
                        state.backlinks[minPosition].highlight = HIGHLIGHT_NONE;
                        state.backlinks[i].highlight = HIGHLIGHT_SORTED;
                        StateHelper.updateCopyPush(statelist, state);
                    }

                    for (var i = 0; i < numElements; ++i)
                        state.backlinks[i].highlight = HIGHLIGHT_NONE; // un-highlight everything
                    // The array/list is now sorted.
                    // (After all iterations, the last element will naturally be sorted.)
                    state.status = 'List is sorted!' + '<br>' + '(After all iterations, the last element will naturally be sorted.)';
                    status.lineNo = 0;
                    StateHelper.updateCopyPush(statelist, state);

                    this.play(callback);
                    return true;
                }

                this.bubbleSort = function (callback) {
                    var numElements = statelist[0].backlinks.length;
                    var state = StateHelper.copyState(statelist[0]);
                    var swapCounter = 0;

                    populatePseudocode([
                        'do',
                        '  <b>swapped </b>= false',
                        '  for i = 1 to indexOfLastUnsortedElement-1',
                        '    if leftElement > rightElement',
                        '      swap(leftElement, rightElement)',
                        '      <b>swapped </b>= true' + (computeInversionIndex ? '; <b>++swapCounter</b>' : ""),
                        'while <b>swapped</b>'
                    ]);

                    var swapped;
                    var indexOfLastUnsortedElement = numElements;
                    do {
                        swapped = false;

                        // Set the swapped flag to false.
                        // Then iterate from 1 to {endIdx} inclusive.
                        state.status = 'Set the <b>swapped </b>flag to false.<div>Then iterate from index 1 to {endIdx} inclusive.</div>'.replace("{endIdx}", indexOfLastUnsortedElement - 1);
                        state.lineNo = [2, 3];
                        StateHelper.updateCopyPush(statelist, state);

                        for (var i = 1; i < indexOfLastUnsortedElement; ++i) {
                            state.backlinks[i - 1].highlight = HIGHLIGHT_STANDARD;
                            state.backlinks[i].highlight = HIGHLIGHT_STANDARD;

                            // Checking if {val1} > {val2} and swap them if that is true.
                            // The current value of swapped = {swapped}.
                            state.status = '<div>Checking if {val1} &gt; {val2} and swap them if that is true;&nbsp;<b>swapped </b>= {swapped}.</div>'.replace("{val1}", state.backlinks[i - 1].value).replace("{val2}", state.backlinks[i].value).replace("{swapped}", swapped);
                            state.lineNo = 4;
                            StateHelper.updateCopyPush(statelist, state);

                            if (state.backlinks[i - 1].value > state.backlinks[i].value) {
                                swapped = true;

                                // Swapping the positions of {val1} and {val2}.
                                // Set swapped = true.
                                state.status = 'Swapping the positions of {val1} and {val2} and set <b>swapped </b>= true.'.replace("{val1}", state.backlinks[i - 1].value).replace("{val2}", state.backlinks[i].value);
                                if (computeInversionIndex) {
                                    ++swapCounter;
                                    // For inversion index computation: Add 1 to swapCounter.
                                    // The current value of swapCounter = {swapCounter}.
                                    state.status += '<br>For inversion index: Add 1 to <b>swapCounter</b>, now = {swapCounter}.'.replace("{swapCounter}", swapCounter);
                                }

                                state.lineNo = [5, 6];

                                EntryBacklinkHelper.swapBacklinks(state.backlinks, i, i - 1);
                                StateHelper.updateCopyPush(statelist, state);
                            }

                            state.backlinks[i - 1].highlight = HIGHLIGHT_NONE;
                            state.backlinks[i].highlight = HIGHLIGHT_NONE;
                        }

                        --indexOfLastUnsortedElement;
                        state.backlinks[indexOfLastUnsortedElement].highlight = HIGHLIGHT_SORTED;
                        if (swapped == false)
                            // No swap is done in this pass.
                            // We can terminate Bubble Sort now.
                            state.status = 'No swap is done in this pass.<div>We can terminate Bubble Sort now</div>';
                        else
                            // Mark last unsorted element as sorted now.
                            // As at least one swap is done in this pass, we continue.
                            state.status = '<div>Mark this element as sorted now.</div><div>As at least one swap is done in this pass, we continue.</div>';

                        state.lineNo = 7;
                        StateHelper.updateCopyPush(statelist, state);
                    }
                    while (swapped);

                    for (var i = 0; i < numElements; ++i)
                        state.backlinks[i].highlight = HIGHLIGHT_NONE; //un-highlight everything

                    // The array/list is now sorted.
                    state.status = 'List is sorted!';
                    if (computeInversionIndex)
                        // Inversion Index = {swapCounter}.
                        state.status += '<br>Inversion Index = {swapCounter}.'.replace("{swapCounter}", swapCounter);

                    state.lineNo = 0;
                    StateHelper.updateCopyPush(statelist, state);

                    this.play(callback);
                    return true;
                }

                this.clearPseudocode = function () { populatePseudocode([]); }

                var populatePseudocode = function (code) {
                    var i = 1;
                    for (; i <= 7 && i <= code.length; ++i) {
                        $("#code" + i).html(
                            code[i - 1].replace(
                                /^\s+/,
                                function (m) { return m.replace(/\s/g, "&nbsp;"); }
                            )
                        );
                    }
                    for (; i <= 7; ++i) {
                        $("#code" + i).html("");
                    }
                }

                //animation functions
                var drawCurrentState = function () {
                    if (currentStep < 0)
                        currentStep = 0;
                    if (currentStep > statelist.length - 1)
                        currentStep = statelist.length - 1;
                    $('#progress-bar').slider("value", currentStep);
                    drawState(currentStep);
                    if (currentStep == (statelist.length - 1)) {
                        pause(); //in html file
                        $('#play img').attr('src', 'https://visualgo.net/img/replay.png').attr('alt', 'replay').attr('title', 'replay');
                    }
                    else
                        $('#play img').attr('src', 'https://visualgo.net/img/play.png').attr('alt', 'play').attr('title', 'play');
                }

                this.getAnimationDuration = function () { return transitionTime; }

                this.setAnimationDuration = function (x) {
                    transitionTime = x;
                    if (issPlaying) {
                        clearInterval(animInterval);
                        animInterval = setInterval(function () {
                            drawCurrentState();
                            if (currentStep < (statelist.length - 1))
                                ++currentStep;
                            else
                                clearInterval(animInterval);
                        }, transitionTime);
                    }
                }

                this.getCurrentIteration = function () { return currentStep; }

                this.getTotalIteration = function () { return statelist.length; }

                this.forceNext = function () {
                    if ((currentStep + 1) < statelist.length)
                        ++currentStep;
                    drawCurrentState();
                }

                this.forcePrevious = function () {
                    if ((currentStep - 1) >= 0)
                        --currentStep;
                    drawCurrentState();
                }

                this.jumpToIteration = function (n) {
                    currentStep = n;
                    drawCurrentState();
                }

                this.play = function (callback) {
                    issPlaying = true;
                    drawCurrentState();
                    animInterval = setInterval(function () {
                        drawCurrentState();
                        if (currentStep < (statelist.length - 1))
                            ++currentStep;
                        else {
                            clearInterval(animInterval);
                            if (typeof callback == 'function') callback();
                        }
                    }, transitionTime);
                }

                this.pause = function () {
                    issPlaying = false;
                    clearInterval(animInterval);
                }

                this.replay = function () {
                    issPlaying = true;
                    currentStep = 0;
                    drawCurrentState();
                    animInterval = setInterval(function () {
                        drawCurrentState();
                        if (currentStep < (statelist.length - 1))
                            currentStep++;
                        else
                            clearInterval(animInterval);
                    }, transitionTime);
                }

                this.stop = function () {
                    issPlaying = false;
                    statelist = [statelist[0]]; //clear statelist to original state, instead of new Array();
                    secondaryStatelist = [null];
                    currentStep = 0;
                    drawState(0);
                }
            }

            // sorting action
            var actionsWidth = 150;
            var statusCodetraceWidth = 420;

            // local
            $(function () {
                AbbreviateTitle();
                var eight_modes = ["Bubble", "Selection", "Insertion", "Merge", "Quick", "RandomizedQuick", "Counting", "Radix"];
                $('#title-' + eight_modes[Math.floor(Math.random() * 8)]).click(); // randomly open one of the eight sorting algorithm mode every time
                $('#play').hide();

                d3.selectAll("#radix-sort-bucket-labels-collection span")
                    .style({
                        "left": function (d, i) {
                            return 17.5 + i * 65 + "px";
                        }
                    });
                var sortMode = getQueryVariable("mode");
                if (sortMode.length > 0) {
                    $('#title-' + sortMode).click();
                }
                var createArray = getQueryVariable("create");
                if (createArray.length > 0) {
                    $('#userdefined-input').val(createArray);
                    createList("userdefined");
                }

            });

            //this viz-specific code
            var gw = new Sorting();

            const DEFAULT_DATA = "3,44,38,5,47,15,36,26,27,2,46,4,19,50,48";
            const DEFAULT_COUNT_DATA = "2,3,8,7,1,2,2,2,7,3,9,8,2,1,4"; // drop 5 numbers on 25 Feb , 2, 4, 6, 9, 2";
            const DEFAULT_RADIX_DATA = "3221, 1, 10, 9680, 577, 9420, 7, 5622, 4793, 2030, 3138, 82, 2599, 743, 4127";

            // title changing
            function AbbreviateTitle() {
                $('#title-Bubble').text("BUB").attr('title', 'Bubble Sort');
                $('#title-Selection').text("SEL").attr('title', 'Selection Sort');
                $('#title-Insertion').text("INS").attr('title', 'Insertion Sort');
                $('#title-Merge').text("MER").attr('title', 'Merge Sort');
                $('#title-Quick').text("QUI").attr('title', 'Quick Sort');
                $('#title-RandomizedQuick').text("R-Q").attr('title', 'Random Quick Sort');
                $('#title-Counting').text("COU").attr('title', 'Counting Sort');
                $('#title-Radix').text("RAD").attr('title', 'Radix Sort');
            }
            $('#title-Bubble').click(function () {
                showStandardCanvas();
                $("#sort-bubble-merge-inversion").css("display", "");
                $('#current-action p').html('Bubble Sort');
                changeSortType(gw.bubbleSort);
                AbbreviateTitle();
                $('#title-Bubble').text('Bubble Sort');
            });
            $('#title-Selection').click(function () {
                showStandardCanvas();
                hideAllSortingOptions();
                $('#current-action p').html('Selection Sort');
                changeSortType(gw.selectionSort);
                AbbreviateTitle();
                $('#title-Selection').text('Selection Sort');
            });
            $('#title-Insertion').click(function () {
                showStandardCanvas();
                hideAllSortingOptions();
                $('#current-action p').html('Insertion Sort');
                changeSortType(gw.insertionSort);
                AbbreviateTitle();
                $('#title-Insertion').text('Insertion Sort');
            });
            $('#title-Merge').click(function () {
                showStandardCanvas();
                hideAllSortingOptions();
                $("#sort-bubble-merge-inversion").css("display", "");
                $('#current-action p').html('Merge Sort');
                AbbreviateTitle();
                changeSortType(gw.mergeSort);
                $('#title-Merge').text('Merge Sort');
            });
            $('#title-Quick').click(function () {
                showStandardCanvas();
                hideAllSortingOptions();
                $('#current-action p').html('Quick Sort');
                changeSortType(gw.quickSort);
                AbbreviateTitle();
                $('#title-Quick').text('Quick Sort');
            });
            $('#title-RandomizedQuick').click(function () {
                showStandardCanvas();
                hideAllSortingOptions();
                $('#current-action p').html('Random Quick Sort');
                changeSortType(gw.randomizedQuickSort);
                AbbreviateTitle();
                $('#title-RandomizedQuick').text('Random Quick Sort');
            });
            $('#title-Counting').click(function () {
                showStandardCanvas();
                $("#viz-counting-sort-secondary-canvas").show();
                hideAllSortingOptions();
                $('#current-action p').html('Counting Sort');
                changeSortType(gw.countingSort); // don't use default -->, DEFAULT_COUNT_DATA);
                AbbreviateTitle();
                $('#title-Counting').text('Counting Sort');
            });
            $('#title-Radix').click(function () {
                hideAllCanvases();
                $("#viz-radix-sort-canvas").show();
                hideAllSortingOptions();
                $('#current-action p').html('Radix Sort');
                changeSortType(gw.radixSort); // don't use default -->, DEFAULT_RADIX_DATA);
                AbbreviateTitle();
                $('#title-Radix').text('Radix Sort');
            });

            function changeSortType(newSortingFunction, customNumberList) {
                if (!customNumberList) {
                    // $('#userdefined-input').val(DEFAULT_DATA); // don't use default at all times :O
                    createList('random');
                }
                else {
                    $('#userdefined-input').val(customNumberList);
                    createList('userdefined');
                }

                if (isPlaying) stop();
                showActionsPanel();
                hideStatusPanel();
                hideCodetracePanel();
                gw.clearPseudocode();
                gw.setSelectedSortFunction(newSortingFunction);
            }

            function createList(type) {
                if (isPlaying) stop();
                setTimeout(function () {
                    if (gw.createList(type)) {
                        $('#progress-bar').slider("option", "max", 0);
                        closeCreate();
                        isPlaying = false;
                    }
                }, 500);
            }

            function sort(callback) {
                gw.computeInversionIndex = $('#sort-bubble-merge-inversion-checkbox').prop('checked');
                if (isPlaying) stop();
                setTimeout(function () {
                    if (gw.sort(callback)) {
                        $('#current-action').show();
                        $('#progress-bar').slider("option", "max", gw.getTotalIteration() - 1);
                        triggerRightPanels();
                        isPlaying = true;
                    }
                }, 500);
            }

            // sort options
            function hideAllSortingOptions() {
                $("#sort-bubble-merge-inversion").css("display", "none");
            }

            // canvas
            function hideAllCanvases() {
                $("#viz").hide();
                $("#viz-counting-sort-secondary-canvas").hide();
                $("#viz-radix-sort-canvas").hide();
            }

            function showStandardCanvas() {
                $("#viz").show();
                $("#viz-counting-sort-secondary-canvas").hide();
                $("#viz-radix-sort-canvas").hide();
            }

            var exploreModeData = [];

            // This function will be called before entering E-Lecture Mode
            function ENTER_LECTURE_MODE() {
                exploreModeData = gw.currentNumList;
            }

            // This function will be called before returning to Explore Mode
            function ENTER_EXPLORE_MODE() {
                gw.loadNumberList(exploreModeData);
            }

            // Lecture action functions
            function SORT(mode) {
                hideSlide(function () {
                    sort(showSlide);
                });
            }
 function CUSTOM_ACTION(action, data, mode) { }