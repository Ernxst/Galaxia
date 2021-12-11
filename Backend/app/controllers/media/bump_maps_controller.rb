class Media::BumpMapsController < Media::BaseTexturesController
  def initialize
    super
    @record = Media::BumpMap
    @folder = "bump_maps"
  end
end
