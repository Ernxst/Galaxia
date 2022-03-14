class Space::MoonSerializer < Celestial::TexturedSerializer
  def attributes(requested_attrs = nil, reload = nil)
    super.except(:ring_texture)
  end
end
