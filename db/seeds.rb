User.create!({:name => "Steven Brown", :email => "sgbrown.nz@gmail.com", :admin => true, :password => "MovieJamAdmin", :password_confirmation => "MovieJamAdmin"})
User.create!({:name => "Sandra Muller", :email => "mursan03@gmail.com", :admin => true, :password => "MovieJamAdmin", :password_confirmation => "MovieJamAdmin"})
User.create!({:name => "Julian Gommans", :email => "julian.s.gommans@gmail.com", :admin => true, :password => "MovieJamAdmin", :password_confirmation => "MovieJamAdmin"})



data = HTTParty.get("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/upcoming.json?apikey=sp2s3x4cpvbp8psp949pphfp")
hashed = JSON.parse(data.strip)
movies = hashed["movies"]

movies.each do |movie|
  if movie["alternate_ids"] == nil
    Upcomingmovie.create(title: movie["title"], description: movie["synopsis"], poster: movie["posters"]["profile"], rating: movie["ratings"]["critics_score"])
    Movie.create(title: movie["title"], description: movie["synopsis"], poster: movie["posters"]["profile"], rating: movie["ratings"]["critics_score"])
  else
    Upcomingmovie.create(title: movie["title"], description: movie["synopsis"], poster: movie["posters"]["profile"], rating: movie["ratings"]["critics_score"], imdb: movie["alternate_ids"]["imdb"])
    Movie.create(title: movie["title"], description: movie["synopsis"], poster: movie["posters"]["profile"], rating: movie["ratings"]["critics_score"], imdb: movie["alternate_ids"]["imdb"])
  end

end

movies.each do |movie|
  tester = Upcomingmovie.find_by(title: movie["title"])
  if tester.description == '' || tester.description == nil
    terms = movie["title"].split(' ').slice(0,4)
    new_description = search_omdb(terms.join('+'))
    tester.update(description: new_description["Plot"])
  end
end

movies.each do |movie|
  tester = Movie.find_by(title: movie["title"])
  if tester.description == '' || tester.description == nil
    terms = movie["title"].split(' ').slice(0,4)
    new_description = search_omdb(terms.join('+'))
    tester.update(description: new_description["Plot"])
  end
end


