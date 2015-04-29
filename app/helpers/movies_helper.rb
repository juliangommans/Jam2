module MoviesHelper
  
  class TrailerAddictAPI
    include HTTParty
    
    def self.trailer
      data = HTTParty.get("http://api.traileraddict.com/?featured=yes")
      data = data.parsed_response["trailers"]["trailer"]
      return data.to_json
    end
    
    def self.mytrailer(imdb)
      data = HTTParty.get("http://api.traileraddict.com/?imdb=#{imdb}&count=1&width=640")
      data = data.parsed_response["trailers"]["trailer"]
      return data.to_json
    end

  end

  class RottenTomatoesAPI
    include HTTParty

    def self.upcoming
      data = HTTParty.get("http://api.rottentomatoes.com/api/public/v1.0/lists/movies/upcoming.json?apikey=ksh5rabkgg7mm8wdms9prax3")
      add_movies(hash(data))
      return data.strip
    end

    def self.search(name)
      terms = name.gsub(' ','+')
 
      
        data = HTTParty.get('https://itunes.apple.com/search?term='+terms+'&country=nz&media=movie&limit=10')#"http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey=ksh5rabkgg7mm8wdms9prax3&q="+terms+"&page_limit=10")
        add_movies(hash(data))
        local_list = db_search(name)
        return local_list
    end

    def self.db_search(name)
      data = Movie.where('title ILIKE ?', '%'+name+'%')
      return data
    end

    def self.check_description(movies)
      movies.each do |movie|
        tester = check_db(movie["trackName"])
        if tester.description == '' || tester.description == nil || tester.imdb == nil
          terms = movie["trackName"].split(' ').slice(0,4)
          new_description = search_omdb(terms.join('+'))
          imdb_no = new_description["imdbID"][1..-1]
            puts imdb_no
          tester.update(description: new_description["Plot"],imdb: imdb_no)
        end
      end
    end

    def self.search_omdb(movie)
      terms = movie.gsub(':','%3A')
      data = HTTParty.get('http://www.omdbapi.com/?t='+terms+'&y=&plot=full&r=json')
      return data
    end

    def self.check_db(movie)
      Movie.find_by(title: movie)
    end

    def self.hash(data)
      hashed = JSON.parse(data.strip)
      hashed = hashed["results"]
    end

    def self.add_movies(movies)
      movies.each do |movie|
        if !check_db(movie["trackName"])
          if movie["alternate_ids"] == nil
            Movie.create(title: movie["trackName"], description: movie["longDescription"], poster: movie["artworkUrl100"]) #genre: movie["primaryGenreName"]
          else
            Movie.create(title: movie["title"], description: movie["synopsis"], poster: movie["posters"]["profile"], rating: movie["ratings"]["critics_score"], imdb: movie["alternate_ids"]["imdb"])
          end
        end
      end
      # check_description(movies)
    end

    def self.new_feature(terms)
      data = HTTParty.get('http://www.omdbapi.com/?t='+terms+'&y=&plot=full&r=json')
      unless check_db(data["Title"])
        imdb_no = new_description["imdbID"][1..-1]
        puts imdb_no
        Movie.create(title: data["Title"], description: data["Plot"], poster: data["Poster"], imdb: imdb_no)
      end
      return data
    end

  end


end
