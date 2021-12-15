module Celestial::Textured
  extend ActiveSupport::Concern

  included do
    belongs_to :texture, :class_name => 'Media::Texture', required: false
    belongs_to :atmosphere_texture, :class_name => 'Media::AtmosphereTexture', required: false
    belongs_to :bump_map, :class_name => 'Media::BumpMap', required: false
    belongs_to :specular_map, :class_name => 'Media::SpecularMap', required: false
  end
end
