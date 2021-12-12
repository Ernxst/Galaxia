# TODO: Ringed planets should be in same table as planets
class Celestial::Planet < Celestial::Base::CelestialBody
  include Celestial::Base::Spherical
  include Celestial::Base::Orbitable
  include Celestial::Base::Textured
  self.table_name = 'planets'
end
