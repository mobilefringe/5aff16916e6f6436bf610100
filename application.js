/*Created 2015-02-28 by CodeCloud Team*/
$(document).ready(function(){
    //dynamically changing copyright year
    var current_year = moment().year();
    $(".current_year").text(current_year);
});

function init(){
    
    $('.menu_toggler').click(function(){
        if ($('#header').hasClass('darken')){
            $('#header').addClass('lighten');
            $('#header').removeClass('darken');
            $('body').removeClass('no_scroll');
            $(".modal-backdrop").remove();
        } else {
            $('#header').removeClass('lighten');
            $('#header').addClass('darken');
            $('body').addClass('no_scroll');
            setTimeout(function() {$('<div class="modal-backdrop custom_backdrop"></div>').appendTo(document.body); }, 300);
        }
        $('.custom_mobile_menu').slideToggle();
    })
    
    $(".scroll").click(function(e) {
        e.preventDefault();
        $('html,body').animate( { scrollTop:$("#contact").offset().top } , 500);
    });
    $('#open_features').click(function(e){
        e.preventDefault();
        $('#feature_insider').slideToggle();
    });
    
    var previousScroll = 0;
    $(window).scroll(function(event){
        if(window.screen.width > 768){
            var scroller = $(this).scrollTop();
            if(scroller > (previousScroll + 10) || scroller < (previousScroll - 20)){
                $('#feature_insider').slideUp()
            }
            previousScroll = scroller;
        }
    });
    
    var navbar = document.getElementById("header");
	var headroom = new Headroom(navbar);
	headroom.init();
	

        
    function renderAll(){
        var pathArray = window.location.pathname.split( '/' );
        var slug = pathArray[pathArray.length-1];
        var blog = getBlogDataBySlug('home-features');
        blog_posts = blog.posts.sortBy(function(o){ return o.publish_date });
        var post_details = getPostDetailsBySlug(slug);
        
        renderMobileFeature("#mobile_feature_container", "#mobile_feature_template", blog_posts);
        renderFeaturePages("#feature_page_container", "#feature_page_template", blog_posts);
        renderFeaturePages("#footer_container", "#footer_template", blog_posts);
    }
    
    function renderFeaturePages(feature_page_container, feature_page_template, posts){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(feature_page_template).html();
        $.each(posts, function(key, val) {
            var rendered = Mustache.render(template_html, val);
            item_rendered.push(rendered);
        });
        $(feature_page_container).html(item_rendered.join(''));
    }
    
    function renderMobileFeature(mobile_feature_container, mobile_feature_template, posts){
        var item_list = [];
        var item_rendered = [];
        var template_html = $(mobile_feature_template).html();
        $.each(posts, function(key, val) {
            var rendered = Mustache.render(template_html, val);
            item_rendered.push(rendered);
        });
        $(mobile_feature_container).html(item_rendered.join(''));
    }
    
    loadMallDataCached(renderAll);  
    
}

function templateInit () {
    // console.log("template_init");
    $('<div class="loader_backdrop"><div class="loader">Loading...</div></div>').appendTo(document.body);
}
function show_content(){
    $(".yield").css({visibility: "visible"});
    $(".loader_backdrop").remove();
}
function renderGallery(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.photo_url.indexOf('missing.png') > -1) {
            val.gallery_image = "//codecloud.cdn.speedyrails.net/sites/57f7f01f6e6f647835890000/image/png/1461352407000/HallifaxLogo.png";
        } else {
            val.gallery_image = "//www.mallmaverick.com" + val.photo_url;
        }

        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderGeneral(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        
        val.template_image = "//mallmaverick.com" + val.photo_url;
        
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderBanner(banner_template,home_banner,banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each( banners , function( key, val ) {
        today = new Date();
        start = new Date (val.start_date);
        start.setDate(start.getDate());
        if(val.url == "" || val.url === null){
            val.css = "style=cursor:default;";
            val.noLink = "return false";
        }
        if (start <= today){
            if (val.end_date){
                end = new Date (val.end_date);
                end.setDate(end.getDate() + 1);
                if (end >= today){
                    item_list.push(val);  
                }
            } else {
                item_list.push(val);
            }
        }
    });

    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(home_banner).html(item_rendered.join(''));
}

function fadeContent(){
    $('#feature_insider .row').fadeIn();
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/png/1507232968000/Group 10.png";
        } else {
            val.post_image = val.image_url;
        }
        
        val.title = truncateWords(val.title,7);
        if(val.body.length > 100){
            val.description_short = val.body.substring(0, 100) + "...";
        } else {
            val.description_short = val.body;
        }
        
        val.description_short = val.description_short.replace("&amp;", "&");
        
        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        val.publish_date = published_on.format("MMM D, YYYY");
        
        //get first tag 
        if(val.tag != null && val.tag !== undefined) {
            val.main_tag = val.tag[0];
            // console.log("main tag", val.main_tag);
            val.show_tag = "display:inline-block";
        }
        else {
            val.show_tag = "display:none"
        }
        
        //get the tag that is capitalized
        // if(val.tag != null && val.tag !== undefined) {
        //     console.log(val.tag);
        //     $.each( val.tag , function( key, tag ) {
               
                
        //         if(tag[0] === tag[0].toUpperCase()){
        //             val.main_tag = tag;
        //         }
        //     })
        //     console.log("main tag", val.main_tag);
        // }
        
        val.counter = counter;
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter + 1;
        // item_list.push(val);
    });
    
    // $(container).show();
    $(container).html(item_rendered.join(''));
}
function renderPostDetails(container, template, collection, blog_posts){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each(collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/57f7f01f6e6f647835890000/image/png/1461352407000/HallifaxLogo.png";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 150){
            val.description_short = val.body.substring(0,150) + "...";
        }
        else{
            val.description_short = val.body;
        }

        var blog_list = [];
        $.each(blog_posts, function(key, val) {
            var slug = val.slug;
            blog_list.push(val.slug);
        });
        var current_slug = val.slug;
        var index = blog_list.indexOf(current_slug);
        if(index >= 0 && index < blog_list.length){
          var next_slug = blog_list[index + 1];
            if(next_slug != undefined || next_slug != null){
                val.next_post = "/blog/" + next_slug;
                val.next_show = "display: block";
            } else {
                val.next_show = "display: none";
            }
        }
        if(index >= 0 && index < blog_list.length){
            var prev_slug = blog_list[index - 1];
            if(prev_slug != undefined || prev_slug != null){
                val.prev_post = "/blog/" + prev_slug;
                val.prev_show = "display: block";
            } else {
                val.prev_show = "display: none";
            }
        }
        var published_on = moment(val.publish_date).tz(getPropertyTimeZone());
        val.publish_date = published_on.format("MMM D, YYYY");
        
        if(val.tag != null && val.tag !== undefined) {
            val.main_tag = val.tag[0];
            // console.log("main tag", val.main_tag);
            val.show_tag = "display:inline-block";
        }
        else {
            val.show_tag = "display:none"
        }
        
        val.twitter_title = val.title + " via @shopHSC";
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).html(item_rendered.join(''));
}

function truncateWords(str, no_words) {
    // return str.split(" ").splice(0,no_words).join(" ")+"...";

    str = str.trim().split(" ");
    if(str.length > no_words) {
        return str.splice(0, no_words).join(" ")+ "...";
    }
    else {
        return str.splice(0, no_words).join(" ");
    }
    
}