require 'rails_helper'

RSpec.describe MoviesController, type: :controller do

  describe '#index' do

    before do
      get :index
    end

    it 'returns an http status 200' do
      expect(response).to have_http_status(200)
    end

    it 'renders an index page' do
      expect(response).to render_template('index')
    end


  end



end
