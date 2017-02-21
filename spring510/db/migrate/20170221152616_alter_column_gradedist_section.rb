class AlterColumnGradedistSection < ActiveRecord::Migration[5.0]
  def change
  	change_column(:gradedists, :section, :string)
  end
end
