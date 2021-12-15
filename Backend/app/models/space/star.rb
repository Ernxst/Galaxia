class Space::Star < ApplicationRecord
  include Celestial
  include Celestial::Spherical
  include Celestial::Textured
  self.table_name = 'stars'

  validates :luminosity, presence: { message: -> (object, _) do
    "The #{object.model_name.human.downcase} must have a value for the solar luminosity defined."
  end }, numericality: true

  has_many :simulations
end