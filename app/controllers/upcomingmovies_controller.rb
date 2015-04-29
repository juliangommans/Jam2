class UpcomingmoviesController < ApplicationController

  def index
    @upcoming = Upcomingmovie.all
    render json: @upcoming
  end

end
