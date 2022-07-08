/** SLIDER */
$(function() {
    /** MV */
    var $mv = $('.mv__slider').rubyslider({
      fx: 'line',
      speed: 600,
      width: 1080,
      margin: 10,
      pag: {
        type: 'bullet'
      }
    })
  
    /** SCENE */
    var $slider = $('.scene__slider').rubyslider({
      fx: 'line',
      speed: 800,
      width: 1415,
      margin: 10,
      pag: {
        type: 'bullet',
        sizeAuto: 'self',
      },
      isSlideshow: true,
      slideshow: {
        timer: 'line'
      }
    })
  
    /** LINEUP */
    var $slider = $('.lineup-gallery__slider').rubyslider({
      fx: 'line',
      speed: 800,
      width: 1415,
      margin: 10,
      pag: {
        type: 'bullet',
        sizeAuto: 'self',
      },
      isSlideshow: true,
      slideshow: {
        timer: 'line'
      }
    })
  });
  
  
  
  
  
  
  /**
   * SECTION WITH POSITION FIXED WHEN SCROLL
   * Hỗ trợ header khi scroll sẽ ở vị trí fixed
   * Thêm class `scroll-fixed` vào header.
   * Phần Scroll Inner sẽ là element chuyển đổi vị trí `position` chính
   * Thêm class `.scroll-inner` element bên dưới để tính toán vị trí
   * Hỗ trợ element holder để giữ vị trí chiều cao giống header --> hỗ trợ hiệu ứng mượt hơn
   * Thêm elemnt với class `.scroll-holder` để thiết lập holder
   * Thêm data `fixed-bottomin` để trở tới vị trí chỉ định, khi scroll tới ví trí đó thì header sẽ chuyển sang vị trí fixed
   */
  (function ($) {
    $(function() {
      var $scrollFixed = $('.scroll-fixed');
      var actived = 'fixed-actived';
      var enabled = 'fixed-enabled';
      var inViewport = 'fixed-in-viewport';
      var hChenhlenh = 10;
    
      $scrollFixed.each(function() {
        var $fixed = $(this);
        var targetBottomIn = $fixed.data('fixed-bottomin');
        var targetBottomOut = $fixed.data('fixed-bottomout');
        var $targetBottomIn = $(targetBottomIn);
        var $targetBottomOut = $(targetBottomOut);
    
    
        // THỰC HIỆN LÚC BAN ĐẦU
        toggleActiveWhenGotoTarget($fixed, 'fixed-bottomin')
        toggleActiveWhenGotoTarget($fixed, 'fixed-bottomout')
    
        // THIẾT LẬP EVENT SCROLL
        $(document).on('scroll', function(e) {
          toggleActiveWhenGotoTarget($fixed, 'fixed-bottomin')
          toggleActiveWhenGotoTarget($fixed, 'fixed-bottomout')
        })
    
        // THIẾT LẬP EVENT RESIZE
        var timer2;
        $(window).resize(function() {
          clearTimeout(timer2)
          timer2 = setTimeout(function() {
            toggleActiveWhenGotoTarget($fixed, 'fixed-bottomin')
            toggleActiveWhenGotoTarget($fixed, 'fixed-bottomout')
          }, 200)
        })
        
    
        /**
         * FUNCTION THIẾT LẬP CHÍNH
         */
        function toggleActiveWhenGotoTarget($fixed, dataTarget) {
          var $inner = $fixed.find('.scroll-inner');
          var $holder = $fixed.find('.scroll-holder');
          var target = $fixed.data(dataTarget);
          var $target = $(target);
    
          // Điều kiện thực hiện
          if ( !($inner.length && $target.length) ) return
          // Setup chiều cao cho $holder
          $fixed.addClass(enabled)
          $holder.css('min-height', $inner.innerHeight())
    
    
          // Tiếp tục thiết lập
          var rectFixed = $fixed[0].getBoundingClientRect();
          var rectTarget = $target[0].getBoundingClientRect();
          var rectInner = $inner[0].getBoundingClientRect();
          var hWin = $(window).height();
          var fixedTopInViewport = Math.round(rectFixed.top - hWin);
    
          /**
           * CLASS `ACTIVED`
           * Thêm class `actived` vào $scroll khi vượt qua đối tượng $target
           */
          var boundaryToShow;
          if (dataTarget == 'fixed-bottomin') {
            boundaryToShow = Math.round(rectTarget.bottom - hWin);
          }
          else if (dataTarget == 'fixed-bottomout') {
            boundaryToShow = Math.round(rectTarget.bottom);
          }
          
          // So sánh
          if (boundaryToShow < 0) {
            $fixed.addClass(actived)
          }
          else {
            $fixed.removeClass(actived)
          }
    
    
          /**
           * PHỤC HỒI VỊ TRÍ
           * Khi $fixed trong Viewport thì phục hồi vị trí
           */
          if (fixedTopInViewport < 0 && rectFixed.bottom > 0) {
            $fixed.addClass(inViewport)
          }
          else {
            $fixed.removeClass(inViewport)
          }
    
          // Cập nhật lại kích thước của holder
          if ($holder.length) {
            $holder.css('min-height', Math.round(rectInner.height))
          }
        }
      })
    })
  })(jQuery);
  
  
  
  
  
  /**
   * SCROLL TO ANCHOR LINK
   * - Hỗ trợ di chuyển lúc ban đầu khi trên đường dẫn HTTP
   * - Hỗ trợ di chuyển tới vị trí cụ thể (Number) và di chuyển tới vị trí của ID/Class Node
   * - Hỗ trợ Header Bar (vị trí fixed) : sẽ trừ đi chiều cao để thấy được trọn vẹn vùng target
   * - Hỗ trợ WPAdmin: sẽ trừ đi chiều cao của id "wpadminbar" nếu nó tồn tại
   * - Hỗ trợ phần chênh lệch với thuộc tính `data-goto-diff()`
   */
  $(function() {
    // return false;
    var $goAnchor = $('[data-goto-anchor]')
    var goDuration = 150
  
  
    // Thiết lập di chuyển Anchor Link lúc ban đầu khi có ID trên đường link http
    setTimeout(thietlapDichuyenAnchorlinkBangHTTP, 200)
  
  
    // Thiết lập di chuyển tới Anchor Link trên các Link
    $goAnchor.each(function() {
      var $this = $(this)
  
      $this.on('click', function(e) {
        e.preventDefault() 
        thietlapDichuyentoiAnchorLink($this)
      })
    })
  
  
    /**
     * FUNCTION THIẾT LẬP DI CHUYỂN TỚI ANCHOR LINK
     */
    function thietlapDichuyentoiAnchorLink($link, target) {
      var duration = $link.data('goto-duration') || goDuration
      var diff = $link.data('goto-diff')
      var chenhlech = false
      var type = false
      var href = $link.attr('href')
      var $target
  
      // Thiết lập đối tượng target
      if (target == undefined) {
        target = $link.data('goto-anchor')
      }
  
  
      // Hỗ trợ [data-goto-anchor] là Number và ID/Class DOM
      if ($.isNumeric(target)) {
        type = 'vitri'
      }
      else if ( !/^\s*$/.test(target) ) {
        $target = $( target )
        if ($target.length) {
          type = 'idClass'
        }
        /**
         * Trường hợp: khi trên trang không có anchor link và đường link có href có giá trị khác '#'
         * --> Di chuyển sang đường dẫn có giá trị trong href
         */
        else {
          if (href !== '#') {
            type = 'newPage'
            // Go to new page
            return window.location = href
          }
        }
      }
  
      // Điều kiện tiếp tục thực hiện
      if (!type) return;
  
  
      // Setup phần chêch lệch
      chenhlech = GetChenhLech(diff)
      var chenhlechHeader = GetChenhLechHeader()
      var chenhlechWPAdminbar = GetChenhLechWPAdminbar()
  
      // Setup phần vị trí cụ thể
      var vitriTarget = false
      if (type == 'vitri') {
        vitriTarget = target
      }
      else if (type == 'idClass') {
        vitriTarget = $target.offset().top - chenhlechHeader - chenhlechWPAdminbar
      }
  
      // console.log("#1", $target, $target.offset().top, $target[0].getBoundingClientRect())
      if (vitriTarget !== false) {
        $([document.documentElement, document.body]).animate({
          scrollTop: vitriTarget - chenhlech + 1
        }, {
          duration: duration,
  
          // Đóng lại Menu khi click và Link
          start: function() {
            if (!!window.navMain) {
              window.navMain.pushOff()
            }
          },
  
          // Fixed phần chênh lệch không đúng vị trí sau khi di chuyển scrolling
          complete: function() {
            var chenhlechFinal = GetChenhLech(diff)
            if (chenhlechFinal != chenhlech) {
  
              $([document.documentElement, document.body]).animate({
                scrollTop: vitriTarget - chenhlechFinal + 1
              }, 200)
            }
          }
        })
      }
    }
  
  
    /**
     * THIẾT LẬP DI CHUYỂN TỚI ANDCHOR LINK TRÊN HTTP LÚC BAN ĐẦU
     */
    function thietlapDichuyenAnchorlinkBangHTTP() {
      var hrefHash = window.location.hash;
      if (hrefHash != "") {
        var $target = $(hrefHash)
  
        if ($target.length) {
          thietlapDichuyentoiAnchorLink($target, hrefHash)
        } 
      }
      return false
    }
  
  
    // Function setup phần chênh lệnh
    function GetChenhLech(diff) {
      if ($.isNumeric(diff)) {
        return parseInt(diff)
      }
      else if (/^\.|#/.test(diff)) {
        return $(diff).outerHeight()
      }
      return 0
    }
  
    // Thiết lập chênh lệch Header Fixed
    // Chỉ thiết lập chênh lệch khi phần Header ở vị trí "fixed"
    function GetChenhLechHeader() {
      var $header = $(".site-branding.scroll-inner")
      var hHeader = $header.outerHeight()
      
      // if ($header.css('position') == 'fixed') {
      if ($header.length) {
        return hHeader
      }
      return 0
    }
  
    // Thiết lập chênh lệch WP AdminBar
    function GetChenhLechWPAdminbar() {
      var $wpAdminBar = $("#wpadminbar")
      var hAdminbar = $wpAdminBar.outerHeight()
      
      // if ($header.css('position') == 'fixed') {
      if ($wpAdminBar.length) {
        return hAdminbar
      }
      return 0
    }
  });
  
  
  
  
  
  /** WOW - SCROLL ANIMATION */
  $(function() {
    var wow = new  WOW({
      // boxClass: "wow", // animated element css class (default is wow)
      // animateClass: "animated", // animation css class (default is animated)
      offset: 100, // distance to the element when triggering the animation (default is 0)
      // mobile: true, // trigger animations on mobile devices (default is true)
      live: true, // act on asynchronously loaded content (default is true)
      // callback: function (box) {
      //   // the callback is fired every time an animation is started
      //   // the argument that is passed in is the DOM node being animated
      // },
      // scrollContainer: null, // optional scroll container selector, otherwise use window
    })
    wow.init()
  });
  
  
  
  
  
  /** COLLAPSE TOGGLE */
  $(function() {
    var $btnToggle = $('.faq__toggle, .collapse__toggle')
    var classHeader = '.faq__quest, .collapse__header'
    var classActive = 'collapse--active'
    var duration = 250
  
    // Function toggle active class
    var toggleActive = function($header, $target, $toggle) {
      // Case: active
      if ($header.hasClass(classActive)) {
        $toggle.removeClass(classActive)
        $target
          .stop(true)
          .slideUp(duration, function() {
            $header.removeClass(classActive)
          })
      }
      // Case: no active
      else {
        $toggle.addClass(classActive)
        $header.addClass(classActive)
        $target
          .stop(true)
          .slideDown(duration)
      }
    }
  
    /** SETUP EACH BUTTON TOGGLE **/
    $btnToggle.each(function() {
      var $btn = $(this)
      var $header = $btn.closest(classHeader)
      var $contentNext = $header.next()
  
      // Add class on the initialization
      if ($header.hasClass(classActive)) $btn.addClass(classActive)
      
      // Check active class at first
      // toggleActive($header, $contentNext)
      // Event click on button
      $btn.on('click', function(e) {
        e.preventDefault()
        toggleActive($header, $contentNext, $btn)
      })
    })
  });