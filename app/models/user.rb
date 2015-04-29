class User < ActiveRecord::Base
  has_many :moviejams
  validates_uniqueness_of :name
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :rememberable, :trackable, :validatable, :recoverable
end
