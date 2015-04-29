class CreateUpcomingMovies < ActiveRecord::Migration
  def change
    create_table :upcomingmovies do |t|
      t.string :title
      t.text :description
      t.string :poster
      t.integer :rating
      t.integer :trailer_id
      t.integer :imdb
      t.timestamps null: false
    end
  end
end
