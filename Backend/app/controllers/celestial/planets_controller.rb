class Celestial::PlanetsController < Celestial::CelestialBodyController
  def initialize
    super
    @record = Space::Planet
    @body = "planets"
  end
end
