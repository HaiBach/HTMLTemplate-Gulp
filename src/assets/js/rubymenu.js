/**
 * RUBY MENU JQUERY PLUGIN
 * @plugin Menu
 * 
 * Biến $link định nghĩa cho {ns}link
 * Biến $linkItem định nghĩa cho link <a>
 * 
 * @author        HaiBach
 * @version       1.x
 * @lastUpdate    10-10-2018
 */
 ;(function($) {
    'use strict';
    
    
    /**
     * KHOI TAO CAC BIEN GLOBAL
     */
    if( !window.rm01VA ) {
    
      window.rm01VA = {
        rubyName : 'rubymenu',
        rubyData : 'menu',
        namespace : 'rm01'
      };
    
      /**
       * OPTIONS DEFAULT
       */
      rm01VA.optsDefault = {
        isAutoInit : true,
        isOffCanvas : true,
        isBreadcrumb : false,
    
        name : null,
        direction : 'hor',
        textBack : null,
        widthOffCanvas : [0, 767],
        selectorToggle : null, // Tim kiem button Toggle outside
        html : {
          caret : '<span class="{ns}caret"></span>',
          toggle : '<a class="{ns}btn-toggle"><span></span><span></span><span></span></a>',
          back : '<li class="{ns}list {ns}listback"><a class="{ns}linkback"><span class="{ns}arrowback">&lsaquo;</span></a></li>',
          linkWrapper : '<div class="{ns}link"></div>',
          breadcrumb : '<div class="{ns}breadcrumb"></div>',
          breadcrumbHome : '<a class="{ns}breadcrumb-item {ns}breadcrumb-home">Home</a>',
          breadcrumbItem : '<a class="{ns}breadcrumb-item"></a>'
        }
      };
    }
    
    
    
    
    /**
     * CODE MAIN SETUP
     */
    $[rm01VA.rubyName] = function($ruby, OptsJS) {
    
      /**
       * GLOBAL VARIABLES
       */
      var va = {
        codekey : Math.ceil( Math.random() * 1e9 ),   // Moi link co 1 codekey rieng biet
        ns : rm01VA.namespace
      };
      var cs = {
        $ruby : $ruby,                // Store the top menu
        ev : $('<div/>')              // Event trigger: beforeOpen, afterOpen, beforeClose, afterClose
      };
      var o = {};
      var is = {};
    
    
    
    
    
    
      /**
       * INITIALIZATION FUNCTION
       */
      var INIT = function() {
    
        // Uu tien thu tu
        PROP.MergeAllOpts();
        PROP.Init();
        PROP.CssName();
        M.AddClass();
        RENDER.AddElements();
        RENDER.BreadcrumbAtFirst();
    
        EVENTS.Resize();
        EVENTS.TapOpenCanvas();
        EVENTS.TapOnLink();
      },
    
    
    
    
    
    
      /**
       * FUNCTION M
       */
      M = {
    
        /**
         * CHEN THEM CLASS CHO MENU LUC BAN DAU
         */
        AddClass : function() {
          var ns = va.ns;
    
          /**
           * CHEN CLASS 'READY' DE HIEN MENU
           */
          $ruby.addClass(ns +'ready');
    
    
    
          /**
           * CHEN CLASS 'DRAWER' CHO MENU VERTICAL
           */
          !is.dirsHor && $ruby.addClass(ns +'drawer');
    
    
    
          /**
           * CHEN CLASS 'LEVEL' VAO UL
           */
          var fnMenuLevel = function($parent, selector, classes) {
            var $ul = $parent.find( M.NS(selector) );
            if( $ul.length ) $ul.addClass(va.ns + classes);
            return $ul;
          };
    
          var $menuLv1 = fnMenuLevel($ruby, '> .{ns}menu', 'menu-lv1');
          var $menuLv2 = fnMenuLevel($menuLv1, '> li > .{ns}menu', 'menu-lv2');
          var $menuLv3 = fnMenuLevel($menuLv2, '> li > .{ns}menu', 'menu-lv3');
    
    
    
          /**
           * CHEN CLASS 'LEVEL' VAO LIST
           */
          var $lists = fnMenuLevel($ruby, '.{ns}menu > li', 'list');
          var $listLv1 = fnMenuLevel($menuLv1, '> li', 'list-lv1');
          var $listLv2 = fnMenuLevel($menuLv2, '> li', 'list-lv2');
          var $listLv3 = fnMenuLevel($menuLv3, '> li', 'list-lv3');
    
    
    
          /**
           * CHEN CLASS 'PARENT LEVEL' VAO LIST
           */
          var fnListParentLevel = function($parent, classes) {
    
            var $list = $parent.find( M.NS('> .{ns}menu > li') );
            $list.each(function() {
              var $li = $(this);
              var $menuChild = $li.find( M.NS('.{ns}menu') );
    
              if( $menuChild.length ) $li.addClass( va.ns + classes);
            });
            return $list;
          };
    
          // Chen them class 'List Parent Level' 1 & 2
          va.$listParentLV1 = fnListParentLevel($ruby, 'list-parent-lv1');
          va.$listParentLV2 = fnListParentLevel(va.$listParentLV1, 'list-parent-lv2');
        },
    
    
    
    
        // Thay doi Namespace cho doan chuoi
        NS : function(str) {
          return str.replace(/\{ns\}/g, va.ns);
        },
    
        // Chuyen doi 'string' thanh 'object'
        StringToObject : function(str) {
    
          if( typeof str == 'string' ) {
            // Thay the dau phay ke'p thanh dau' pha?y don - neu co
            str = str.replace(/\u0027/g, '\u0022');
            str = $.parseJSON(str);
          }
          return $.isPlainObject(str) ? str : {};
        },
    
        // Chuyen doan chuoi thanh CamelCase: 'animaiton-duraiton' -> 'animationDuration'
        CamelCase : function(str) {
          return str.replace(/-([a-z])/gi, function(m, str) {
            return str.toUpperCase();
          });
        },
    
        // Viet hoa chu~ cai dau tien
        ProperCase : function(str) { return str.charAt(0).toUpperCase() + str.slice(1); },
    
        // Kiem tra kich thuoc Window trong Range
        MatchMedia : function(min, max) {
    
          // Truong hop Browser ho tro matchMedia
          if( !!window.matchMedia ) {
            var str = '(min-width: WMINpx) and (max-width: WMAXpx)'.replace('WMIN', min).replace('WMAX', max);
            if( window.matchMedia(str).matches ) return true;
          }
    
          // Truong hop binh thuong : khong hop tro matchMedia
          else {
            var wWin = $(window).width();
            if( wWin >= min && wWin <= max ) return true;
          }
    
          return false;
        },
    
        /**
         * SEARCH ELEMENTS EXCEPT FORM RUBY-NESTED
         *  + Remove nested ruby
         */
        Find : function($target, selector) {
    
          var $result     = $target.find(selector),
            $rubyNested   = $target.find('.' + va.ns),
            $resultNested = $rubyNested.find(selector);
    
          // Loai bo doi tuong trong Ruby Nested
          $result = $result.not($resultNested);
          return $result;
        }
      },
    
    
    
    
    
      /**
       * PROPERTIES FUNCTION
       */
      PROP = {
        MergeAllOpts : function() {
    
          /**
           * LAY DATA TREN HTML5
           *  + Kiem tra option tren data co phai json
           *  + Dam bao chuyen doi ra JSON neu co cau truc object
           */
          var optsData = $ruby.data(rm01VA.rubyData);
          optsData = M.StringToObject(optsData);
    
    
          /**
           * MERGE OPTIONS :
           *  + Go.p tat da~ option tren data main va data js vao` option default cua Code
           *  + Thu' tu. uu tien: [optsData] > [OptsJS] > [options Default]
           */
          o = $.extend(true, o, rm01VA.optsDefault, OptsJS, optsData);
    
    
          /**
           * LOAI BO DATA TREN MENU
           */
          $ruby.removeAttr('data-' + rm01VA.rubyData);
        },
    
        /**
         * SETUP NHUNG BIEN KHOI TAO BAN DAU
         */
        Init : function() {
          is.dirsHor = o.direction == 'hor';
    
          // Name of Ruby menu
          va.name = o.name || $ruby.attr('id') || null;
    
          // Setup nhung bien trong co Huo'ng Vertical
          if( !is.dirsHor ) {
            is.drawer = true;
          }
    
          // Store menu open at first
          va.$menuOpenCur = $ruby.find( M.NS('> .{ns}menu') );
    
          // Store variables at first
          va.$listOpen = $();
          va.$listActived = $();
          va.$breadcrumbItem = $();
        },
    
        /**
         * SETUP NHUNG BIEN CO LIEN QUAN DEN CSS3
         */
        CssName : function() {
    
          /**
           * FUNCTION CLASS LAY PREFIXED CSS3
           */
          var getPrefix = function(prop) {
            var style = document.createElement('p').style;
            var vender = 'Webkit Moz ms O'.split(' ');
            var prefix = '-webkit- -moz- -ms- -o-'.split(' ');
    
            // Truoc tien kiem tra style khong co' vender
            var styleCase = M.CamelCase(prop);
            if( style[styleCase] != undefined ) return '';
    
    
            // Tiep tuc kiem tra neu co' vender
            // Dau tien chuyen doi style thanh Upper --> vi du 'flex-wrap' thanh 'FlexWrap'
            var preStyle = M.ProperCase(styleCase);
            // Kiem tra tung vender
            for( var i = 0, len = vender.length; i < len; i++ ) {
              if( style[vender[i] + preStyle] != undefined ) return prefix[i];
            }
            return '';
          };
    
          va.prefix = getPrefix('animation-druation');
        },
    
        /**
         * UPDATE CAC THANH PHAN - BIEN KHI WINDOW RESIZE
         */
        Resize : function() {
          var wWin = $(window).width();
          var wOffCanvas = o.widthOffCanvas;
          var ns = va.ns;
          var classDirs = ns + o.direction;
          var classOff = ns +'offcanvas';
          var classDrawer = ns +'drawer';
          var classHanger = ns +'hanger';
    
    
          /**
           * DIEU KIEN THUC HIEN
           */
          // if( !o.isOffCanvas ) return;
    
    
          /**
           * TOGGLE MENU 'CLASSIC' VA 'OFF-CANVAS'
           */
          is.offCanvasLast = is.offCanvas;
          is.offCanvas = o.isOffCanvas;
    
          // Tiep tuc kiem tra OffCanvas Range value neu options cho phep
          if( is.offCanvas ) is.offCanvas = M.MatchMedia(wOffCanvas[0], wOffCanvas[1]);
    
          // Setup Class cho trang thai 'Classic' va 'OffCanvas'
          var classStateClassic = classDirs + (is.dirsHor ? ' '+ classHanger : '');
          var classStateOff = classOff + (is.dirsHor ? ' '+ classDrawer : '');
    
          // Setup Class 'Add' + Class 'Remove' cho Cho Menu
          var classAdd = is.offCanvas ? classStateOff : classStateClassic;
          var classRemove = is.offCanvas ? classStateClassic : classStateOff;
    
          // Truoc tien loai bo classes truoc tien
          // Sau do Them classes vao Menu
          $ruby.addClass(classAdd).removeClass(classRemove);
    
    
    
    
          /**
           * SHOW BUTTON TOGGLE
           */
          var classShow = va.ns +'show';
          if( is.offCanvas ) va.$canvasToggle.addClass(classShow);
          else va.$canvasToggle.removeClass(classShow);
    
    
    
          /**
           * SETUP OTHERS
           */
          if( is.offCanvas ) {
            if( is.dirsHor ) is.drawer = true
          }
          else {
            // Loai bo Class 'Push'
            API.pushOff();
            if( is.dirsHor ) is.drawer = false;
          }
    
          // Loai bo Class 'Open'
          if( is.offCanvas != is.offCanvasLast ) API.removeOpenAll();
        }
      },
    
    
    
    
    
      /**
       * RENDER FUNCTION
       */
      RENDER = {
    
        /**
         * SERACH THE ELEMENTS OF OUTSIDE RUBY
         */
        SearchNode : function(classSearch) {
          var $dom = $();
          var NAME = va.name;
    
    
          /**
           * CONDITIONAL EXECUTION: MUST BE 'NAME' DEFINED
           */
          if( NAME !== null && NAME !== undefined ) {
            $(classSearch).each(function() {
    
              var $item = $(this);
              var markupData = $item.data(rm01VA.rubyName + 'Markup');
    
              // Get object if value in data link name of ruby
              if( markupData === NAME ) $dom = $item;
            });
    
            // Return object
            if( $dom.length ) return $dom;
          }
    
    
    
          /**
           * KEEP SEARCHING OBJECT INSIDE RUBY
           */
          var $findNext = M.Find($ruby, classSearch);
    
          // Return object found
          return $findNext.length ? $findNext : $();
        },
    
        /**
         * CHEN CAC THANH PHAN CAN THIET VAO MENU LUC BAN DAU
         */
        AddElements : function() {
    
          /**
           * WRAPPER TAG <A> LINK
           * Để layout css, event caret sẽ riêng biệt với đường link
           */
          var $linkItem = $ruby.find( M.NS('.{ns}list > a') );
          $linkItem.wrap( M.NS(o.html.linkWrapper) );
          va.$link = $linkItem.closest( M.NS('.{ns}link') );
    
    
    
          /**
           * CHEN BUTTON BACK TREN SUB MENU
           */
          va.$linkBack = $();
          var $menuLv2 = $ruby.find( M.NS('> .{ns}menu .{ns}menu') );
    
          $menuLv2.each(function() {
            var $menuCur = $(this);
            var $linkNear = $menuCur.siblings( M.NS('.{ns}link') );
            var $linkItemNear = $linkNear.find('a');
            var strLink = o.textBack;
    
            // Noi dung cua Link back
            if( strLink == null ) {
              strLink = $linkItemNear.length ? $linkItemNear.html() : '';
            }
    
            // Chen them Link back vao Menu Lv3
            var $listbackCur = $( M.NS(o.html.back) );
            var $linkbackCur = $listbackCur.find('a');
    
            $linkbackCur.html( $linkbackCur.html() + strLink );
            $menuCur.prepend($listbackCur);
            va.$linkBack = va.$linkBack.add($linkbackCur);
          });
    
    
    
          /**
           * LINK TOGGLE + LINK CARET
           * Thêm link caret vào sau link tag
           * Tìm kiếm và setup link toggle
           */
          var $link = $ruby.find( M.NS('.{ns}menu .{ns}menu') ).siblings( M.NS('.{ns}link') );
          var $linkItem = $link.find('a');
    
          va.$linkToggle = $();
          $linkItem.after( M.NS(o.html.caret) );
          $linkItem.each(function() {
            var $itemCur = $(this);
            var linkHref = $itemCur.prop('href');
            var $caret = $itemCur.next( M.NS('.{ns}caret') );
            var $toggleCur = (/^#/.test(linkHref) || !linkHref) ? $itemCur : $caret;
            // Lưu trữ link toggle
            va.$linkToggle = va.$linkToggle.add($toggleCur);
          });
    
    
    
          /**
           * CHEN BUTTON TOGGLE VAO MENU CHINH
           * + Tim kiem hoac tao element $CanvasToggle
           */
          if( o.selectorToggle !== null ) {
            var $find = $( o.selectorToggle );
            if( $find.length ) va.$canvasToggle = $find;
          }
    
          if(  !(!!va.$canvasToggle && va.$canvasToggle.length) ) {
            va.$canvasToggle = $( M.NS(o.html.toggle) );
            $ruby.before(va.$canvasToggle);
          }
    
    
    
    
          /**
           * STORE LINK <A> NORMAL UNDER LIST - MENU
           */
          va.$link = $ruby.find( M.NS('.{ns}list > a') ).not(va.$linkToggle).not(va.$linkBack);
        },
    
        // Render the markup breadcrumb at first
        BreadcrumbAtFirst : function() {
    
          // Conditional execution
          if( !o.isBreadcrumb ) return;
    
          // Continue setup
          // Case: Search markup breadcrumb at outside
          var $breadcrumb = RENDER.SearchNode(M.NS('.{ns}breadcrumb'));
          if( $breadcrumb.length ) {
            va.$breadcrumb = $breadcrumb;
          }
    
          // Case: create new markup breadcrumb
          else {
            va.$breadcrumb = $( M.NS(o.html.breadcrumb) );
            $ruby.before(va.$breadcrumb);
          }
    
    
          // Add breadcrumb-home at first
          va.$breadcrumb.append( $(M.NS(o.html.breadcrumbHome)) );
        },
    
        // Update the markup breadcrumb
        BreadcrumbUpdate : function() {
          if( !o.isBreadcrumb ) return;
    
          // Continue setup
          // Reset all breadcrumb-item
          va.$breadcrumbItem.remove();
          va.$breadcrumbItem = $();
    
          // Find the new breadcrumb-item
          va.$listActived.each(function() {
            var $linkCur = $(this).find('> a');
            var $newItem = $( M.NS(o.html.breadcrumbItem) ).text( $linkCur.text() );
    
            va.$breadcrumbItem = va.$breadcrumbItem.add($newItem);
          });
    
          // Append new breadcrumbItem into breadcrumb
          va.$breadcrumb.append(va.$breadcrumbItem);
        }
      },
    
    
    
    
    
      /**
       * SETUP EVENTS CHO MENU
       */
      EVENTS = {
    
        Resize : function() {
          var evName = 'resize.'+ va.ns + va.codekey;
    
          // Loai bo va Dang ki lai Event resize cho Window
          $(window)
            .off(evName)
            .on(evName, function() {
    
              clearTimeout(va.tiResize);
              va.tiResize = setTimeout(function() {
    
                PROP.Resize();
              }, 100);
            });
    
    
          // Thuoc hien Cap nhat bien lan dau tien
          PROP.Resize();
        },
    
        /**
         * EVENT TAP TREN BUTTON TOGGLE OFF-CANVAS
         */
        TapOpenCanvas : function() {
          var $html = $('html');
          var tapEvName = 'click.'+ va.ns + va.codekey;
    
          // DANG KI EVENT TAP TREN BUTTON
          va.$canvasToggle.on(tapEvName, function() {
            if( is.push ) {
              API.pushOff();
              API.removeOpenAll();
            }
            else {
              API.pushOn();
            }
    
            return false;
          });
    
    
    
          /**
           * DANG KI EVENT TAP TREN DOCUMENT -> DE LOAI BO PUSH
           */
          $('html, body').on(tapEvName, function(e) {
            var $target = $(e.target);
            var $targetMenu = $target.closest('.' + va.ns);
    
            /**
             * DIEU KIEN THUC HIEN FUNCTION
             * Tap o ngoai Menu
             */
            if( $targetMenu.is($ruby) ) return;
    
    
    
            /**
             * SETUP TRUONG HOP OFF-CANVAS
             */
            if( is.offCanvas ) {
              // Loai bo Class 'Open' tren cac List + Menu
              // API.removeOpenAll();
            }
            else {
              // Loai bo het doi tuong co Class 'Open'
              if( is.dirsHor ) API.removeOpenAll();
            }
          });
        },
    
        /**
         * EVENT TAP TREN BUTTON LINK / LINK-TOGGLE / LINK-BACK
         */
        TapOnLink : function() {
          var ns = va.ns;
          var tapEvName = 'click.'+ ns + va.codekey;
    
    
          /**
           * REGISTER EVENT 'TAP' ON LINK <A>
           */
          va.$link.on(tapEvName, function() {
            var $link = $(this);
    
            // Conditional execution
            if( !$link.is(va.$linkCur) ) {
    
              // Remove & reset the actived list
              va.$listActived.removeClass(ns + 'actived');
              va.$listActived = $();
    
              // Search list parent in the current link
              var $listParent = $link;
              var $listActived = $();
    
              do {
                $listParent  = $listParent.parent().closest( M.NS('.{ns}list') );
                $listActived = $listActived.add($listParent);
              } while( $listParent.length );
    
              // Add class 'actived' on the list-parent
              $listActived.addClass(ns + 'actived');
    
              // Store the current link & list-actived
              va.$linkCur = $link;
              va.$listActived = $listActived;
    
              // Update the markup breadcrumb
              RENDER.BreadcrumbUpdate();
            }
          });
    
    
    
          /**
           * REGISTER 'TAP' EVENT ON LINK-TOGGLE
           */
          va.$linkToggle.on(tapEvName, function() {
            var $link = $(this).closest( M.NS('.{ns}link') );
            API.openMenu( $link );
          });
    
    
    
          /**
           * REGISTER 'TAP' EVENT ON LINK-BACK
           */
          va.$linkBack.on(tapEvName, function() {
    
            // Search link-parent of link-back
            var $linkParent = $(this).closest( M.NS('.{ns}menu') ).siblings( M.NS('.{ns}link') );
    
            // API close the child menu
            API.closeMenu($linkParent);
          });
        }
      },
    
    
    
    
    
      /**
       * EFFECT FOR MENU
       */
      FX = {
        /**
         * THE 'HANGER' EFFECT - FOR MENU HORIZONBTAL
         */
        Hanger : function($linkCur) {
          var $listParent = $linkCur.closest( M.NS('.{ns}list') );
          var $menuParent = $linkCur.closest( M.NS('.{ns}menu') );
          var $menuCur = $linkCur.siblings( M.NS('.{ns}menu') );
          var ns = va.ns;
          var classOpen = ns +'open';
          var classFxOpen = ns +'fx-open';
    
    
          /**
           * LOAI BO CLASS 'OPEN' + SETUP HIEU UNG 'FX OUT'
           */
          if( $listParent.hasClass(classOpen) ) {
    
            // Loai bo tat ca cac doi tuong co class 'Open'
            API.removeOpenAll($menuParent);
          }
    
    
    
          /**
           * CHEN CLASS 'OPEN' + SETUP HIEU UNG 'FX IN'
           */
          else {
            // Truoc tien loai bo class 'Open' cua Link parent anh em
            API.removeOpenAll($menuParent);
    
            // Them class 'Open' de hien thi Menu dau tien
            $menuParent.add($listParent).addClass(classOpen);
    
            // Them class 'FX IN' vao List parent
            $menuCur.addClass(classFxOpen);
    
            // Thoi gian dien ra hieu ung 'Fx open'
            var speedFxOpen = parseFloat( $menuCur.css(va.prefix +'animation-duration') ) * 1000;
    
    
            // Setup cac bien khi chay xong hieu ung 'Fx open'
            clearTimeout(va.tiFxHanger);
            va.tiFxHanger = setTimeout(function() {
    
              // Loai bo class 'Fx open'
              $menuCur.removeClass(classFxOpen);
            }, speedFxOpen);
          }
        },
    
        /**
         * HIỆU ỨNG DRAWER - NGĂN KÉO TRÊN SP
         * 
         * + MenuGhost dùng để thực hiện hiệu ứng In. Sử dụng MenuGhost sẽ dễ dàng setup hiệu ứng In/Out hơn so với thuộc tính 'transition'
         * + Timeout được setup để loại bỏ MenuGhost và thêm/loại bỏ class sau cùng
         * + Duration Timeout sẽ được lấy từ 'animation-duration' css của MenuCur và MenuGhost
         * 
         * + Khi fx-open: MenuGhost sẽ copy menuOpenCur để thực hiện hiệu ứng In. MenuCurrent sẽ thực hiện hiệu ứng Out.
         * + Khi fx-closed: MenuGhost sẽ copy menuParent để thực hiện hiệu ứng In. MenuCurrent thực hiện hiệu ứng Out.
         */
        Drawer : function($linkCur) {
          var $listParent = $linkCur.closest( M.NS('.{ns}list') );
          var $menuParent = $linkCur.closest( M.NS('.{ns}menu') );
          var ns = va.ns;
          var classOpen = ns + 'open';
    
    
          /**
           * FUNCTION TOGGLE EFFECT OPEN - CLOSE MENU
           */
          function Toggle() {
    
            // Automatically recognizes the current status
            var isOpen = !$listParent.hasClass(classOpen);
    
    
            /**
             * SETUP NHUNG BIEN PHAN BIET BOI 'STATUS'
             */
            var classFx, $menuLast, $menuGhost;
            if( isOpen ) {
              classFx = ns + 'fx-open';
              $menuLast = $menuParent;
    
              // Store the current menu-open
              va.$menuOpenCur = $linkCur.siblings( M.NS('.{ns}menu') );
              $menuGhost = va.$menuOpenCur.clone().addClass(ns + 'ghost');
    
              // Add the list & menu open to global variable
              va.$listOpen = va.$listOpen.add($listParent).add($menuParent);
            }
            else {
              classFx = ns + 'fx-closed';
              $menuLast = $linkCur.siblings( M.NS('.{ns}menu') );
    
              // Store the current menu-open
              va.$menuOpenCur = $menuParent;
    
              // Setup phan Menu Ghost
              $menuGhost = $menuParent.clone().removeClass(classOpen).addClass(ns + 'ghost');
              $menuGhost.find( M.NS('.{ns}ghost') ).remove();
              $menuGhost.find( M.NS('.{ns}open') ).removeClass(classOpen);
    
              // Remove list & menu close out global variable
              va.$listOpen = va.$listOpen.not($listParent).not($menuParent);
            }
    
    
    
            /**
             * BAT DAU HIEU UNG 'FX CLOSED'
             *  + Them Menu Ghost vao Menu Parent
             *  + Them Class 'Fx open' vao Menu Parent va Ghost
             */
            $menuLast
              .after($menuGhost)
              .add($menuGhost).addClass(classFx);
    
            // Lay Toc do Lo'n nhat cua Hieu u'ng hien tai
            var durationName = va.prefix +'animation-duration';
            var speedLast = parseFloat( $menuLast.css(durationName) );
            var speedGhost = parseFloat( $menuGhost.css(durationName) );
    
            va.speedCur = (speedLast > speedGhost) ? speedLast : speedGhost;
            va.speedCur *= 1000;
    
    
    
    
            /**
             * LOAI BO CLASS 'FX CLOSED' + MENU GHOST KHI HOAN THANH HIEU UNG
             */
            clearTimeout(va.tiFxDrawer);
            va.tiFxDrawer = setTimeout(function() {
    
              // Them - Loai bo class 'Open' tren Menu parent
              $menuParent.add($listParent)[ isOpen ? 'addClass' : 'removeClass' ](classOpen);
    
              // Loai bo doi tuong Menu ghost
              $menuGhost.remove();
    
              // Loai bo class 'Fx in' tren Menu vua added
              $menuLast.removeClass(classFx);
            }, va.speedCur - 10);
          }
    
    
    
          /**
           * RUN FUNCTION
           */
          $listParent.length && Toggle();
        },
        Drawer1 : function($linkCur) {
          var $listParent = $linkCur.closest( M.NS('.{ns}list') );
          var $menuParent = $linkCur.closest( M.NS('.{ns}menu') );
          var ns = va.ns;
          var classOpen = ns + 'open';
    
    
          /**
           * FUNCTION TOGGLE EFFECT OPEN - CLOSE MENU
           */
          function Toggle() {
    
            // Automatically recognizes the current status
            var isOpen = !$listParent.hasClass(classOpen);
    
            /**
             * SETUP NHUNG BIEN PHAN BIET BOI 'STATUS'
             */
            if( isOpen ) {
    
              // Add the list & menu open to global variable
              va.$menuOpenCur = $linkCur.siblings( M.NS('.{ns}menu') );
              va.$listOpen = va.$listOpen.add($listParent).add($menuParent);
            }
            else {
    
              // Store the current menu-open
              va.$menuOpenCur = $menuParent;
    
              // Remove list & menu close out global variable
              va.$listOpen = va.$listOpen.not($listParent).not($menuParent);
            }
    
            // Them - Loai bo class 'Open' tren Menu parent
            $menuParent.add($listParent)[ isOpen ? 'addClass' : 'removeClass' ](classOpen);
          }
    
    
          /**
           * RUN FUNCTION
           */
          $listParent.length && Toggle();
        }
      },
    
    
    
    
    
    
      /**
       * API
       */
      API = {
        // Go to the link
        goto : function($link) {
          var classActived = va.ns + 'actived';
          var classOpen = va.ns + 'open';
    
          // Conditional execution=
          if( !($link && $link.length && va.$link.is($link) && !$link.is(va.$linkCur)) ) return;
    
          // Continue setup
          // Remove & reset the actived list
          va.$listActived.removeClass(classActived);
          va.$listActived = $();
    
          // Search list parent in the current link
          var $listParent = $link;
    
          do {
            $listParent = $listParent.parent().closest( M.NS('.{ns}list') );
            va.$listActived = va.$listActived.add($listParent);
          } while( $listParent.length );
    
          // Add class 'actived' on the list-parent
          va.$listActived.addClass(classActived);
    
          // Store the link-current
          va.$linkCur = $link;
    
    
    
    
          /**
           * SEARCH LINK-TOGGLE NO OPEN
           */
          var $listParent = $link;
          var $menuParent;
    
          // Reset list & menu open in variable at first
          va.$listOpen.removeClass(classOpen);
          va.$listOpen = $();
    
          do {
            $listParent = $listParent.parent().parent().closest( M.NS('.{ns}list') );
            $menuParent = $listParent.closest( M.NS('.{ns}menu') );
    
            // Check link-toggle exist
            if( $listParent.length ) {
              va.$listOpen = va.$listOpen.add($listParent).add($menuParent);
            }
          } while( $listParent.length );
    
          // Add class 'open' on list & menu-open
          va.$listOpen.addClass(classOpen);
    
    
    
    
          /**
           * OTHER SETUP
           */
          // Update the markup breadcrumb
          RENDER.BreadcrumbUpdate();
        },
    
        pushOff : function() {
          $('html').add($ruby).add(va.$canvasToggle).removeClass(va.ns +'push');
          is.push = false;
        },
        pushOn : function() {
          $('html').add($ruby).add(va.$canvasToggle).addClass(va.ns +'push');
          is.push = true;
        },
    
        // The parent menu open child menu
        openMenu : function($link) {
    
          // Conditional execution -> Ko phù hợp nữa
          // if( !($link && $link.length && va.$linkToggle.is($link)) ) return;
    
          // Continue setup
          var $listParent = $link.closest( M.NS('.{ns}list') );
          var classOpen = va.ns + 'open';
    
          if( $listParent.length ) {
    
            // Case: 'Drawer' effect
            if( is.drawer ) !$listParent.hasClass(classOpen) && FX.Drawer($link);
    
            // Case: 'Hanger' effect
            else FX.Hanger($link);
          }
        },
    
        // The child menu close
        closeMenu : function($link) {
    
          // Conditional execution
          // if( !($link && $link.length && va.$linkToggle.is($link)) ) return;
          
          // Continue setup
          FX.Drawer($link);
        },
    
        // Loai bo Class 'Open' tren cac List + Menu
        searchOpen : function($parent, selectorName) {
          var $open = $parent[selectorName]( M.NS('.{ns}open') );
          $open.length && $open.removeClass(va.ns +'open');
        },
        removeOpenAll : function($linkCur) {
          if( !$linkCur ) $linkCur = $ruby;
          API.searchOpen($linkCur, 'find');
        },
        removeOpenCur : function($linkCur) {
          API.searchOpen($linkCur, 'closest');
        },
    
        // Reset link-actived & link to menu-top
        reset : function() {
    
          // Reset the link-current
          va.$listActived.removeClass(va.ns + 'actived');
          va.$listActived = $();
    
          // Reset list & menu open in variable at first
          va.$listOpen.removeClass(va.ns + 'open');
          va.$listOpen = $();
        }
      };
    
    
    
    
    
    
      /* OTHER SETUP
      --------------------------------------------------------------------- */
      /* LUU TRU BIEN 'CS' VAO TRONG CODE */
      cs = $.extend(cs, API);
      $.data($ruby[0], rm01VA.rubyName, cs);
    
      /* THE INITIALIZATION MENU */
      INIT();
    };
    
    
    
    
    
    /**
     * KHOI TAO CODE
     *  + Cu phap : var code = $('..').rubyName();
     */
    $.fn[rm01VA.rubyName] = function() {
      var args = arguments;         // args[0] : options, args[1]: value
      var rubyName = rm01VA.rubyName;
      var rubyData = null;
    
    
      // Setup moi doi tuong
      $(this).each(function() {
        var self = $(this);
        var code = self.data(rubyName);
    
        // Tham so thu nhat luon luon la object --> de dang kiem tra
        if( args[0] === undefined ) args[0] = {};
    
        // Truong hop la object: khoi tao Code moi hoac update properties
        if( $.isPlainObject(args[0]) ) {
          // TAO CODE MOI
          if( !code ) new $[rubyName](self, args[0]);
    
          // Luu data cua code
          rubyData = self.data(rubyName);
        }
      });
    
      // Tra ve data cho doi tuong
      return rubyData;
    };
    
    
    
    
    /**
     * CODE AUTO INIT
     */
    var AUTOINIT = function($ruby) {
      $ruby.each(function() {
        $(this)[rm01VA.rubyName]();
      });
    
    
      $ruby.each(function() {
        var $self = $(this);
        var data = $self.data(rm01VA.rubyData) || {};
        var rubyName = rm01VA.rubyName;
    
    
        /**
         * CHECK RUBY INITIALIZATION
         *  + Remove automatically initialize for ruby
         */
        if( $.isPlainObject(data) && $.isEmptyObject(data) ) return;
    
    
    
        /**
         * CHECK BEFORE AUTOMATICALLY INITIALIZE
         *  + Check Data variable is Json + AutoInit
         *  + Check continue: data of ruby exist
         */
        !$self.data(rubyName) && $self[rubyName]();
      });
    };
    $(document).ready(function() { AUTOINIT( $('.' + rm01VA.namespace) ) });
    
    })(jQuery);