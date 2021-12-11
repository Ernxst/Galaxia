require "json"

User.create(username: ENV['GUEST_USERNAME'], password: ENV['GUEST_PASSWORD'])

def insert_texture_maps(arr, record)
  arr.each do |texture|
    record.create(texture)
  end
end

file = File.open Rails.root.join('db/texture-maps.json')
tex_data = JSON.load(file, { :symbolize_names => true })
tex_data = tex_data.deep_transform_keys(&:to_sym)
insert_texture_maps(tex_data[:textures], Media::Texture)
insert_texture_maps(tex_data[:bump_maps], Media::BumpMap)
insert_texture_maps(tex_data[:specular_maps], Media::SpecularMap)
insert_texture_maps(tex_data[:atmosphere_textures], Media::AtmosphereTexture)
# insert_texture_maps(tex_data[:ring_textures], Media::RingTexture)