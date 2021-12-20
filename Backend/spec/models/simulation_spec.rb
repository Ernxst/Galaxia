require 'rails_helper'

describe Simulation, :type => :model do
  context "when included in a class" do
    subject { create(:simulation) }

    describe "Validations" do
      it "is valid with valid attributes" do
        expect(subject).to be_valid
      end

      it "is not valid without a name" do
        subject.name = nil
        subject.save
        expect(subject.errors[:name]).not_to be_empty
      end

      it "is not valid with a long description" do
        subject.description = Faker::Lorem.characters(number: 5000)
        subject.save
        expect(subject.errors[:description]).not_to be_empty
      end
    end
  end
end
