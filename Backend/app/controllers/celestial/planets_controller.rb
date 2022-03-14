class Celestial::PlanetsController < Celestial::CelestialBodyController
  def initialize
    super
    @record = Space::Planet
    @body = "planets"
  end

  def optional_params
    { ring_texture_id: nil, tilt: nil, outer_radius: nil, inner_radius: nil }
  end
end
