//Contact form

window.addEventListener("DOMContentLoaded", function() {

    // get the form elements defined in your form HTML above

    var form = document.getElementById("contacts-form");
    var resetButton = document.getElementById("contacts-reset");
    var status = document.getElementById("contacts-status");
    var statusText = document.getElementById("contacts-status-text");

    // Success and Error functions for after the form is submitted

    function success() {
        form.reset();
        form.style = "display: none";
        status.style = "display: block";
        statusText.style.color = "#28a745";
        statusText.innerHTML = "Данные успешно отправлнены!";
    }

    function error() {
        form.style = "display: none";
        status.style = "display: block";
        statusText.style.color = "#dc3545";
        statusText.innerHTML = "В отправке данных произошла ошибка! Попробуйте еще раз.";
    }

    if(resetButton) {
        resetButton.addEventListener("click", function() {
            form.style = "display: block";
            status.style = "display: none";
        });
    }

    if(form) {
        form.addEventListener("submit", function(ev) {
            ev.preventDefault();
            var data = new FormData(form);
            ajax(form.method, form.action, data, success, error);
        });
    }
});
function ajax(method, url, data, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader("Accept", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status === 200) {
            success(xhr.response, xhr.responseType);
        } else {
            error(xhr.status, xhr.response, xhr.responseType);
        }
    };
    xhr.send(data);
}

$(document).ready(function(){
    var mainPageOffset = $('main').offset().top;
    var navHeight = 68;
    var menuBtn = $('.js-menu-btn');
    var menuLink = $('.js-nav-link');
    var mobileNav = $('.d-header__nav--mobile');
    var header = $('.d-header');
    var copyrightYear = $('.d-copyright__year');
    var itemTile = $('.d-tiles__item');
    var preview = $('.js-preview');
    var modal = $('.js-modal');
    var modalOpenBtn = $('.js-modal-open');
    var tabs = $('.js-tabs');
    var faq = $('.js-faq');
    var navPreviewBtn = preview.find('.d-preview__navBtn');
    var isMobile = /iPhone|iPod|Android/i.test(navigator.userAgent);
    var currentYear = (new Date()).getFullYear();
    if (!isMobile) {
        toggleNavClass();
    }
    copyrightYear.text(currentYear);

    modalOpenBtn.on('click', function () {
        modal.addClass('is-open');
        $('body').addClass('is-modal-open');
    });

    modal.on('click', function (e) {
        if($(e.target).hasClass('js-modal-close') || !$(e.target).closest('.js-modal-content').length) {
            $(this).removeClass('is-open');
            $('body').removeClass('is-modal-open');
            $(this).find('.js-contacts-form').get(0).reset();
        }
    });

    //scroll to section
    menuLink.on('click', function(e) {
        e.preventDefault();
        scrollToSection($(this));
    });

    function scrollToSection(currentLink) {
        var linkOffset = $(currentLink.attr('href')).offset().top - navHeight + 20;
        $('html,body').animate({ scrollTop: linkOffset },500);
    }

    $(window).bind('scroll', function() {
        $(this).scrollTop() > $(window).height() ? $('.js-scroll-section').fadeIn() : $('.js-scroll-section').fadeOut();
        if (!isMobile) {
            toggleNavClass();
        }

        var currentTop = $(window).scrollTop();
        var elems = $('.d-section');
        elems.each(function(){
            var elemTop 	= $(this).offset().top;
            var elemBottom 	= elemTop + $(this).height();
            if(currentTop >= elemTop - navHeight && currentTop <= elemBottom){
                var id 		= $(this).attr('id');
                var navElem = $('a[href="#' + id+ '"]');
                navElem.parent().addClass('is-active').siblings().removeClass('is-active');
            }
        })
    });

    menuBtn.on('click', function () {
        if(mobileNav.hasClass('slideOutLeft')) {
            menuBtn.addClass('is-active');
            mobileNav.removeClass('slideOutLeft');
            mobileNav.addClass('animated slideInLeft');
            $('body').addClass('is-modal-open');
        } else {
            menuBtn.removeClass('is-active');
            mobileNav.removeClass('slideInLeft');
            mobileNav.addClass('animated slideOutLeft');
            $('body').removeClass('is-modal-open');
        }
    });

    itemTile.find('.d-tiles__itemBtn').on('click', function () {
        var image = $(this).parent().find('img');
        preview.addClass('is-open');
        $('body').addClass('is-modal-open');
        preview.find('img').attr( 'src', image.attr( 'src' ));
        preview.find('img').attr( 'data-index', image.attr( 'data-index' ));
    });

    navPreviewBtn.on('click', function () {
        var currentImg = preview.find('img');
        var imageNumber = $(this).hasClass('d-preview__navBtn--next')
            ? +currentImg.attr('data-index') + 1
            : +currentImg.attr('data-index') - 1;
        handleImagePreview(currentImg, imageNumber);
    });

    $(document).on('keydown', function (e) {
        var currentImg = preview.find('img');
        var imageNumber = 0;
        if(e.key === 'ArrowRight') {
            imageNumber = +currentImg.attr('data-index') + 1
        } else if (e.key === 'ArrowLeft') {
            imageNumber = +currentImg.attr('data-index') - 1
        }
        handleImagePreview(currentImg, imageNumber);
    });

    preview.on('click', function (e) {
        if($(e.target).hasClass('js-preview-close')) {
            preview.removeClass('is-open');
            $('body').removeClass('is-modal-open');
            preview.find('img').removeClass('is-zoomed');
        }
    });

    preview.find('img').on('click', function () {
        $(this).hasClass('is-zoomed')
            ? $(this).removeClass('is-zoomed')
            : $(this).addClass('is-zoomed');
    });

    function handleImagePreview(img, index) {
        var imagesLength = $('.d-tiles__item').length;
        if (index > imagesLength) {
            index = 1;
        } else if (index <= 0){
            index = imagesLength;
        }
        img.removeClass('is-zoomed');
        img.attr('data-index', index);
        img.attr('src', 'https://www.drapesdesign.com.ua/images/gallery/' + index + '.jpg');
    }

    function toggleNavClass() {
        var windowTop = $(window).scrollTop();
        windowTop > mainPageOffset - navHeight ? header.addClass('d-header--fixed') : header.removeClass('d-header--fixed');
    }

    //tabs

    tabs.find('.js-tabs-link').on('click', function (e) {
        var container = $(this).parents('.js-tabs');
        e.preventDefault();
        if($(this).hasClass('is-active')){
            return;
        }
        container.find('.js-tabs-link').removeClass('is-active');
        container.find('.js-tabs-block').fadeOut(300);
        $(this).addClass('is-active');
        container.find('#'+$(this).attr('data-link')).fadeIn(300);
    })

    //faqs

    faq.on('click', function () {
        var allItems = $(this).parents('.js-faqs').find('.js-faq');
        if(!$(this).hasClass('is-active')) {
            allItems.removeClass('is-active');
            $(this).addClass('is-active');
        } else {
            allItems.removeClass('is-active');
        }
    });
});
