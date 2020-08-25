(function() {
  app = {
    configSlideshow: function() {
      return {
          active_slide_class: 'active'
        , active_indicator_class: 'current'
        , slideshow_selector: '.slideshow'
        , animation_in_class: 'animation-in'
        , animation_out_class: 'animation-out'
        , slideshow_selector: '.slideshow'
      };
    }
  };

    
  Revolver.registerTransition('step', function(options, done) {
    var self = this
      , $currentSlide = $rs(this.slides[this.currentSlide])
      , $nextSlide = $rs(this.slides[this.nextSlide]);

    $currentSlide.addClass('animated');
    var temp_elements = $currentSlide.children().add($currentSlide.find('.slider-container, .slider-mastercontainer').children())
      , elements = $rs.unique(temp_elements)
      , speed = (parseFloat($currentSlide.css('animation-duration')) || parseFloat($currentSlide.css('-webkit-animation-duration')) || 1) * 1000
      , interval = Math.floor(speed / elements.length / 3)
      , i = 0
      , flag;
    $currentSlide.removeClass('animated');

    var stepInterval = setInterval(function() {
      if (i === elements.length) {
        clearInterval(stepInterval);
        $currentSlide.addClass('animated fadeOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
          elements.removeClass('animated fadeOutLeft');
          $rs(this).removeClass(app.configSlideshow().active_slide_class + ' animated fadeOutLeft');
            $nextSlide.addClass(app.configSlideshow().active_slide_class + ' animated fadeInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
              $rs(this).delay(25).removeClass('animated fadeInLeft');
              flag = 1;
            });
        });
        return;
      }

      $rs(elements[i]).addClass('animated fadeOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        return false;
      });

      i++;
    }, interval);

    var wait = setInterval(function() {
      if (flag === 1) {
        clearInterval(wait);
        ($rs.isFunction(done)) ? done() : this;
      }
    }, 100);
  });

  Revolver.registerTransition('smooth', function(options, done) {
    var $container, $currentSlide, $nextSlide, $prevSlide, complete, flag;

    $container = $rs(this.container);
    $nextSlide = $rs(this.slides[this.nextSlide]);
    $prevSlide = $rs(this.slides[this.previousSlide]);
    $currentSlide = $rs(this.slides[this.currentSlide]);
    $container.animate({'height': $nextSlide.outerHeight()}, 500);
    $currentSlide.addClass('animated fadeOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $rs(this).removeClass(app.configSlideshow().active_slide_class + ' animated fadeOut');
    });
    $nextSlide.css({'position': 'absolute', 'top': '0', 'left': '0'}).addClass(app.configSlideshow().active_slide_class + ' animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
      $rs(this).delay(25).removeClass('animated fadeIn');
      $rs(this).css({'position': '', 'top': '', 'left': ''});
      $container.css('height', '');
      flag = 1;
    });
    var wait = setInterval(function() {
      if (flag === 1) {
        clearInterval(wait);
        ($rs.isFunction(done)) ? done() : this;
      }
    }, 100);
    return this;
  });

 

  Revolver.registerTransition('custom', function(options, done, $triggered, isElement) {
    var self = this
      , animation_in_class = app.configSlideshow().animation_in_class
      , animation_out_class = app.configSlideshow().animation_out_class
      , $currentSlide = $triggered || $rs(this.slides[this.currentSlide])
      , $nextSlide = $triggered || $rs(this.slides[this.nextSlide])
      , active_slide_class = $triggered ? '' : app.configSlideshow().active_slide_class
      , $slideshow = $currentSlide.closest(app.configSlideshow().slideshow_selector)
      , animation_element_out = $slideshow.attr('data-animation-element-out') || ''
      , animation_element_in = $slideshow.attr('data-animation-element-in') || ''
      , animation_slide_in = isElement ? animation_element_in : ($slideshow.attr('data-animation-slide-in') || '')
      , animation_slide_out = isElement ? animation_element_out : ($slideshow.attr('data-animation-slide-out') || '')
      , animationEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
      , doElement = function($element, animation, state) {
          if(!animation || animation === 'none') {
            return;
          }
          var animation_class = state === 'out' ? animation_out_class : animation_in_class;
          $element.addClass(animation_class + ' animated ' + animation).one(animationEvents, function() {
            state === 'in' && $rs(this).removeClass(animation_class + ' animated ' + animation);
            return false;
          });
        }
      , doSlide = function($slide, state, elements, animations) {
          var animation = $slide.attr('data-animation-' + state) || (state === 'out' ? animation_slide_out :  animation_slide_in)
            , animation_class = state === 'out' ? animation_out_class : animation_in_class;
          if(animation && animation !== 'none') {
            $slide.addClass(animation_class + ' ' + active_slide_class + ' animated ' + animation).one(animationEvents, function() {
              $slide.removeClass(animation_class + ' ' + active_slide_class + ' animated ' + animation);
              if(state === 'out') {
                elements.removeClass(animations.join(' ') + ' animated ' + animation_class);
                doElements($nextSlide, 'in');
              } else {
                $nextSlide.addClass(active_slide_class);
                nextSlideSpeed = $nextSlide.attr('data-rotationspeed');
                flag = 1;
              }
              return false;
            });
          } else if(state === 'out') {
            elements.removeClass(animations.join(' ') + ' animated ' + animation_class);
            $slide.removeClass(active_slide_class + ' animated ' + animation_class);
            doElements($nextSlide, 'in');
          } else {
            elements.removeClass(animations.join(' ') + ' animated ' + animation_class);
            $currentSlide.removeClass(active_slide_class + ' animated ' + animation_class);
            $nextSlide.addClass(active_slide_class);
            nextSlideSpeed = $nextSlide.attr('data-rotationspeed');
            flag = 1;
          }
        }
      , doElements = function($slide, state) {
          $slide.addClass('animated');
          var temp_elements = $slide.children('.slide > *').add(($slide.find('.slider-container, .slider-mastercontainer')).add($slide.filter('.slider-container, .slider-mastercontainer')).children())
            , elements = $rs.unique(temp_elements)
            , animations = [];

          for(var i = state === 'in' ? elements.length : 0; ; state === 'out' ? i++ : i--) {
            if (i >= elements.length) {
              $triggered ? setTimeout(function(){ doSlide($slide, state, elements, animations); }, 0) : doSlide($slide, state, elements, animations);
              if(state === 'out') {
                break;
              }
            } else {
              var $element = $rs(elements[i])
                , animation = $element.attr('data-animation-' + state) || (state === 'out' ? animation_element_out :  animation_element_in);

              animations.push(animation);
              doElement($element, animation, state);
            }
            if(i < 0) {
              break;
            }
          }
        }
      , nextSlideSpeed
      , flag;

    doElements($currentSlide, 'out');

    var wait = setInterval(function() {
      if (flag === 1) {
        !$triggered && self.status.playing && self._clearInterval();
        !$triggered && self.status.playing && (self.intervalId = setInterval(_.bind(self.transition, self), parseFloat(nextSlideSpeed || self.options.rotationSpeed)));
        clearInterval(wait);
        ($rs.isFunction(done)) ? done() : this;
      }
    }, 100);
  });

  $rs = jQuery.noConflict();
  $rs(document).ready(function($rs) {
    var mySlider, options, regex
      , slide_link = document.location.href.match(/#(?:(?!\?).)*/g)
      , arr_of_id = $rs("#cc-slideshow-32b15f01 .slides_container > [id]").map(function(){
          return $rs(this).attr('id') || undefined;
        });

    

    $rs("#cc-slideshow-32b15f01 .slide." + app.configSlideshow().active_slide_class).css('opacity', 1);
    options = {
      container: $rs('#cc-slideshow-32b15f01 .slides_container').get(0),
      slides: $rs('#cc-slideshow-32b15f01 .slide').get(),
      autoPlay: $rs("#cc-slideshow-32b15f01 .slideshow").data('autoplay') || false,
      rotationSpeed: $rs("#cc-slideshow-32b15f01 .slideshow").data('rotationspeed') || "3500",
      loop: false,
      iterations: $rs("#cc-slideshow-32b15f01 .slideshow").data('iterations') || Infinity,
      endslide: $rs("#cc-slideshow-32b15f01 .slideshow").data('endslide'),
      transition: {
        name: $rs("#cc-slideshow-32b15f01 .slideshow").data('transition') || "default"
      }
    };

    Revolver.setSelectorEngine($rs.find);
    mySlider = new Revolver(options);

    if ($rs("#cc-slideshow-32b15f01 .slideshow").data('initial-transition') === true) {
      mySlider.currentSlide = 1;

      mySlider.goTo(0, {name: $rs("#cc-slideshow-32b15f01 .slideshow").data('transition')});
      mySlider.one('transitionComplete', function() {
        $rs(this.slides[1]).removeClass('no-show');
      });
    }


  

    // Goto slide by link
    if (slide_link) {
      var index = $rs(slide_link[0]).index();
      if (!!~$rs.inArray(slide_link[0].replace('#', ''), arr_of_id)) {
        mySlider.goTo(index, {name: "default"});
      }
    }
  });
}).call(this);

