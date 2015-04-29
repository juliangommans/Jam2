class MoviejamsController < ApplicationController

	def add
    redirect_to new_user_session_path unless user_signed_in?
    movie = find_movie(params[:title])
    if !check_db(movie.id)
      j = Moviejam.new
      j.movie_id = movie.id
      j.user_id = current_user.id
      j.watched = false
      j.prerating = params[:id]
      j.save
    end
    redirect_to moviejams_path
	end

  def remove
    redirect_to new_user_session_path unless user_signed_in?
    @moviejam = Moviejam.find(params[:id])
    @moviejam.destroy
    redirect_to moviejams_path
  end

  def watched
    redirect_to new_user_session_path unless user_signed_in?
    @moviejam = Moviejam.find(params[:id])
    @moviejam.watched = true
    @moviejam.postrating = params[:score]
    @moviejam.save
    redirect_to moviejams_path
  end
  

  def index
    redirect_to new_user_session_path unless user_signed_in?
    @moviejams = Moviejam.where(user_id: current_user.id)
    @moviejams = Moviejam.sort_moviejams(@moviejams) #.json ? eventually
  end

  def movie_list
    movie = find_movie(params[:id])
    movie_exists = false
    if check_db(movie.id)
      movie_exists = true
    end
    render json: movie_exists
  end

  def watchJS
    @moviejams = Moviejam.where(user_id: current_user.id)
      for mj in @moviejams
        movie = Movie.find_by(movie_id: mj.movie_id)
        mj.moviename = movie.title  
        
      end
    render json: @moviejams
  end

  def find_movie(movie)
    Movie.find_by(title: movie)
  end

  def admin
    redirect_to new_user_session_path unless user_signed_in? and current_user.admin?
    users = User.all
    moviejams = Moviejam.all
    @admindata = Moviejam.sort_admindata(users, moviejams)
  end

  def feature
    redirect_to new_user_session_path unless user_signed_in?
    movie = Movie.find(params[:id])
    movies = Movie.all
    moviejams = Moviejam.all
    @featuredata = {movie: movie, movies: Moviejam.filter_feature_movies(movies, moviejams, current_user), moviejams: Moviejam.filter_feature_mjs(movie, moviejams)}
  end


  def check_db(movie)
    Moviejam.find_by(user_id: current_user, movie_id: movie)
  end

end
