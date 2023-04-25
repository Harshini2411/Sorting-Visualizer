 var extraCSS = { "sort": "65px", "create": "92px" };
            var actionsIds = { "create": { "p": "Create(A)", "parents": ["create-sorted", "create-nearly-sorted", "create-many-duplicates"] }, "sort": { "p": "Sort", "onClick": "sort()" } };
            var isOpens = {};
            var len = 2;
            var keys = ["create", "sort"];
            for (i = 0; i < len; i++) {
                var actionDetails = keys[i];
                isOpens[actionDetails] = false;
            }
            function openAction(id) {
                hideThirdTiers(id);
                $("." + id).css("bottom", extraCSS[id]);
                if (!isOpens[id]) {
                    $('.' + id).fadeIn('fast');
                    isOpens[id] = true;
                }
            }
            function closeAction(id) {
                hideThirdTiers(id);
                if (isOpens[id]) {
                    $('.' + id).fadeOut('fast');
                    $('#' + id + '-err').html("");
                    isOpens[id] = false;
                }
            }

            function hideEntireActionsPanel() {
                //hideAllThirdTiers();
                closeAction('create');
                closeAction('sort');
                hideActionsPanel();
            }

            function hideThirdTiers(tier1Action) {
                if ("parents" in actionsIds[tier1Action]) {
                    for (const secondTierAction of actionsIds[tier1Action]["parents"]) {
                        $('#' + secondTierAction + '-third-tier').fadeOut('fast');
                    }
                }
            }

            function hideAllThirdTiers() {
                for (const tier1Action in actionsIds) {
                    hideThirdTiers(tier1Action);
                }
            }

            function toggleChildExtras(tier1, selectedParentTier2) {
                hideThirdTiers(tier1);
                //this actionId must have childExtras
                var style = extraCSS[tier1];
                $("." + tier1).css("bottom", (parseInt(style.substring(0, style.length - 2)) - 27));
                //fade ins and outs are done on the ID whereas css class is set on the class
                //fade in the third tier of the selected 2nd tier parent
                $('#' + selectedParentTier2 + '-third-tier').fadeIn('fast');

                // //fade out all other third tiers of that 'action'
                // for (const parent of actions[tier1]["parents"]) {
                //     console.log("parent is " + parent + " for " + selectedParentTier2);
                //     if (parent != selectedParentTier2) {
                //         $('#' + parent + '-third-tier').fadeOut('fast');
                //     }
                // }
            }

            function setActionHeightOriginal(tier1Action) {
                $("." + tier1Action).css("bottom", extraCSS[tier1Action]);
            }

            $('#' + 'create').click(function () {
                openAction('create');
                closeAction('sort');
            });
            $('#' + 'sort').click(function () {
                openAction('sort');
                closeAction('create');
            });

            //important to have all the input fields in actions menu take an id containing '-input'
            $("[id*='-input']").on("keypress keydown keyup", (event) => {
                event.stopPropagation();
            });
      