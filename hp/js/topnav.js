
$(document).ready(function() {
    getMenu();

});


var getMenu = function getMenuF() {
    var scCount = 0;
    var cCount = 0;
    $.ajax({
        url: '/xml/menu.xml',
        type: "GET",
        dataType: 'xml',
        success: function(data) {
            $(data).find('MenuItems').each(function() {
                $(this).find('Category').each(function() {
                    cCount++;
                    var type = $(this).attr('type');
                    var cName = $(this).attr('name');
                    if (type == 'no-drop') {
                        var cURL = $(this).attr('url');
                        $('#tabMenuShop').append('<div class="navDropdownsOut" id="header_' +
                                cCount
                                + '"><h4 id="tab_' +
                                cCount
                                + '" class="navDropdownsLink"><a id="headerLink_' +
                                cCount
                                + '" class="tabLink" href="' +
                                cURL
                                + '" target="_self">' +
                                cName
                                + '</a></h4><div id="menu_' +
                                cCount
                                + '" class="tabMenu" onclick="event.cancelBubble = true;" onkeypress="event.cancelBubble = true;"></div></div><img class="divImage" src="img/header-div.png" alt="">');
                    } else {
                        var dropdown = '';
                        $(this).find('SubCategory').each(function() {
                            var sURL = $(this).attr('url');
                            var sName = $(this).attr('name');
                            var description = $(this).attr('description');
                            scCount++;
                            dropdown += '<div id="sectionWrapper_' +
                                    cCount
                                    + '_' +
                                    scCount
                                    + '" class="sectionWrapper"><a id="menuSection_' +
                                    cCount
                                    + '_' +
                                    scCount
                                    + '" class="dropDownSubNav" href="' +
                                    sURL
                                    + '" target="_self"><span class="menuSectionName">' +
                                    sName
                                    + '</span><br><div id="menuSectionDetail_' +
                                    cCount
                                    + '_' +
                                    scCount
                                    + '" class="menuSectionDetail">' +
                                    description
                                    + '</div></a></div>';
                        });

                        $('#tabMenuShop').append('<div class="navDropdownsOut" id="header_' +
                                cCount
                                + '"><h4 id="tab_' +
                                cCount
                                + '" class="navDropdownsLink"><a id="headerLink_' +
                                cCount
                                + '" class="tabLink" href="" target="_self">' +
                                cName
                                + '</a><div class="downArrow"></div></h4><div id="menu_' +
                                cCount
                                + '" class="tabMenu" onclick="event.cancelBubble = true;" onkeypress="event.cancelBubble = true;">' +
                                dropdown
                                + '<div id="subMenu_' +
                                cCount
                                + '" class="subNavMenu"></div><div class="cb"></div></div></div><img class="divImage" src="img/header-div.png" alt="">');

                    }
                });
            });
            setTimeout(dropdown, 100);
			

        },
        error: function(errorThrown) {
            console.log(errorThrown);
        }

    });
};

var dropdown = function dropdownF() {

    var expandDelay = 500; //Delay, in ms, between mousing over a menu item and when it expands
    var numTabs; //set at the beginning, indicates the total number of tabs on a menu
    var shouldMenuOpen = new Array(); //array of 0s and 1s that indicate if a menu should open or not
    var contentTracker = new Array(); //to keep track of which piece of content is open for each submenu
    var mHeightArray = new Array();
    var openContent = '';
    var maxWrapContent = new Array(); //use during initialization to determine the max height for an expandable tab menu item
    var maxSubContent = new Array(); //during initialization to determine the max height for sub menu content
    var visibleTab = ''; //keeps track of the currently open tab
    var visibleSection = ''; //keeps track of the currently open section
    var returnFlag = false; //set to true if a user returns from a side menu to the same section element
    var sectionTimeout = ''; //timeout ID for showing sections
    var markerTimeout = '';
    var timeoutElem = '';
    var cancelSectionFlag = false; //flag for edge case where user leaves a menu while the section marker is expanding
    var openAnimationFlag = false; //flag for edge case where user leaves a menu while animation is taking place
    var closeAnimationFlag = false;
    var openAnimationId = ''; //ID of any currently opening elements
    var closeAnimationId = ''; //ID of any currently closing elements
    var tabToggle = false;
    var subToggle = false; //use sub_1 if false, sub_2 if true
    var GREENTEXT = '#66CC00';
    var WHITE = '#FFFFFF';

    if ($('#hpThemeVersion').attr('value') != '' && typeof $('#hpThemeVersion').attr('value') != 'undefined') {
        //        GREENTEXT = '#000000';
        //        WHITE = '#767676';
    }

    //set the number of tabs
    numTabs = $('.navDropdownsMenu').children('.navDropdownsOut').size();
    $('.navDropdownsMenu').find('a').css({
        'color': WHITE,
        'text-decoration': 'none'
    });

    //Run at startup, finds the height a menu should be/determines which menus have content/opens the first display item in each submenu
    var prepareMenus = function() {
        menuHasContent();
        detailPosition();
        getMaxMenuContent();
        closeAllContent();
        simpleMenuHeight();
        openDefaultMenuContent();
        disableEmptyLinks();
    };

    //shift detail position when an image is present
    var detailPosition = function() {
        var detArray = ['.menuSectionDetail', '.menuSectionImage', '.subMenuDetail', '.detailImage', '.subMenuTitle', '.subMenuImage', '.dropDownTitle', '.titleImage'];
        var text;
        var image;
        for (var i = 0; i < 8; i += 2) {
            text = detArray[i];
            image = detArray[i + 1];
            handleImageOffset($(image + ' ~ ' + text), $(image));
        }
    }

    //prepare the menu if tabs exist, remove all references to it if not
    if (numTabs > 0)
        prepareMenus();

    //when the mouse enters a menu tab, open it after closing any previously opened tabs
    $('.navDropdownsOut').on('mouseenter', function(event) {
        var elementId = $(this).attr('id').split('_');
        var tabId = makeID(elementId, 1);
        if (visibleTab != tabId && visibleTab != '') {
            if (visibleSection != '')
                closeSection(visibleSection);
            closeTab(visibleTab);
        }
        cancelSectionFlag = false;
        openTab(tabId);
    });

    //close any open side menu content on mouseover, unless the return flag is true
    $('.tabMenu').on('mouseenter', function(event) {
        var elementId = $(this).attr('id').split('_');
        var tabId = makeID(elementId, 1);
        if (visibleSection != '') {
            if (!returnFlag) {
                closeSection(visibleSection);
            } else
                returnFlag = false;
        }
    });

    $('.sectionWrapper').on('mouseenter', function(event) {
        var elementId = $(this).attr('id').split('_');
        var sectionId = makeID(elementId, 2);
        var tabId = makeID(elementId, 1);
        if (typeof sectionTimeout == 'number') {
            clearTimeout(sectionTimeout);
            sectionTimeout = '';
        }
        if (visibleSection != '' && visibleSection != sectionId) {
            closeSection(visibleSection);
        }
        returnFlag = true;
        openSection(sectionId);
    });

    $('.sectionWrapper').on('mouseleave', function(event) {
        var elementId = $(this).attr('id').split('_');
        var sectionId = makeID(elementId, 2);
        var tabId = makeID(elementId, 1);
        var relTar = event.relatedTarget;
        if (relTar != null) {
            var tarClass = $(relTar).attr('class');
            if (tarClass == 'menubg' || tarClass == 'dropDownTitle' || tarClass == 'dropDownSubNav') {
                if (visibleSection != '')
                    sectionTimeout = setTimeout(closeSectionTimeout, 200);
            }
        }
    });

    var closeSectionTimeout = function() {
        if (visibleSection != '')
            closeSection(visibleSection);
    }

    //when entering a side menu, note that it the most recently visited one
    $('.sideMenu').on('mouseenter', function(event) {
        var elementId = $(this).attr('id').split('_');
        var sectionId = makeID(elementId, 2);

        if (typeof sectionTimeout == 'number') {
            clearTimeout(sectionTimeout);
            sectionTimeout = '';
        }
    });

    //whenever the mouse leaves a child element of the menu bar, check to see if it enters another child.
    //if it doesn't, close the menu
    $('.navDropdownsMenu *').on('mouseleave', function(event) {
        if (visibleTab != '') {
            var targetElement = event.relatedTarget;
            if (targetElement != null) {
                //search through the target's parent elements until one with an id is found.
                while ($(targetElement).attr('id') == '' || $(targetElement).attr('id') == null) {
                    if (targetElement.parentNode == null) {
                        break;
                    }
                    targetElement = targetElement.parentNode;
                }
                var child = $(targetElement).attr('id');
                //if we can't find an id, set a default one
                if (child == null)
                    child = 'aspnetForm';

                child = '#' + child;
                var parent = '#tabMenuShop';

                //jquery function to see if an element is the descendent of another element
                if ($(child, $(parent)).length != 1) {
                    if (visibleSection != '') {
                        closeSection(visibleSection);
                    }
                    closeTab(visibleTab);
                }
            } else {
                if (visibleSection != '') {
                    closeSection(visibleSection);
                }
                closeTab(visibleTab);
            }
        }
    });

    //needs to handle expandable with a delay,
    //when user hovers over content there should be a slight delay before it opens,
    //if they leave the element before 
    $('.subMenuContent').on('mouseenter', function(event) {
        var sectionId = makeID($(this).attr('id').split('_'), 3);
        var content = 'content_' + sectionId;
        var index = contentTracker.length;
        var toClose;
        var detailIndex;
        var checkSection = sectionId.split('_');
        var checkContent;

        if (!expandable(sectionId, content) && linkHasRef('#' + content))
            $('#' + content).find('a').css('cursor', 'pointer');

        for (var i = 0; i < index; i++) {
            checkContent = contentTracker[i].split('_');
            if (checkSection[0] + '_' + checkSection[1] == checkContent[0] + '_' + checkContent[1]) {
                if (checkSection[2] != checkContent[2]) {
                    toClose = contentTracker[i];
                    detailIndex = i;
                    break;
                } else
                    return false;
            }
        }
        determineAction(sectionId, toClose, 'sub', detailIndex);
    });

    //if a clicked link is the same as the current page, ignore it
    $('a').on('click', function(event) {
        var target = $(this).attr('href');
        var curPage = window.location.pathname;
        if (target == curPage || target == '') {
            event.preventDefault();
        }
    });
    //checks to see if a menu has any content
    function menuHasContent() {
        var header = '#header_';
        var menu = '#menu_';
        var subNav = '.sectionWrapper, .titleImage';
        for (var i = 0; i < numTabs; i++) {
            shouldMenuOpen[i] = 0;

            if ($(header + i).children(menu + i).size() > 0) {
                if ($(menu + i).children(subNav).size() > 0) {
                    shouldMenuOpen[i] = 1;
                }
            }
        }
    }

    //opens the first menu detail for each menu
    function openDefaultMenuContent() {
        var defaultNum = '1';
        var tempcontent;
        var tempsection;
        var contentId;

        for (var i = 1; i <= numTabs; i++) {
            tempsection = $('#menu_' + i).children('.sectionWrapper').size();
            for (var j = 1; j <= tempsection; j++) {
                tempcontent = $('#subMenuContent_' + i + '_' + j).children('.subMenuContent').size();
                if (tempcontent > 0) {
                    contentId = i.toString() + '_' + j.toString() + '_' + '1';
                    $('#content_' + contentId).find('div, img').css('display', 'block');
                    contentTracker.push(contentId);
                }
            }
        }
    }

    //hides all menu details
    function closeAllContent() {
        $('.subMenuDetail').hide();
        $('.detailImage').hide();
        $('.menuSectionImage').hide();
        $('.menuSectionDetail').hide();
    }

    function disableEmptyLinks() {
        $('a[href=""]').css('cursor', 'default');
    }

    //see if the given content link has a reference or not
    function linkHasRef(content) {
        var linkRef = $(content).find('a').attr('href');
        if ($.trim(linkRef) == '')
            return false;

        return true;
    }

    //Shift and reduce the width of content with an associated image
    function handleImageOffset(text, images) {
        for (var i = 0; i < $(images).size(); i++) {
            $(text[i]).css('margin-left', $(images[i]).width() + 10);
            $(text[i]).css('width', $(text[i]).width() - $(images[i]).width());
        }
    }

    //toggle the navdropdowns on and off
    function navDropdownsOn(section) {
        if (typeof (section.length) == 'undefined')
            return false;
        var head = '#header_' + section;
        visibleTab = section;

        var owidth = $(head).width();
        var offset = getItemLeft('.tabOn');
        var mleft = relativeLocation('.tabOn', head, offset);
        var oTop = $(head).offset().top;

        $('.tabOn, .tabMark').css({
            top: oTop,
            left: mleft,
            width: owidth
        });
        $('.tabOn, .tabMark').show();
    }

    function navDropdownsOut(section) {
        if (typeof (section.length) == 'undefined')
            return false;
        $('.tabOn, .tabMark').hide();
    }

    //turn the sub-menu content on/off
    function subMenuContentOn(section) {
        var contentId = 'subMenuContent_' + section
        document.getElementById(contentId).style.visibility = 'visible';
    }

    function subMenuContentOff(section) {
        var contentId = 'subMenuContent_' + section
        document.getElementById(contentId).style.visibility = 'hidden';
    }

    function openSection(secID) {
        if (typeof secID.length == 'undefined')
            return false;

        determineAction(secID, openContent, 'tab', -1);
        var section = '#sectionWrapper_' + secID;
        var hasContent = $(section).html().indexOf('rightArrow');

        if (hasContent != -1) {
            visibleSection = secID;
            subMenuContentOn(secID);
            displaySubMenu(secID.split('_')[0]);
            showOpenSubMark(secID);
        }
    }

    function closeSection(secID) {
        if (typeof secID.length == 'undefined')
            return false;

        var section = '#sectionWrapper_' + secID;

        //if (openAnimationFlag || closeAnimationFlag)
        cancelAnimation();
        hideSub();
        hideTabSmart();
        subMenuContentOff(secID);
        ignoreSubMenu(secID.split('_')[0]);
        subColorOff(section);
        openContent = '';
        visibleSection = '';
    }

    function subColorOff(ID) {
        $(ID + ' > a').css('color', WHITE);
        $(ID + ' > a > .rightArrow').css('border-left-color', WHITE);
    }

    //control link color when hovering over the corresponding section
    function greenLink(sectionNav) {

        var elementTag = 'headerLink_' + sectionNav;
        //hard coded to check for home tab just to shut the IE debugger up
        if (elementTag != 'headerLink_0') {
            document.getElementById(elementTag).style.color = GREENTEXT;
            $('#' + elementTag + '~.downArrow').css('border-top-color', GREENTEXT);
        }
    }

    function whiteLink(sectionNav) {
        var elementTag = 'headerLink_' + sectionNav;
        //hard coded to check for home tab just to shut the IE debugger up
        if (elementTag != 'headerLink_0') {
            document.getElementById(elementTag).style.color = WHITE;
            $('#' + elementTag + '~.downArrow').css('border-top-color', WHITE);
        }
    }

    //simply calls the functions that open/close tabs
    function openTab(section) {
        navDropdownsOn(section);
        greenLink(section);
        displayMenu(section);
    }

    function closeTab(section) {
        cancelSectionFlag = true;
        whiteLink(section);
        hideMarkers();
        hideMenu(section);
        navDropdownsOut(section);
    }

    function hideMarkers() {
        checkMarkTimeout();
        //if (openAnimationFlag || closeAnimationFlag)
        cancelAnimation();
        hideTab();
        hideSub();
        $('.dropDownSubNav, .dropDownSubNav > a, .dropDownSubNav > p').css('color', WHITE);
        $('.rightArrow').css('border-left-color', WHITE);
    }

    function hideTabSmart() {
        if (tabToggle)
            $('#tabm_2').hide();
        else
            $('#tabm_1').hide();
    }

    function hideTab() {
        openContent = '';
        $('.sectionMarker').hide();
        $('.menuSectionImage').hide();
        $('.menuSectionDetail').hide();
    }

    function getStyleObject(objectId) {
        // cross-browser function to get an object's style object given its id
        if (document.getElementById && document.getElementById(objectId)) {
            // W3C DOM
            return document.getElementById(objectId).style;
        } else if (document.all && document.all(objectId)) {
            // MSIE 4 DOM
            return document.all(objectId).style;
        } else if (document.layers && document.layers[objectId]) {
            // NN 4 DOM.. note: this won't find nested layers
            return document.layers[objectId];
        } else {
            return false;
        }
    } // getStyleObject

    //show/hide menu background
    function menuBgOn(ID, tab) {
        if (tab > 0) {
            var mHeight = mHeightArray[tab - 1];
            $(ID).css('height', mHeight);
            $(ID).show();
            menuBotOn(ID, mHeight);
        }
    }

    function menuBgOff(ID) {
        $(ID).hide();
        menuBotOff(ID);
    }

    function menuBotOn(ID, height) {
        var botID = getMenuBot(ID);
        var tLoc = $(ID).offset().top + height - 5;
        $(botID).css('top', tLoc);
        $(botID).show();
    }

    function menuBotOff(ID) {
        var botID = getMenuBot(ID);
        $(botID).hide();
    }

    function getMenuBot(ID) {
        if (ID.charAt(1) == 'l')
            return '#lBGBot';
        else
            return '#rBGBot';
    }

    //make visible objects hidden and hidden objects visible
    function changeObjectVisibility(objectId, newVisibility, tab) {
        var styleObject = getStyleObject(objectId);
        if (styleObject) {
            if (newVisibility == 'visible') {
                menuBgOn('#lMenuBG', tab);
            }
            styleObject.visibility = newVisibility;
            return true;
        } else {
            return false;
        }
    } // changeObjectVisibility

    //determines if menu content should be expanded or not based on if it has any details
    function expandable(id, content) {
        var contentText = $('#' + content + ' > .subMenuDetail').text();
        var contentImage = $('#' + content + ' > .detailImage').attr('src');

        if (typeof contentImage == 'undefined' && $.trim(contentText) == '')
            return false;

        return true;
    }

    function displayMenu(tabId) {
        var menuId = 'menu_' + tabId;
        var toVisible = 'visible';
        setMenuLoc('#' + menuId);
        if (shouldMenuOpen[tabId] == 0) {
            toVisible = 'hidden';
        }
        if (changeObjectVisibility(menuId, toVisible, tabId)) {
            return true;
        } else {
            return false;
        }
    }

    //alternate function to show/hide submenus
    function displaySubMenu(mOrder) {
        var mId = 'subMenu_' + mOrder;
        setMenuLoc('#' + mId);
        menuBgOn('#rMenuBG, #mShadow', mOrder);
        document.getElementById(mId).style.visibility = 'visible';
    }

    function ignoreSubMenu(mOrder) {
        var mId = 'subMenu_' + mOrder;
        menuBgOff('#rMenuBG, #mShadow');

        if (document.getElementById(mId) != null)
            document.getElementById(mId).style.visibility = 'hidden';
    }

    function hideMenu(menuNumber) {
        if (document.getElementById('menu_' + menuNumber) != null) {
            changeObjectVisibility('menu_' + menuNumber, 'hidden');
            menuBgOff('#lMenuBG');
        }
        visibleTab = '';
    }

    //get the set the top/left styles for a menu background
    function setMenuLoc(ID) {
        var menuBG;
        var menuBot;
        var shadow = '';
        if (ID.split('_')[0] == '#menu') {
            menuBG = '#lMenuBG';
            menuBot = '#lBGBot';
        } else {
            menuBG = '#rMenuBG';
            shadow = '#mShadow';
            menuBot = '#rBGBot';
        }

        var offset = getItemLeft(menuBG);
        var mleft = relativeLocation(menuBG, ID, offset);
        //var mtop = $(ID).offset().top;

        var mtop;
        if ($(ID).offset() == undefined)
            mtop = 0;
        else
            mtop = $(ID).offset().top;

        //$(menuBG + ', ' + shadow + ', ' + menuBot).css({ left: mleft, top: mtop });

        if (shadow != '') {
            $(menuBG + ', ' + shadow + ', ' + menuBot).css({
                left: mleft,
                top: mtop
            });
        } else
            $(menuBG + ', ' + menuBot).css({
                left: mleft,
                top: mtop
            });
    }

    //Get the left position of an element relative to the body
    function getItemLeft(elem) {
        if ($(elem).css('display') == 'none')
            return getHiddenLeft(elem);
        else
            return $(elem).offset().left;
    }

    function makeID(splitId, depth) {
        switch (depth) {
            case 1:
                return splitId[1];
            case 2:
                return splitId[1] + '_' + splitId[2];
            case 3:
                return splitId[1] + '_' + splitId[2] + '_' + splitId[3];
        }
    }

    function simpleMenuHeight() {
        var maxHeight = 0;

        for (var i = 1; i < numTabs; i++) {
            maxHeight = simpleHeightCompare(i);
            mHeightArray.push(maxHeight);
        }
    }

    function simpleHeightCompare(menuId) {
        var left = simpleLeftMenuHeight('#menu_' + menuId);
        var right = simpleRightMenuHeight(menuId);

        if (left > right)
            return left;

        return right;
    }

    function simpleLeftMenuHeight(menuId) {
        return $(menuId).outerHeight() + maxWrapContent.shift();
    }

    function simpleRightMenuHeight(menuId) {
        var savedHeight;
        var result;
        var maxSubMenuHeight = 0;
        var sideMenuId = '#subMenuContent_';
        $('#subMenu_' + menuId).children('.sideMenu').each(function(index) {
            savedHeight = maxSubContent.shift().split('-');
            result = $(sideMenuId + savedHeight[0]).outerHeight() + parseInt(savedHeight[1]);
            if (maxSubMenuHeight < result) {
                maxSubMenuHeight = result;
            }
        });
        return maxSubMenuHeight;
    }

    function getMaxMenuContent() {
        var numSideMenus;
        var numWrapperMenus;
        var sideMenuIDs;
        var id;
        var max = 0;
        var maxIndex;
        var toPush

        for (var i = 1; i < numTabs; i++) {
            numWrapperMenus = $('#menu_' + i).children('.sectionWrapper').size();
            sideMenuIDs = $('#subMenu_' + i).children('.sideMenu');
            numSideMenus = sideMenuIDs.size();
            max = 0;

            $('#menu_' + i + ' > .sectionWrapper').each(function(index) {
                if (max < $(this).outerHeight()) {
                    max = $(this).outerHeight();
                }
            });
            maxWrapContent.push(max);

            $('#subMenu_' + i).children('.sideMenu').each(function(index) {
                $(this).children('.subMenuContent').each(function(index) {
                    if (max < $(this).outerHeight()) {
                        max = $(this).outerHeight();
                        maxIndex = index + 1;
                    }
                });
                var menuID = $(this).attr('id').split('_');
                id = makeID(menuID, 2);
                toPush = id + '-' + max + '-' + $(this).children('.subMenuContent').size();
                maxSubContent.push(toPush);
            });
        }
    }

    function relativeLocation(start, end, hidden) {

        //var detOffset = $(end).offset().left;
        var detOffset;
        if ($(end).offset() == undefined)
            detOffset = 0;
        else
            detOffset = $(end).offset().left;

        var relLeft = parseInt($(end).css('left'), 10);
        var markLeft = parseInt($(start).css('left'), 10);
        if (detOffset - hidden <= 1 && detOffset - hidden >= -1)
            detOffset = hidden;
        return detOffset - hidden + markLeft;
    }

    //gets the starting/ending location values for the markers, selVal is a boolean value to indicate whether to return the ending value for the opening or closing item
    function markValues(open, close, selVal) {
        var cSel;
        var oSel;
        var ret = '';
        var test = close;

        if (open.split('_')[0] == '#content') {
            cSel = close + ' > a > .subMenuDetail, ' + close + ' > a > .detailImage';
            oSel = open + ' > a > .subMenuDetail, ' + open + ' > a > .detailImage';
        } else {
            cSel = close + ' > a > .menuSectionDetail, ' + close + ' > a > .menuSectionImage';
            oSel = open + ' > a > .menuSectionDetail, ' + open + ' > a > .menuSectionImage';
        }

        if (selVal)
            test = open;

        ret += detValues(test) + '-';
        $(cSel).hide();
        $(oSel).show();
        ret += detValues(test);
        $(cSel).show();
        $(oSel).hide();

        return ret;
    }

    //Get a set of values for the given id
    function detValues(id) {
        return $(id).offset().top + '_' + $(id).offset().left + '_' + $(id).outerHeight();
    }

    //generic function to open/close markers
    function handleMarkers(toOpen, toClose, type, index) {
        var ID = '#content_';
        var open;
        var close;
        var markType;
        var mark = getSubMarkID();
        var closeMark;
        var vals;
        var markID = '1';
        var wait = false;

        if (type == 'tab') {
            ID = '#sectionWrapper_';
            mark = getTabMarkID();
        }

        open = ID + toOpen;
        close = ID + toClose;
        vals = markValues(open, close, true);
        displayMarker(open, mark, vals, type);

        if (toClose != '' && (willExpand(close) || willExpand(open)))
            wait = true;

        var executeMarks = function() {
            if (toClose != '') {
                vals = markValues(open, close, false).split('-');
                closeMenuContent(type, close, mark, vals[1]);
            }
            vals = markValues(open, close, true).split('-');
            openMenuContent_new(type, open, mark, vals[1], index);
        }

        if (open != close) {
            if (wait) {
                markerTimeout = setTimeout(executeMarks, expandDelay);
                timeoutElem = open;
            } else
                executeMarks();
        }
    }

    //toggle to get the ID of the marker to close
    function switchMark(mark) {
        var splitmark = mark.split('_');

        if (splitmark[1] == '1')
            return splitmark[0] + '_2';
        else
            return splitmark[0] + '_1';

    }

    //function called to display the last open content of a newly opened sub menu
    function showOpenSubMark(secID) {
        var ID = '#content_' + curSubContent(secID);
        var mark = switchMark(getSubMarkID());
        var vals = detValues(ID);
        vals += '-' + vals;
        $(ID + ' > a').css('color', GREENTEXT);
        displayMarker(ID, mark, vals, 'sub');
    }

    function getTabMarkID() {
        if (tabToggle)
            return '#tabm_2';
        else
            return '#tabm_1';
    }

    //get the appropriate sub menu marker ID
    function getSubMarkID() {
        if (subToggle)
            return '#sub_2';
        else
            return '#sub_1';
    }

    //check the given ID against the content tracker array
    function curSubContent(secId) {
        var splitSec = secId.split('_');
        var splitTracker;
        for (var i = 0; i < contentTracker.length; i++) {
            splitTracker = contentTracker[i].split('_');
            if (splitSec[0] == splitTracker[0] && splitSec[1] == splitTracker[1])
                return contentTracker[i];
        }
        return secId + '_1'; //return the first item if a match isn't found
    }

    //display a marker based on the element ID, the marker ID, and the marker values
    function displayMarker(ID, mark, vals, type) {
        if (linkHasRef(ID))
            $(ID + ' > a').css('cursor', 'pointer');
        $(ID + ' > a').css('color', GREENTEXT);
        $(ID + ' > a > .rightArrow').css('border-left-color', GREENTEXT);
        var states = vals.split('-');
        var start = states[0].split('_');
        setMark(mark, ID, start, type);
    }

    //animate a closing marker, hide it, and change the color
    function closeMenuContent(type, ID, mark, end) {
        var vals = end.split('_');
        $(ID).find('a').css('cursor', 'default');
        var cmark = switchMark(mark);

        if (willExpand(ID)) {
            closeAnimationFlag = true;
            closeAnimationId = mark;
            $(cmark).animate({
                top: parseInt(vals[0]) - 1,
                height: parseInt(vals[2])
            }, 'fast');
            $(ID).find('a > div, a > img').stop(true, true).slideUp('fast', function() {
                endClose(ID, cmark);
                closeAnimationFlag = false;
                closeAnimationId = '';
            });
        } else {
            endClose(ID, cmark);
        }

    }

    function endClose(ID, m) {
        $(m).hide();
        $(ID).find('a').css('color', WHITE);
        $(ID).find('.rightArrow').css('border-left-color', WHITE);
    }

    //like the current version, but flexible and optimized
    function openMenuContent_new(type, ID, mark, end, index) {
        var vals = end.split('_');
        var yoffset = -2;
        var hoffset = 5;
        openAnimationFlag = true;
        openAnimationId = mark;
        if (type == 'tab') {
            yoffset = 2;
            hoffset = -6;
        }

        if (willExpand(ID) || closeAnimationFlag)
            $(mark).animate({
                top: parseInt(vals[0]) + yoffset,
                height: parseInt(vals[2]) + hoffset
            }, 150);

        if (willExpand(ID)) {

            if ($(ID).find('a > div').css('display') == 'none' || $(ID).find('a > img').css('display') == 'none') {
                $(ID).find('a > div, a > img').stop(true, true).slideDown('fast', function() {
                    if (openAnimationFlag = false)
                        $(mark).hide();
                    openAnimationFlag = false;
                    openAnimationId = '';
                    $(ID + ' > a').css('color', GREENTEXT);
                    markerTimeout = '';
                });
                $(ID).find('div', 'img').css('display', 'block');
            }


            if (type == 'tab') {
                tabToggle = !tabToggle;
                openContent = makeID(ID.split('_'), 2);
            } else {
                subToggle = !subToggle;
                contentTracker[index] = makeID($(ID).attr('id').split('_'), 3);
            }
        } else {
            if (type == 'tab') {
                openContent = makeID(ID.split('_'), 2);
            } else {
                contentTracker[index] = makeID($(ID).attr('id').split('_'), 3);
            }
        }
    }

    //if the given container has child img or div, return true;
    function willExpand(id) {
        if (($(id + ' > a > img, ' + id + ' > a > div').size() - $(id + ' > a > .rightArrow').size()) == 0)
            return false;
        return true;
    }


    //set the position for a marker
    function setMark(mark, ID, vals, type) {
        var tOff = -2; //constants that add padding to sub menu details, not needed for tab menu
        var hOff = 5;
        var menu;
        if (type == 'tab') {
            tOff = 0;
            hOff = 0;
            menu = '#lMenuBG';
        } else {
            menu = '#rMenuBG';
        }
        var markLeft = parseInt($(menu).css('left'));
        $(mark).css({
            top: parseInt(vals[0]) + tOff,
            left: markLeft,
            height: parseInt(vals[2]) + hOff
        });
        $(mark).show();
    }

    //get the left value of a hidden element
    function getHiddenLeft(mark) {
        $(mark).show();
        var left = $(mark).offset().left;
        $(mark).hide();
        return left;
    }

    //determine if marker animation should occur or not
    function determineAction(open, close, type, index) {
        if (checkMarkTimeout()) {
            var mark;
            if (type == 'tab')
                mark = getTabMarkID();
            else
                mark = getSubMarkID();
            $(mark).hide();
            $(timeoutElem + ' > a, ' + timeoutElem + ' > p').css('color', WHITE);
            timeoutElem = '';
        }
        if (open != close)
            handleMarkers(open, close, type, index);
    }

    function cancelAnimation() {
        var animationElements = '#tabm_1, #sub_1, #sub_2';
        $(animationElements).stop();
        //$(closeAnimationId).stop();
        //$(openAnimationId).stop();
        //$(openAnimationId+ ', '+ closeAnimationId).hide();
        openAnimationFlag = false;
        closeAnimationFlag = false;
        openAnimationId = '';
        closeAnimationId = '';
    }

    //hide sub menu markers
    function hideSub() {
        $('.detailMarker').hide();
    }

    function checkMarkTimeout() {
        if (typeof markerTimeout == 'number') {
            clearTimeout(markerTimeout);
            markerTimeout = '';
            return true;
        }
        return false;
    }

	$('#tabMenuShop').on('click', 'dropDownSubNav', function(){
        $(window).hashchange();
        
	});

};