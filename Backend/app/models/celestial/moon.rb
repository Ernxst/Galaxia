class Celestial::Moon < Celestial::Base::CelestialBody
  include Celestial::Base::Spherical
  include Celestial::Base::Orbitable
  include Celestial::Base::Textured
  self.table_name = 'moons'
end
