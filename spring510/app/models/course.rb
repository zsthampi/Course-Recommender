class Course < ApplicationRecord
	has_one :gradedist
	validates :name, presence: true
	validates :cid, presence: true
end
