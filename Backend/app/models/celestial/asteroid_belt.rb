class Celestial::AsteroidBelt < Celestial::Base::CelestialBody
  self.table_name = 'asteroid_belts'

  [:inner_semi_major, :outer_semi_major, :inner_eccentricity,
   :outer_eccentricity, :inclination, :num_of_asteroids, :depth].each do |attr|
    validates attr, presence: { message: -> (object, _) do
      "The #{object.model_name.human.downcase} must have a value for the #{attr.to_s.humanize.downcase} defined."
    end }, numericality: true
  end
end
