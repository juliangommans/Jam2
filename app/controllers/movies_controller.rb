class MoviesController < ApplicationController

  def index
    redirect_to new_user_session_path unless user_signed_in?
  end

  def trailer
    @trailer = MoviesHelper::TrailerAddictAPI.trailer
    render json: @trailer
  end

  def mytrailer
    @mytrailer = MoviesHelper::TrailerAddictAPI.mytrailer(params[:imdb])
    render json: @mytrailer
  end

  def find
    @result = MoviesHelper::RottenTomatoesAPI.check_db(params[:title])
    render json: @result
  end

  def search
    @search = MoviesHelper::RottenTomatoesAPI.search(params[:terms])
    render json: @search
  end

  def dbsearch
    @search = MoviesHelper::RottenTomatoesAPI.db_search(params[:terms])
    render json: @search
  end

  def add_feature
    new_str = params[:title].slice(0..((params[:title].index(':'))-1))
    terms = new_str.gsub(' ','+')
    @feature = MoviesHelper::RottenTomatoesAPI.new_feature(terms)
    render json: @feature
  end

end
