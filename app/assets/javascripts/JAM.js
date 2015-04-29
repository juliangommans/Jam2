var upcomingMovie = [];
var currentMovie;
var imdb = "";
var j= 0;
var movieList = [];
var found;
var movie;
var genre;


    function FeatureTrailer() {
      $('.viewTrailer').children().remove();
      $.getJSON("/trailer")
        .done(function (data) {
          AddFeatureToDB(data.title);
          LoadTrailer(data);
        });
    }

    function AddFeatureToDB(title){
      $.getJSON("/feature/add/"+title)
      .done(function (data) {
        $.getJSON("/find/"+data.Title)
        .done(function (data) {
          currentMovie = data;
          CurrentMoviePlot(data);
        });
      });
    }

    function LoadTrailer(data) {
      $('.viewTrailer').children().remove();
      $('.viewTrailer').append('<h2><strong>'+data.title+'</strong></h2>');
      $('.viewTrailer').append('<p><iframe width="640" height="390" src="http://v.traileraddict.com/'+data.trailer_id+
      '?autoplay=1" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" scrolling="no" frameborder="1"></iframe></p>');
    }

    function Upcoming() {
      $('.upcoming').children().remove();
      $.getJSON("/index/upcoming")
        .done(function (data) {
          shuffle(data);
          upcomingMovie = [];
          for(var i = 0; i < 10; i++){
               upcomingMovie[i] = data[i];
              $('.upcoming').append('<div class="col-md-1 poster" id="'+i+'"><img src="'+upcomingMovie[i].poster+'"><p>'+upcomingMovie[i].title+'</p>');
            }
         $('.poster').on('click', function(e) {
           e.preventDefault();
           $('.poster').removeClass('active');
           $(this).addClass('active');
           var index = $(this).attr('id');
            imdb = upcomingMovie[index].imdb;
            currentMovie = upcomingMovie[index];
            IMDBtrailer(imdb);
        });
      });
    }

  function AppendInfo(){
    $('.viewTrailer').children().remove();
    $('.viewTrailer').append('<h3><strong>'+currentMovie.title+'</strong></h3>');
    $('.viewTrailer').append('<h1 class="missing"><strong>"We could not find the trailer for this movie."</strong></h1>');
    CurrentMoviePlot(currentMovie);
  }

  function CurrentMoviePlot(movie){
    $.getJSON("/find/" + movie.title)
      .done(function (data) {
        if (data.description === null){
          $('.viewTrailer').append('<p> Unfortunately we could not find a description for this movie</p><br>');
        } else {
          $('#movieDescription').remove();
          $('.viewTrailer').append('<p id="movieDescription" style="text-align:justify">'+data.description+'</p><br>');
        }
        $('#movieScore').remove();
         $('.pleaseSelect').remove();
        $('.viewTrailer').append('<p class="pleaseSelect">Please rate how excited you are to see this movie before adding it to your list</p>');
        $('.viewTrailer').append('<select id="movieScore" onchange="CheckDB(this.value);" ><option value="">Select a pre-watch rating</option><option value="0">0 Stars</option><option value="1">1 Star</option><option value="2">2 Stars</option><option value="3">3 Stars</option><option value="4">4 Stars</option><option value="5">5 Stars</option></select>');
      });
  }

  function IMDBFeaturePage(imdb) {
    $('.viewTrailer').children().remove();
    $.getJSON("/mytrailer/" + imdb)
    .done(function (data) {
      $('.viewTrailer').append('<p>'+data.embed+'</p>');
    })
    .fail(function(data) {
      $('.viewTrailer').append('<h1 class="missing"><strong>"We could not find the trailer for this movie."</strong></h1>');
    });
  }

  function IMDBtrailer(imdb) {
    $('.viewTrailer').children().remove();
    $.getJSON("/mytrailer/" + imdb)
    .done(function (data) {
      LoadTrailer(data);
      CurrentMoviePlot(currentMovie);
    })
    .fail(function(data) {
      AppendInfo();
    });
  }


  function PostSearch(){
    $('.movie-link').children().remove();
    var terms = document.getElementById("query").value;
    if(terms === ''){
      alert("please enter something in the search field");
    }else{
      popup('popUpDiv');
      $.getJSON("/search/" + terms) // change 'dbsearch' to plain old 'search'
      .done(function (data) {
        searchedMovies = [];
        var movies = data; // .movies <= for when we get api keys back
        for(var i=0;i<movies.length;i++){
          searchedMovies[i] = movies[i];
          $('#a'+i+'').append('<img class="poster-search" src="'+movies[i].poster+'"><p class="p-title">'+movies[i].title+'</p>'); // s.profile <= append to 'poster' after we get api key back
        }
          $('.movie-link').on('click', function(e) {
            e.preventDefault();
            var index = $(this).attr('id').replace(/a/,'');
            currentMovie = movies[index];
                if (movies[index].imdb === undefined){ // .alternate_ids <= append to 'movies[index]' when api key is working
                  AppendInfo();
                } else {
                  imdb = movies[index].imdb; // .alternate_ids <= append to 'movies[index]' when api key is working
                  IMDBtrailer(imdb);
                }
          });
      });
      }
    }

  function Remove(id) {
    if (id.alternate_ids.imdb === undefined){
      $('#'+id.imdb+'').remove();
      movie = $.grep(movieList, function(e){ return e.id == id; });
      movieList.splice(movie[0],1);
    } else {
      $('#'+id.alternate_ids.imdb+'').remove();
      movie = $.grep(movieList, function(e){ return e.id == id; });
      movieList.splice(movie[0],1);
    }
  }

  function DoubleCheck(movie){
    for(var i = 0; i < movieList.length; i++) {
      if (movieList[i].title == movie.title) {
        found = true;
      break;
      }
    }
  }

  function CheckDB(score){
    if (score === ""){
      alert("Please select a score before adding your movie");
    } else {
    found = false;
    $.getJSON("/movie_list/" + currentMovie.title)
      .done(function (data) {
        if(data === true){
          found = true}
          UserPreRating(score);
      });
    }
  }

  function UserPreRating(score) {
    currentMovie["pre_rating"] = score;
    $('#movieScore').remove();
    AddList();
  }

  function UpdateList(){
    for (var i=0;i<movieList.length;i++){
      $.ajax({
        url: '/add/' + movieList[i].pre_rating +'/' +movieList[i].title,
        type: "GET",
        success: function(data,status){
          for (var z=0;z<movieList.length;z++){
            Remove(movieList[z]);
          }
        }
      })
    }
    setTimeout(function() {
    $('.myList').children().remove();
    $('.myList').append("<p>You've successfully added these movies to your Movie Jam list to view later.</p><a href='/moviejams'><p>Click here to go to your Movie Jam page.</p></a>");
  }, 1500);
  }

  function AddList() {
    DoubleCheck(currentMovie)
    if (found === true){
      alert("This movie has already been added to your list.")}
      else{
    $('.myList').children().remove();
    movieList.push(currentMovie);
    $('.viewTrailer input').remove();
    $('.pleaseSelect').remove();
    $('.viewTrailer').append('<p>Successfully added to "My Movie JAM", please click "update" to save.</p>');
      for(var i=0;i<movieList.length;i++){
        $('.myList').append('<li style="align:left" id="'+movieList[i].id+'">'+movieList[i].title+'<div class="remove">remove<div></li>');
          $('.remove').off('click');
          $('.remove').on("click",function(e){
            e.preventDefault;
            Remove($(this).parent().attr("id"));
          })
      }
       $('.myList').append('<br><input type="button" class="update" value="Update" onclick="UpdateList();"/>');
    }
  }

  function postRating(id, title){
    $('.pud').children().remove();
    popup('popUpDiv2');
    $.getJSON("/find/" + title)
      .done(function (data) {
        $('#pud').append('<p class="p-title"><strong>'+data.title+'</strong><p>');
        $('#pud').append('<img src="'+data.poster+'" class="p-title"><br>');
        $('#pud').append('<p id="selectInfo" class="p-title"> Please select a rating on how you found this movie.</p>')
        $('#pud').append('<select id="selectPost" class="p-title" onchange="postUpdate(this.value, '+id+');"><option value="">How would you rate this?</option><option value="0">0 Stars</option><option value="1">1 Star</option><option value="2">2 Stars</option><option value="3">3 Stars</option><option value="4">4 Stars</option><option value="5">5 Stars</option></select><br>');
        $('#pud').append('<p style="text-align: justify; padding: 5px">'+data.description+'<p>');
      })
  }

  function postUpdate(score, id){
    $('#selectInfo').replaceWith('<p class="p-title"> Click update to confirm your rating ('+score+'/5 stars) and close this window.</p>')
    $('#selectPost').replaceWith('<input type="button" style="margin:10px; margin-left:43%" class="update" value="Update" onclick="watched('+score+', '+id+');"/>');
  }

  function watched(score, id){
    if (score === ""){
      alert("Please select a score before the movie can be set to 'watched'")
    } else {
      $.ajax({
        url: '/watched/' + id +'/' + score,
        type: "GET",
        success: function(data,status){
          location.reload();
        }
      })
    }
  }

  function changeGenre(newGenre){
    genre = newGenre
    console.log(genre)
  }

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex ;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
