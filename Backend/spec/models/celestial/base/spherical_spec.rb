require 'rails_helper'

describe Celestial::Spherical, :type => :model do
  context "when included in a class" do
    subject { Space::Planet.create(attributes_for(:planet)) }

    describe "Validations" do
      it "is valid with valid attributes" do
        expect(subject).to be_valid
      end

      it "is not valid without a radius" do
        subject.radius = nil
        subject.save
        expect(subject.errors[:radius]).not_to be_empty
      end
    end
  end
end
