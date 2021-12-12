class Celestial::PlanetsController < Celestial::CelestialBodyController
  def initialize
    super
    @record = Celestial::Planet
    @body = "planets"
  end
end
