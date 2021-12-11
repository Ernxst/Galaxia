class Media::SpecularMapsController < Media::BaseTexturesController
  def initialize
    super
    @record = Media::SpecularMap
    @folder = "specular_maps"
  end
end
