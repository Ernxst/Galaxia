require 'factory_bot'

class StubbedBucket
  def files
    Random.rand(1..2).times.map { file(Faker::File.file_name) }
  end

  def file(path)
    StubbedFile.new(path)
  end
end

class StubbedFile
  def initialize(path)
    @path = path
  end

  def path
    @path
  end

  def media_url
    Faker::Internet.url
  end

  def public_url
    Faker::Internet.url
  end

  def api_url
    Faker::Internet.url
  end

  def size
    Faker::Number.within(range: 1024..1000000)
  end
end

module Helpers
  module MediaHelpers
    def self.insert_textures(categories=[:texture, :bump_map, :specular_map, :atmosphere_texture])
      categories.each do |map|
        Random.rand(1..2).times { FactoryBot.create(map) }
      end
    end
  end
end