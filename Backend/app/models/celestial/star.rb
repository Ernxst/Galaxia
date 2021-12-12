class Celestial::Star < Celestial::Base::CelestialBody
  include Celestial::Base::Spherical
  include Celestial::Base::Textured
  self.table_name = 'stars'

  validates :luminosity, presence: { message: -> (object, _) do
    "The #{object.model_name.human.downcase} must have a value for the solar luminosity defined."
  end }, numericality: true
end