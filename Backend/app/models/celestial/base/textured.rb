module Celestial
  module Base
    module Textured
      extend ActiveSupport::Concern
      included do
        has_one :texture, :class_name => 'Media::Texture', required: false
        has_one :atmosphere_texture, :class_name => 'Media::AtmosphereTexture', required: false
        has_one :bump_map, :class_name => 'Media::BumpMap', required: false
        has_one :specular_map, :class_name => 'Media::SpecularMap', required: false
      end

      def texture
        Media::Texture.find(texture_id)
      end

      def bump_map
        bump_map_id ? Media::BumpMap.find(bump_map_id) : nil
      end

      def specular_map
        specular_map_id ? Media::SpecularMap.find(specular_map_id) : nil
      end

      def atmosphere_texture
        atmosphere_texture_id ? Media::AtmosphereTexture.find(atmosphere_texture_id) : nil
      end

    end
  end
end