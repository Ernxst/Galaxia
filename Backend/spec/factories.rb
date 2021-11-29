FactoryBot.define do
  factory :user do
    username { Faker::Internet.username(specifier: 3) }
    password { Faker::Internet.password(min_length: 3, max_length: 24, mix_case: true, special_characters: true) }
  end
end
